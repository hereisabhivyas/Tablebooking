import { Router } from 'express';

const router = Router();

// Simple endpoint to verify image upload capability
// The actual image upload happens client-side via Cloudinary
// This endpoint can be used to store/verify image URLs in the database

router.post('/verify', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Verify that the URL is a valid Cloudinary URL
    if (!imageUrl.includes('cloudinary.com')) {
      return res.status(400).json({ error: 'Invalid Cloudinary URL' });
    }

    res.json({ ok: true, message: 'Image URL is valid' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
