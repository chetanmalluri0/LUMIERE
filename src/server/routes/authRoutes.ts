import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/db.ts';
import { signToken, requireAuth, AuthRequest } from '../middleware/auth.ts';

export const authRouter = Router();

// Customer Registration
authRouter.post('/register', (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Strict Server-Side Validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
    }
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Full legal name is required.' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return res.status(400).json({ error: 'Valid contact telephone number is required.' });
    }

    const newUser = db.createUser({
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
    });

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: 'CUSTOMER',
      fullName: newUser.fullName,
    });

    res.status(201).json({
      user: newUser,
      token,
      message: 'Registration successful. Welcome to LUMIÈRE.',
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed.' });
  }
});

// Customer Login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: 'CUSTOMER',
      fullName: user.fullName,
    });

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      user: safeUser,
      token,
      message: 'Logged in successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed.' });
  }
});

// Current Authenticated Customer Profile
authRouter.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== 'CUSTOMER') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Customer record not found.' });
  }

  res.json({ user });
});

// Update Profile
authRouter.put('/profile', requireAuth, (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== 'CUSTOMER') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { fullName, phone } = req.body;
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ error: 'Valid telephone is required.' });
    }

    const updated = db.updateUser(req.user.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
    });

    res.json({ user: updated, message: 'Profile updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Update failed.' });
  }
});
