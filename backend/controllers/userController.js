import { db } from '../firebase.js';


//retreives the user information from firebase (was used for testing)
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

//is used when a new user signs up, make a document in the users collection based on their uid
export async function addUser(req, res) {
  try {
    const { uid, name, email } = req.body;

    const docRef = db.collection('users').doc(uid)
    await docRef.set({
      uid,
      name,
      email,
      wishlist: {}
    });
    //and stores some basic information and opens an empty wishlist object
    res.status(201).json({uid, name, email});
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user' });
  }
}


