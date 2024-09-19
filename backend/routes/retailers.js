import express from 'express';
import { getAllRetailers, addRetailer } from '../controllers/retailerController.js';

const router = express.Router();

router.get('/', getAllRetailers);
router.post('/', addRetailer);

export default router;
