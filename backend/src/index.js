import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDb } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Define server port
const PORT = process.env.PORT || 8000;

// Use ES module compatible __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database and start the server
connectToDb(() => {
  console.log('Successfully connected to the database');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
