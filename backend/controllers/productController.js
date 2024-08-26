import { db } from '../db.js';

export async function getAllProducts(req, res) {
  try {
    const products = await db.collection('products').find().toArray();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function addProduct(req, res) {
  try {
    const product = req.body;
    await db.collection('products').insertOne(product);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
}