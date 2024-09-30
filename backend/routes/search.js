import express from 'express';
import { performScraping } from '../controllers/searchController.js';

const router = express.Router();

// Route to handle search requests
router.get('/', async (req, res) => {
  console.log('Incoming Request:', req.query); // print the incoming request query
  let searchTerm = req.query.query;
  let sortOrder = req.query.sort;
  let priceRange = req.query.priceRange;

  if (!searchTerm) {
    console.error('No search term provided');
    return res.status(400).json({ error: 'No search term provided' });
  }

  try {
    console.log('Scraping for term:', searchTerm);
    const results = await performScraping(searchTerm, sortOrder, priceRange);
    console.log('Scraping successful, returning results');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error performing search', details: error.message });
  }
});

export default router;