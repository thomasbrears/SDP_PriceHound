import express from 'express';
import { connectToDb } from './db.js';
import productRoutes from './routes/products.js';
import retailerRoutes from './routes/retailers.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the routes
app.use('/api/products', productRoutes);
app.use('/api/retailers', retailerRoutes);

// Connect to the database and start the server
connectToDb(() => {
    app.listen(8000, () => {
        console.log('Server is running on port 8000');
    });
});
