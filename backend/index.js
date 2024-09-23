import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.js';
import retailerRoutes from './routes/retailers.js';
import userRoutes from './routes/users.js';
import contactRoutes from './routes/contact.js';
import wishlistRoutes from './routes/wishlist.js'
import searchApiRoutes from './searchapi.js';
import dotenv from 'dotenv';
import { db } from './firebase.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from prod-env.yaml
try {
  const envConfig = yaml.load(fs.readFileSync(path.join(__dirname, 'prod-env.yaml'), 'utf8'));
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
} catch (err) {
  console.error('Error loading prod-env.yaml:', err);
}

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Cores middleware to allow cross-origin requests
app.use(cors({
  origin: 'https://pricehound.tech',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true
}));

// Use the routes
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/products', productRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/userinfo', userRoutes);
app.use('/api/contact', contactRoutes);

app.use('/api/search', searchApiRoutes); // Search API

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../build')));

// Serve index.html for all non-API routes
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

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

// Use environment variable PORT, or default to 8000
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
