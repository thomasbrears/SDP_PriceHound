import { MongoClient } from 'mongodb';

let db;

async function connectToDb(callback) {
  const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.6aodh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
  try {
    await client.connect();
    db = client.db('PriceHoundDB');
    callback();
  } catch (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1); // Exit process with failure
  }
}

export { db, connectToDb };
