import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import DiseaseDetectionModel from '../Models/DiseaseDetectionModel.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Establish unique uploads directory outside the web root
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage: cryptographic random rename to prevent collisions and name execution vectors
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueHash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueHash}${ext}`);
  }
});

// Allow-list filter checking file extensions and mimetypes
const fileFilter = (req, file, cb) => {
  const allowedExts = ['.png', '.jpg', '.jpeg'];
  const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Rejected: Only PNG, JPG, and JPEG image extensions are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Enforced 5MB size limit to prevent Buffer Overflow / DoS
  fileFilter: fileFilter
});

// Dynamic AI vision simulator based on leaf target criteria
const runDiseaseClassifier = (cropHint = 'Tomato') => {
  const library = {
    tomato: {
      diseaseName: 'Tomato Late Blight',
      confidence: 94,
      treatment: 'Apply Mancozeb or Chlorothalonil fungicide spray immediately. Prune heavily infected lower leaves.',
      prevention: 'Enforce wide crop spacing for adequate ventilation. Avoid overhead sprinkler irrigation; apply drip watering directly to soil.'
    },
    potato: {
      diseaseName: 'Potato Late Blight',
      confidence: 88,
      treatment: 'Apply Metalaxyl-M or Copper-based fungicides. Destroy all infected tubers.',
      prevention: 'Always sow certified disease-free seed tubers. Enforce strict crop rotation schedules (3+ years).'
    },
    rice: {
      diseaseName: 'Rice Blast (Magnaporthe oryzae)',
      confidence: 96,
      treatment: 'Apply Tricyclazole or Isoprothiolane systemic fungicide. Reduce field water depth temporarily.',
      prevention: 'Avoid excessive nitrogenous fertilizer applications. Burn infected stubbles post-harvest and sow blast-resistant seeds.'
    },
    maize: {
      diseaseName: 'Maize Common Rust',
      confidence: 91,
      treatment: 'Apply Propiconazole or Pyraclostrobin sprays. Remove infected foliar stalks.',
      prevention: 'Sow high-resistance maize hybrids. Eradicate weed hosts near crop borders and rotate with legumes.'
    },
    default: {
      diseaseName: 'Bacterial Leaf Spot',
      confidence: 85,
      treatment: 'Apply Copper Hydroxide bacterial sprays. Sanitize all cutting tools and machinery.',
      prevention: 'Avoid working in fields when foliage is wet. Sow high-quality certified clean seeds and clear previous season crop residue.'
    }
  };

  const key = cropHint.toLowerCase().trim();
  return library[key] || library['default'];
};

// POST /api/disease/upload - Process leaf upload and execute AI simulation
router.post('/upload', authenticateToken, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer uploading error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Missing uploaded file payload.' });
    }

    try {
      const { cropHint } = req.body;
      const prediction = runDiseaseClassifier(cropHint || 'Tomato');

      // Create a virtual database entry
      const log = new DiseaseDetectionModel({
        userId: req.user.id,
        image: req.file.filename,
        diseaseName: prediction.diseaseName,
        confidence: prediction.confidence,
        treatment: prediction.treatment,
        prevention: prediction.prevention
      });

      await log.save();
      res.status(201).json({
        message: 'Image uploaded and analyzed successfully!',
        result: log
      });
    } catch (error) {
      console.error('Disease log error:', error);
      res.status(500).json({ error: 'Failed to record AI disease logs in the database.' });
    }
  });
});

// GET /api/disease/history - Fetch historical scans
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const history = await DiseaseDetectionModel.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query database for disease log history.' });
  }
});

// GET /api/disease/image/:filename - Secure path-traversal-free file serving endpoint
router.get('/image/:filename', authenticateToken, (req, res) => {
  try {
    // Sanitize input to isolate file basename and avoid folder walking attempts (../)
    const filename = path.basename(req.params.filename);
    const rawPath = path.join(process.cwd(), 'uploads', filename);

    // Strict boundary confirmation checks
    const resolvedPath = path.resolve(rawPath);
    const sandboxDir = path.resolve(path.join(process.cwd(), 'uploads'));

    // Enforce a trailing slash prefix check to protect against partial matching folder bypasses
    if (!resolvedPath.startsWith(sandboxDir + path.sep) && resolvedPath !== sandboxDir) {
      return res.status(403).json({ error: 'Access Denied: Sandbox directory boundary escape detected.' });
    }

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    // Set secure content-type-options and specific mime headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const ext = path.extname(filename).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    
    res.setHeader('Content-Type', mimeType);
    res.sendFile(resolvedPath);
  } catch (error) {
    res.status(500).json({ error: 'Secure file downloader encountered a serving error.' });
  }
});

export default router;
