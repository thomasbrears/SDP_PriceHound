import { db } from '../firebase.js';

export async function addToWishlist(req, res) {
    try {
      const { uid, name, price } = req.body;
      const docRef = db.collection('users').doc(uid)
      docRef.update({
        [`wishlist.${name}`]: {
          name: name,
          price: price
        }
      });
      res.status(201).json({uid, name, price});
    }
    catch (error) {
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  }
  