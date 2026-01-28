import { Router } from 'express';
import { Restaurant } from '../models/Restaurant.js';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await Restaurant.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  try {
    const created = await Restaurant.create(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }
  try {
    const item = await Restaurant.findById(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }
  try {
    const updated = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }
  try {
    const deleted = await Restaurant.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
