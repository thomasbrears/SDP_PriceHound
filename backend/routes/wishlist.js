import express from 'express';
import { addToWishlist, getWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.post('/', addToWishlist);
router.post('/get', getWishlist); 
export default router;