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
      // Destructure the relevant fields from the request body
      const { name, domain, logo, verified, shippingDetails } = req.body;
  
      // Construct the retailer object
      const retailer = {
        name,
        domain,
        logo,
        verified,
        shippingDetails,
      };
  
      // Insert the retailer into the database
      await db.collection('retailers').insertOne(retailer);
      res.status(201).json(retailer);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add retailer' });
    }
  }