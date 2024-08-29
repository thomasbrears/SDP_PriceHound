import express from 'express';
import { getUserInfo } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUserInfo);

export default router;