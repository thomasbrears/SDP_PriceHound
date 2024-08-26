// backend/index.js

import express from 'express';
import cors from 'cors'; // Import cors
import { connectToDb } from './db.js';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import retailerRoutes from './routes/retailers.js';

dotenv.config();

const app = express();

// Use CORS middleware
app.use(cors()); // This will allow requests from any origin

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/retailers', retailerRoutes);

connectToDb(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000');
  });
});
