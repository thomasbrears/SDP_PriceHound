import { db } from '../db.js';

export async function getAllRetailers(req, res) {
  try {
    const retailers = await db.collection('retailers').find().toArray();
    res.status(200).json(retailers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch retailers' });
  }
}

export async function addRetailer(req, res) {
  try {
    const retailer = req.body;
    await db.collection('retailers').insertOne(retailer);
    res.status(201).json(retailer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add retailer' });
  }
}
