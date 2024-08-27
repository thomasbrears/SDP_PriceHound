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
      // Destructure the relevant fields from the request body
      const { name, description, category, subcategories, photos, prices } = req.body;
  
      // Construct the product objects
      const product = {
        name,
        description,
        category,
        subcategories,
        photos,
        prices,
      };
  
      // Insert the product into the database
      await db.collection('products').insertOne(product);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  }