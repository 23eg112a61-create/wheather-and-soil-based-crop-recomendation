import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserModel from '../Models/UserModel.js';
import { sendVerificationEmail } from './email.js';

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
  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = isProd ? '__Secure-Token' : 'token';
  const token =
    req.cookies?.[cookieName] ||
    req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access denied. Missing authentication token.'
    });
  }

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);

    return res.status(403).json({
      error: 'Invalid or expired token.'
    });
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
      phone: phone || '',
      isVerified: true,
      verificationCode: null,
      verificationCodeExpires: null
    });

    await newUser.save();

    res.status(201).json({
      message: 'User account registered and verified successfully!',
      email: emailLower
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An internal server error occurred during registration.' });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: emailLower });
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'This account is already verified. Please log in.' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.status(200).json({ message: 'Email address verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'An internal server error occurred during verification.' });
  }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: emailLower });
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'This account is already verified. Please log in.' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Trigger real email sending via the nodemailer email service
    try {
      await sendVerificationEmail(emailLower, user.name, verificationCode);
    } catch (emailError) {
      console.error('Resend email sending failure:', emailError);
      return res.status(400).json({ error: emailError.message });
    }

    res.status(200).json({
      message: 'A fresh verification code has been generated.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'An internal server error occurred while resending the code.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and system role selection are required.' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email credentials or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email credentials or password.' });
    }

    // Ensure email is verified before logging in
    if (!user.isVerified) {
      return res.status(400).json({
        error: 'Please verify your email address before logging in.',
        isUnverified: true,
        email: user.email
      });
    }

    // Validate that user role matches the selected login role
    if (user.role !== role) {
      return res.status(400).json({ error: 'Access Denied: Account role does not match the selected login role.' });
    }

    // Generate JWT Token (HS256) - Extended to 3 months (90 days)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { algorithm: 'HS256', expiresIn: '90d' }
    );

    // Set secure cookie - Extended to 3 months (90 days)
    const isProd = process.env.NODE_ENV === 'production';
    const cookieName = isProd ? '__Secure-Token' : 'token';
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 90 * 24 * 60 * 60 * 1000
    });

    // Update last login time and activity log trail
    user.lastLogin = new Date();
    if (!user.activities) user.activities = [];
    user.activities.push({
      action: 'Logged in successfully',
      timestamp: new Date(),
      details: `Authenticated user as role [${user.role}] successfully.`
    });
    await user.save();

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        status: user.status,
        landArea: user.landArea,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An internal server error occurred during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = isProd ? '__Secure-Token' : 'token';
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/'
  });

  res.status(200).json({
    message: 'Logged out successfully.'
  });
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
