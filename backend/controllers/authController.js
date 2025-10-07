import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../models/userModel.js';
import { sendVerificationEmail } from '../utils/emailService.js';

const signToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: expiresIn
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password, designation = 'User' } = req.body; // Add designation

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const newUser = await User.create({
      username,
      email,
      password,
      designation, // Add designation
      verificationToken,
      verificationTokenExpiry
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please check your email to verify your account.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    if (user.isBlocked) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been blocked. Please contact administrator.'
      });
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token (allow even if not verified)
    const token = signToken(user.id);

    // Return different message based on verification status
    const message = user.isVerified 
      ? 'Login successful!' 
      : 'Login successful! Please verify your email to access all features.';

    res.json({
      status: 'success',
      message: message,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        lastLoginAt: user.lastLoginAt,
        registeredAt: user.registeredAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login'
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token'
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.json({
      status: 'success',
      message: 'Email verified successfully! You can now log in.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during email verification'
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id', 
        'username', 
        'email', 
        'designation', // Add designation
        'isVerified', 
        'isBlocked', 
        'createdAt',
        'lastLoginAt',
        'registeredAt'
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      data: users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching users'
    });
  }
};

export const blockUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    await User.update(
      { isBlocked: true },
      { where: { id: userIds } }
    );

    res.json({
      status: 'success',
      message: 'Users blocked successfully'
    });

  } catch (error) {
    console.error('Block users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while blocking users'
    });
  }
};

export const unblockUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    await User.update(
      { isBlocked: false },
      { where: { id: userIds } }
    );

    res.json({
      status: 'success',
      message: 'Users unblocked successfully'
    });

  } catch (error) {
    console.error('Unblock users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while unblocking users'
    });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    await User.destroy({
      where: { id: userIds }
    });

    res.json({
      status: 'success',
      message: 'Users deleted successfully'
    });

  } catch (error) {
    console.error('Delete users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting users'
    });
  }
};

export const deleteUnverifiedUsers = async (req, res) => {
  try {
    // Delete ALL unverified users (no time restriction)
    const result = await User.destroy({
      where: {
        isVerified: false
      }
    });

    res.json({
      status: 'success',
      message: `Deleted ${result} unverified users.`,
      deletedCount: result
    });

  } catch (error) {
    console.error('Delete unverified users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting unverified users'
    });
  }
};