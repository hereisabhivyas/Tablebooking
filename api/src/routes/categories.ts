import { Router } from 'express';
import { Category } from '../models/Category.js';

const router = Router();

router.get('/', async (req, res) => {
  const filter: any = {};
  if (req.query.restaurantId) {
    filter.restaurantId = req.query.restaurantId;
  }
  const items = await Category.find(filter);
  res.json(items);
});

router.post('/', async (req, res) => {
  try {
    const created = await Category.create(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid category ID' });
  }
  try {
    const item = await Category.findById(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid category ID' });
  }
  try {
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid category ID' });
  }
  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
