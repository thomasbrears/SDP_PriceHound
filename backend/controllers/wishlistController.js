import { admin, db } from '../firebase.js';


//adds an item to wishlist and stores some important info
export async function addToWishlist(req, res) {
  try {
    const { uid, name, price, logo, date } = req.body;
    //get the db reference based on the uid
    const docRef = db.collection('users').doc(uid)
    console.log(name);
    //updates the wishlist object to contain another object that holds all the field values
    docRef.update({
      [`wishlist.${name}`]: {
        name: name,
        price: price,
        logo: logo,
        date: date
      }
    });
    res.status(201).json({ uid, name, price, date });
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
}

//func for retreiving all the wishlist information
export async function getWishlist(req, res) {
  const { uid } = req.body;
  console.log("this is working")
  try {
    //gets wishlist items based on uid
    const userDoc = await db.collection('users').doc(uid).get();
    const user = userDoc.data();
    const wishlistItems = user.wishlist;
    console.log("sending stuff back")
    res.status(200).json(wishlistItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user wishlist' });
  }

}

//function for removing wishlist items
export async function removeFromWishlist(req, res) {
  const { uid, itemName } = req.body;
  try {
    //removes items based on the items name
    const docRef = await db.collection('users').doc(uid);
    await docRef.update({
      [`wishlist.${itemName}`]: admin.firestore.FieldValue.delete()
    });
    res.status(200).json("sucess!");
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
} 