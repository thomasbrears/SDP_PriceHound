import express from 'express';
import { addUser, getUserInfo } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUserInfo);
router.post('/', addUser);

export default router;