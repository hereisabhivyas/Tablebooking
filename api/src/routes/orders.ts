import { Router } from 'express';
import { Order } from '../models/Order.js';

const router = Router();

// Get all orders or filter by restaurantId
router.get('/', async (req, res) => {
  try {
    const { restaurantId, status } = req.query;
    const filter: any = {};
    
    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid order ID' });
  }
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    console.log('=== CREATE ORDER REQUEST ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const { restaurantId, tableNumber, items, totalAmount, status, notes } = req.body;
    
    console.log('Field validation:');
    console.log('- restaurantId:', restaurantId, 'type:', typeof restaurantId, 'truthy:', !!restaurantId);
    console.log('- tableNumber:', tableNumber, 'type:', typeof tableNumber, 'isNumber:', typeof tableNumber === 'number');
    console.log('- items:', items, 'isArray:', Array.isArray(items), 'length:', items?.length);
    console.log('- totalAmount:', totalAmount, 'type:', typeof totalAmount, 'isNumber:', typeof totalAmount === 'number');
    console.log('- status:', status);
    console.log('- notes:', notes);
    
    const errors: string[] = [];
    if (!restaurantId || typeof restaurantId !== 'string') errors.push(`restaurantId must be a non-empty string, got: ${typeof restaurantId} "${restaurantId}"`);
    if (typeof tableNumber !== 'number') errors.push(`tableNumber must be a number, got: ${typeof tableNumber} "${tableNumber}"`);
    if (!Array.isArray(items)) errors.push(`items must be an array, got: ${typeof items}`);
    if (Array.isArray(items) && items.length === 0) errors.push('items array is empty');
    if (typeof totalAmount !== 'number') errors.push(`totalAmount must be a number, got: ${typeof totalAmount} "${totalAmount}"`);
    if (typeof totalAmount === 'number' && totalAmount < 0) errors.push(`totalAmount must be non-negative, got: "${totalAmount}"`);
    
    if (errors.length > 0) {
      console.error('❌ Validation errors:');
      errors.forEach(e => console.error('  -', e));
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors,
        received: { restaurantId, tableNumber, itemsLength: items?.length, totalAmount }
      });
    }

    if (Array.isArray(items) && items.length > 0) {
      console.log('Validating items array:');
      items.forEach((item: any, idx: number) => {
        console.log(`  Item ${idx}:`, JSON.stringify(item, null, 2));
      });
    }

    console.log('✅ All validations passed, creating order...');
    const created = await Order.create(req.body);
    console.log('✅ Order created successfully:', created._id);
    res.status(201).json(created);
  } catch (err: any) {
    console.error('❌ Error creating order:', err.message);
    console.error('Stack:', err.stack);
    res.status(400).json({ 
      error: 'Failed to create order',
      message: err.message,
      details: err.errors || null
    });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid order ID' });
  }
  try {
    const updated = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid order ID' });
  }
  try {
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
