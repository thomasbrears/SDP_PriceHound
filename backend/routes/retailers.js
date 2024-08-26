// retailers.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/retailers - Get all retailers
router.get('/', async (req, res) => {
  try {
    const retailers = await db.collection('retailers').find().toArray();
    res.json(retailers);
  } catch (error) {
    console.error('Error fetching retailers:', error);
    res.status(500).json({ message: 'Failed to fetch retailers' });
  }
});

// POST /api/retailers - Add a new retailer
router.post('/', async (req, res) => {
  const { name, verified, domain, shippingFrom, shippingTimeToNZ, freeShippingThreshold } = req.body;

  try {
    const result = await db.collection('retailers').insertOne({
      name,
      verified,
      domain,
      shippingFrom,
      shippingTimeToNZ,
      freeShippingThreshold: freeShippingThreshold || null,
    });
    res.status(201).json({ message: 'Retailer added successfully', retailerId: result.insertedId });
  } catch (error) {
    console.error('Error adding retailer:', error);
    res.status(500).json({ message: 'Failed to add retailer' });
  }
});

export default router;
