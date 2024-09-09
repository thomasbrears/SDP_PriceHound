import { db } from '../firebase.js';

export async function getUserInfo(req, res) {
  try {
    const userDoc = await db.collection('users').get();
    const user = {
      uid: userDoc.data().uid
    };
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
}

export async function addUser(req, res) {
  try {
    // Destructure the relevant fields from the request body
    const { uid, name, email } = req.body;

    const docRef = db.collection('users').doc(uid)
    await docRef.set({
      uid,
      name,
      email
    });
    res.status(201).json({ id: uid, name, email});
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user' });
  }
}


