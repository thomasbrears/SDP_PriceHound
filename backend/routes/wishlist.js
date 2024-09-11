import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.post('/', addToWishlist);
router.post('/get', getWishlist);
router.post('/remove', removeFromWishlist);

export default router;