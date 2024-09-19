import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.js';
import retailerRoutes from './routes/retailers.js';
import userRoutes from './routes/users.js';
import contactRoutes from './routes/contact.js';
import wishlistRoutes from './routes/wishlist.js'
import dotenv from 'dotenv';
import { db } from './firebase.js';

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Cores middleware to allow cross-origin requests
app.use(cors());

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.status === 401) {
      res.status(401).redirect('/401');
    } else if (err.status === 403) {
      res.status(403).redirect('/403');
    } else if (err.status === 500 || err.statusCode === 500) {
      res.status(500).redirect('/500');
    } else {
      res.status(404).redirect('/404');
    }
  });

// Use the routes
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/products', productRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/userinfo', userRoutes);
app.use('/api/contact', contactRoutes);

// Use environment variable PORT, or default to 8000
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
