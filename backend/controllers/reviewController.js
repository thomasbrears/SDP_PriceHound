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

    // Check if the user has already submitted a review for this product
    const existingReviewSnapshot = await reviewsRef.where('uid', '==', uid).get();

    if (!existingReviewSnapshot.empty) {
      // Update the existing review
      const existingReviewDoc = existingReviewSnapshot.docs[0]; // Get the first review (should be the only one)
      await reviewsRef.doc(existingReviewDoc.id).update({
        rating,
        reviewText: reviewText || '',
        date: admin.firestore.FieldValue.serverTimestamp() // Update timestamp
      });
      return res.status(200).json({ success: true, message: 'Review updated successfully.' });
    } else {
      // Create a new review
      const newReview = {
        uid,
        name,
        email,
        rating,
        reviewText: reviewText || '',
        date: admin.firestore.FieldValue.serverTimestamp() // Use Firestore server timestamp
      };
      await reviewsRef.add(newReview);
      return res.status(200).json({ success: true, message: 'Review submitted successfully.' });
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
}

// Function to fetch reviews based on productQuery
export async function fetchReviews(req, res) {
  const { productQuery } = req.params;

  try {
    // Reference to the products reviews in Firestore
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

// Function to delete a review
export async function deleteReview(req, res) {
  const { productQuery, reviewId, uid } = req.body;

  if (!productQuery || !reviewId || !uid) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    // Reference to the specific review
    const reviewRef = db.collection('productReviews').doc(productQuery).collection('reviews').doc(reviewId);

    // Fetch the review to ensure it belongs to the user
    const reviewSnapshot = await reviewRef.get();

    if (reviewSnapshot.exists && reviewSnapshot.data().uid === uid) {
      // Delete the review
      await reviewRef.delete();
      return res.status(200).json({ success: true, message: 'Review deleted successfully.' });
    } else {
      return res.status(403).json({ success: false, message: 'You are not authorised to delete this review.' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review.' });
  }
}