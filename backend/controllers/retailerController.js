import { db } from '../firebase.js';

export async function getAllRetailers(req, res) {
  try {
    const retailersSnapshot = await db.collection('retailers').get();
    const retailers = retailersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      const docRef = await db.collection('retailers').add(retailer);
      res.status(201).json({ id: docRef.id, ...retailer });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add retailer' });
    }
  }