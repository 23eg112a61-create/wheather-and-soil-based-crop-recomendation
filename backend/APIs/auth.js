import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserModel from '../Models/UserModel.js';

const router = express.Router();

// Robust fallback resolution for JWT Secret as required by secure web guidelines
let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (process.env.NODE_ENV === 'production') {
    console.error("FATAL: JWT_SECRET environment variable is missing in production. Exiting...");
    process.exit(1);
  } else {
    console.warn("WARNING [Security]: JWT_SECRET is not set. Generating an ephemeral cryptographic fallback secret key.");
    jwtSecret = crypto.randomBytes(32).toString('hex');
  }
}

// Password validation function (Min 8 chars, allow all characters)
const isValidPassword = (password) => {
  return password && password.length >= 8;
};

// Middleware: Authenticate JWT Token
export const authenticateToken = (req, res, next) => {
  const token = req.cookies['__Secure-Token'] || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Missing authentication token.' });
  }

  try {
    const verified = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// Middleware: Check Authorization Roles
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required fields.' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const emailLower = email.toLowerCase().trim();
    const userExists = await UserModel.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // Generate unique salt and hash using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name: name.trim(),
      email: emailLower,
      password: hashedPassword,
      role: role || 'farmer',
      location: location || '',
      phone: phone || ''
    });

    await newUser.save();
    res.status(201).json({ message: 'User account registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An internal server error occurred during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email credentials or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email credentials or password.' });
    }

    // Generate JWT Token (HS256)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { algorithm: 'HS256', expiresIn: '24h' }
    );

    // Set secure cookie
    res.cookie('__Secure-Token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An internal server error occurred during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('__Secure-Token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.status(200).json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile data.' });
  }
});

export default router;
