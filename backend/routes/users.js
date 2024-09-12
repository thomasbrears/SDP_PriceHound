import express from 'express';
import { addUser, getUserInfo } from '../controllers/userController.js';

const router = express.Router();
//routes and functions for user info
router.get('/', getUserInfo);
router.post('/', addUser);

export default router;