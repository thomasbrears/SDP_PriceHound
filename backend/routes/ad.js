import express from 'express';
import { getAllAds, createAd, deleteAd } from '../controllers/adController.js';
import multer from 'multer';

// Set up multer to store uploaded images
const storage = multer.memoryStorage(); // stores file in memory
const upload = multer({ storage });

const router = express.Router();

// Route to get active ads
router.get('/', getAllAds);

// Route to create a new ad (with file upload handling using multer)
router.post('/create-ad', upload.single('adImage'), createAd);

// Route to delete an ad
router.delete('/delete-ad', deleteAd);

export default router;
