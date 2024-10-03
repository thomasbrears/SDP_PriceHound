import { db } from '../firebase.js';
import admin from 'firebase-admin';

// Function to submit a review
export async function submitReview(req, res) {
  const { productQuery, productTitle, uid, name, email, rating, reviewText } = req.body;

  // Validate required fields
  if (!productQuery || !uid || !name || !email || !rating) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    // Reference to the product's reviews in Firestore
    const reviewsRef = db.collection('productReviews').doc(productQuery).collection('reviews');

    // Create a new review document
    const newReview = {
      uid,
      name,
      email,
      rating,
      reviewText: reviewText || '',
      date: admin.firestore.FieldValue.serverTimestamp() // Use Firestore server timestamp
    };

    await reviewsRef.add(newReview);

    res.status(200).json({ success: true, message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
}

// Function to fetch reviews based on productQuery
export async function fetchReviews(req, res) {
  const { productQuery } = req.params;

  try {
    // Reference to the product's reviews in Firestore
    const reviewsRef = db.collection('productReviews').doc(productQuery).collection('reviews');
    const reviewsSnapshot = await reviewsRef.orderBy('date', 'desc').get();

    // Create an array of reviews from the snapshot
    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
}
