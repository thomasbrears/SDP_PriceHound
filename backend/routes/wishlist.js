import express from 'express';
import { addToWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.post('/', addToWishlist);

export default router;