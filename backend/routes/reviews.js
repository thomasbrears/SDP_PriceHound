import express from 'express';
import { submitReview, fetchReviews } from '../controllers/reviewController.js';

const router = express.Router();

// Route to submit a review
router.post('/submit-review', submitReview);

// Route to fetch reviews based on productQuery
router.get('/fetch-reviews/:productQuery', fetchReviews);

export default router;