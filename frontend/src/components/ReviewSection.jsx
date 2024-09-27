import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Message from '../components/Message'; 
import { useNavigate } from 'react-router-dom';

function ReviewSection({ searchQuery, mainProduct, user, onAverageRatingUpdate }) {
    const [reviews, setReviews] = useState([]);
    const [reviewData, setReviewData] = useState({ rating: 0, reviewText: '' }); // Store review info
    const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });
    const [ratingStats, setRatingStats] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }); // Store the count for each rating
    const [averageRating, setAverageRating] = useState(0); // Store the overall average rating
    const navigate = useNavigate();
  
    // Function to calculate the rating statistics and overall average rating
    const calculateRatingStats = (reviews) => {
      const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;
      let validReviewCount = 0; // Count only valid ratings
  
      reviews.forEach(review => {
        // Parse the rating as a number and check if it is valid
        const rating = parseFloat(review.rating);
  
        if (rating >= 1 && rating <= 5) {
          ratingsCount[rating] += 1;
          totalRating += rating;
          validReviewCount += 1; // Increment the count for valid reviews
        } else {
          console.warn(`Invalid rating found: ${review.rating}`);
        }
      });
  
      // Calculate average rating with valid reviews only
      const averageRating = validReviewCount > 0 ? (totalRating / validReviewCount).toFixed(1) : 0;
      
      setRatingStats(ratingsCount);
      setAverageRating(averageRating);

      if (onAverageRatingUpdate) {
        onAverageRatingUpdate(averageRating); // Notify parent component with the calculated average rating
      }
    };
  
    // Function to fetch reviews for the product
    const fetchReviews = async () => {
     if (!searchQuery) { // Check if searchQuery is valid
        setMessageInfo({ message: 'Invalid product query. Unable to fetch reviews.', type: 'error' });
        return;
     }
      const reviewApiUrl = process.env.NODE_ENV === 'production'
        ? 'https://pricehound.tech/api/reviews'
        : 'http://localhost:8000/api/reviews';
  
      try {
        const response = await axios.get(`${reviewApiUrl}/fetch-reviews/${searchQuery}`);
        if (response.data.success) {
          setReviews(response.data.reviews); // Set reviews state with fetched data
          calculateRatingStats(response.data.reviews); // Calculate rating stats
        } else {
          setMessageInfo({ message: 'Failed to fetch reviews.', type: 'error' });
        }
      } catch (error) {
        setMessageInfo({ message: 'Error: Unable to fetch reviews.', type: 'error' });
      }
    };
  
    // Fetch reviews when the component mounts or searchQuery changes
    useEffect(() => {
        if (searchQuery) {
        fetchReviews(); // Fetch reviews only if searchQuery is present
        } else {
        setMessageInfo({ message: 'Invalid search query. Unable to fetch reviews.', type: 'error' });
        }
    }, [searchQuery]);
  
    // Handle review form submission
    const handleReviewSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      if (!searchQuery) { // Check if searchQuery is valid before submission
        setMessageInfo({ message: 'Invalid product query. Unable to submit your review.', type: 'error' });
        return;
      }
  
      if (!user) {
        setMessageInfo({ message: 'You must be logged in to submit a review.', type: 'error' });
        return;
      }
  
      if (reviewData.rating === 0) {
        setMessageInfo({ message: 'Please provide a rating between 1 and 5 stars.', type: 'error' });
        return;
      }
  
      const reviewApiUrl = process.env.NODE_ENV === 'production'
        ? 'https://pricehound.tech/api/reviews'
        : 'http://localhost:8000/api/reviews';
  
      const reviewPayload = {
        productQuery: searchQuery,
        productTitle: mainProduct.title,
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        rating: reviewData.rating,
        reviewText: reviewData.reviewText,
        clientDate: new Date().toISOString()
      };
  
      try {
        const response = await axios.post(`${reviewApiUrl}/submit-review`, reviewPayload);
  
        if (response.data.success) {
          setMessageInfo({ message: 'Your review has been successfully submitted!', type: 'success' });
          // Clear form and fetch new reviews
          setReviewData({ rating: 0, reviewText: '' });
          fetchReviews(); // Fetch updated reviews
        } else {
          setMessageInfo({ message: 'Failed to submit your review. Please try again.', type: 'error' });
        }
      } catch (error) {
        setMessageInfo({ message: 'Error: Unable to submit your review.', type: 'error' });
      }
    };
  
    // Handle review input changes
    const handleReviewChange = (e) => {
      const { name, value } = e.target;
      setReviewData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    // Handle logout action
    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('icon');
        navigate("/signout?logout=true");
    };
  
    return (
      <div className="review-section-container">
        <div className="review-section">
          {messageInfo.message && <Message key={Date.now()} message={messageInfo.message} type={messageInfo.type} />}
  
          <h2>Product Rating & Reviews</h2>
          
          {/* Display Rating Stats */}
          <div className="rating-summary-container">
            <div className="rating-stats">
              <h3>Average Rating: {averageRating} / 5</h3>
              <div className="rating-summary">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-bar">
                    <span className="rating-label">{star} stars</span>
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${(ratingStats[star] / reviews.length) * 100}%`, maxWidth: '100px' }} /* Max width adjusted */
                    ></div>
                    <span className="rating-value">{ratingStats[star]}</span>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Write a Review Section */}
            <div className="review-form-container">
            <h3>Write a Review</h3>
            <form className="review-form" onSubmit={handleReviewSubmit}> {/* Add onSubmit handler */}
                <div className="rating-input">
                <label htmlFor="rating">Rating:</label>
                <select 
                    name="rating" 
                    id="rating"
                    value={reviewData.rating} 
                    onChange={handleReviewChange} 
                    required
                    disabled={!user} // Disable if not logged in
                >
                    <option value={0}>Select Rating</option>
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                </select>
                </div>
                <label className="review-label" htmlFor="reviewText">Review:</label>
                <textarea 
                name="reviewText"
                value={reviewData.reviewText}
                onChange={handleReviewChange}
                placeholder="Your Review (optional)"
                className="review-input"
                id="reviewText"
                disabled={!user} // Disable if not logged in
                ></textarea>
                {user ? (
                <p className="submit-info">
                    Submitting as: <span>{user.displayName} ({user.email})</span>
                    <br />
                    <a className="submit-info" onClick={handleLogout}>Not {user.displayName}? Switch Accounts</a>
                </p>
                ) : (
                <p className="submit-info">
                    You must <a href="/login">log in</a> to submit a review.
                </p>
                )}
                <button 
                className="submit-rating" 
                type="submit" 
                disabled={!user} // Disable button if not logged in
                >
                {user ? 'Submit Rating' : 'Login to Submit'}
                </button>
            </form>
            </div>
            </div>
  
          {/* Display Reviews */}
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <p><strong>{review.name}</strong></p> 
                    <div className="review-stars">
                      {Array.from({ length: review.rating }, (_, index) => (
                        <span key={index} className="star" role="img" aria-label="star">⭐</span>
                      ))}
                    </div>
                  </div>
                  {review.reviewText && <p className="review-text">{review.reviewText}</p>}
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
  
        {/* Advertisement Section */}
        <div className="ad-section">
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-1301948966347874"
            data-ad-slot="6032252070"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
          <p className="ad-label">Advertisement</p>
        </div>
      </div>
    );
  }
  
  export default ReviewSection;
