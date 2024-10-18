import express from 'express';
import { submitReview, fetchReviews, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

// Route to submit a review
router.post('/submit-review', submitReview);

// Route to fetch reviews based on productQuery
router.get('/fetch-reviews/:productQuery', fetchReviews);

// Route to delete a review
router.delete('/delete-review', deleteReview);

export default router;