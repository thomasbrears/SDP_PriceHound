import { db } from '../firebase.js';

export async function addToWishlist(req, res) {
  try {
    const { uid, name, price, logo, date } = req.body;
    const docRef = db.collection('users').doc(uid)
    docRef.update({
      [`wishlist.${name}`]: {
        name: name,
        price: price,
        logo: logo,
        date: date
      }
    });
    res.status(201).json({ uid, name, price, date});
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
}

export async function getWishlist(req, res) {
  const{ uid }= req.body;
  console.log("this is working")
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const user = userDoc.data();
    const wishlistItems = user.wishlist;
    console.log("sending stuff back")
    res.status(200).json(wishlistItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user wishlist' });
  }

}