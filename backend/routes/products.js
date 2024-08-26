import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/products - Add a new product
router.post('/', async (req, res) => {
  const { name, description, photos, prices } = req.body;

  try {
    const result = await db.collection('products').insertOne({
      name,
      description,
      photos,
      prices: prices.map(price => ({
        retailerId: price.retailerId,
        price: price.price,
        link: price.link,
      }))
    });
    res.status(201).json({ message: 'Product added successfully', productId: result.insertedId });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

export default router;
