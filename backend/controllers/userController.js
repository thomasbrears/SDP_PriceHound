import { db } from '../db.js';

export async function getUserInfo(req, res) {
    try {
        //this userid is just for testing
        const userId = "4sz2TsCx6Be9f5hOwwwsMrYlOUn2";
        const user = await db.collection('users').findOne({ uid: userId });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  }