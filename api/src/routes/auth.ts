import { Router } from 'express';
import { Restaurant } from '../models/Restaurant.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Register a new restaurant
// Body: { name, contactEmail, password, contactPhone?, address?, image? }
router.post('/register', async (req, res) => {
  try {
    const { name, contactEmail, password, contactPhone, address, image } = req.body || {};
    if (!name || !contactEmail || !password) {
      return res.status(400).json({ error: 'name, contactEmail and password are required' });
    }

    const existing = await Restaurant.findOne({ contactEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await Restaurant.create({
      name,
      contactEmail,
      contactPhone,
      address,
      image,
      passwordHash,
    });

    const json = created.toJSON();
    return res.status(201).json(json);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Login restaurant
// Body: { contactEmail, password }
router.post('/login', async (req, res) => {
  try {
    const { contactEmail, password } = req.body || {};
    if (!contactEmail || !password) {
      return res.status(400).json({ error: 'contactEmail and password are required' });
    }

    const restaurant = await Restaurant.findOne({ contactEmail });
    if (!restaurant || !(restaurant as any).passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, (restaurant as any).passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json(restaurant.toJSON());
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;