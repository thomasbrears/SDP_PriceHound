import express from 'express';
import cors from 'cors';
import { connectToDb } from './db.js';
import productRoutes from './routes/products.js';
import retailerRoutes from './routes/retailers.js';
import userRoutes from './routes/users.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Cores middleware to allow cross-origin requests
app.use(cors());

// Use the routes
app.use('/api/products', productRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/userinfo', userRoutes);
// Use environment variable PORT, or default to 8000
const PORT = process.env.PORT || 8000;

// Connect to the database and start the server
connectToDb(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log('Server is running on port 8000');
    });
});
