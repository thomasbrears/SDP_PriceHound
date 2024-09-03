
import { db } from '../firebase.js';

// Utility function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');  // Remove all non-word characters except hyphens
};

export async function getAllProducts(req, res) {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function addProduct(req, res) {
    try {
      // Destructure the relevant fields from the request body
      const { name, description, category, subcategories, photos, prices } = req.body;

      // Generate slug from the product name
      const slug = generateSlug(name);

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
      const docRef = await db.collection('products').add(product);
      res.status(201).json({ id: docRef.id, ...product });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  }