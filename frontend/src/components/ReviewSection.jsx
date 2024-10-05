import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Toastify success/error/info messages
import { useNavigate } from 'react-router-dom';

// API URL for reviews
const REVIEW_API_URL = process.env.NODE_ENV === 'production'
? 'https://pricehound.tech/api/reviews'
: 'http://localhost:8000/api/reviews';

function ReviewSection({ searchQuery, mainProduct, user, onAverageRatingUpdate }) {
    const [reviews, setReviews] = useState([]);
    const [reviewData, setReviewData] = useState({ rating: 0, reviewText: '' }); // Store review info
    const [ratingStats, setRatingStats] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }); // Store the count for each rating
    const [averageRating, setAverageRating] = useState(0); // Store the overall average rating
    const [hoverRating, setHoverRating] = useState(0); // Store the hover rating
    const [hasReviewed, setHasReviewed] = useState(false); // Track if user has already reviewed
    const [existingReview, setExistingReview] = useState(null); // Store the existing review if found
    const [isEditing, setIsEditing] = useState(false); // Track if the user is editing a review
    const reviewsWithText = reviews.filter(review => review.reviewText && review.reviewText.trim() !== '');
    const navigate = useNavigate();
  
    /*------------------------------
    Function to calculate the rating statistics and overall average rating
    ------------------------------*/
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
  
     /*------------------------------
     Function to fetch reviews for the product
     ------------------------------*/
     const fetchReviews = async () => {
      if (!searchQuery) {
        toast.error('Invalid product query. Unable to fetch reviews.');
        return;
      }

      try {
        const response = await axios.get(`${REVIEW_API_URL}/fetch-reviews/${searchQuery}`);
        if (response.data.success) {
          setReviews(response.data.reviews); 
          calculateRatingStats(response.data.reviews);

          // Check if the user has already reviewed the product
          if (user) {
            const userReview = response.data.reviews.find(review => review.uid === user.uid);
            if (userReview) {
              setHasReviewed(true);
              setExistingReview(userReview);
              setReviewData({ rating: userReview.rating, reviewText: userReview.reviewText });
              setIsEditing(false); // Disable editing until the user clicks "Edit"
            }
          }
        } else {
          toast.error('Failed to fetch reviews.');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Sorry, we are unable to fetch reviews for this product.', {position: 'top-right'});
      }
    };
      
    /*------------------------------
    Fetch reviews when the component mounts or searchQuery changes
    ------------------------------*/
    useEffect(() => {
      if (searchQuery) {
        // Reset review-related states when the product changes
        setReviewData({ rating: 0, reviewText: '' });
        setHasReviewed(false);
        setExistingReview(null);
        setRatingStats({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }); // Reset rating stats
        setIsEditing(false); // Reset editing state
        fetchReviews();
      }
    }, [searchQuery]);

    /*------------------------------
    Additional useEffect to handle the when the user state changes
    ------------------------------*/
    useEffect(() => {
      if (user && searchQuery) {
        fetchReviews(); // Re-fetch reviews once the user is logged in or changed
      }
    }, [user, searchQuery]);
  
    /*------------------------------
    Handle star rating click
    ------------------------------*/
    const handleRatingChange = (newRating) => {
      if (!user) return; // Prevent rating if not logged in
      setReviewData((prevData) => ({
        ...prevData,
        rating: newRating,
      }));
    };

    /*------------------------------
    Handle review form submission
    ------------------------------*/
    const handleReviewSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      if (!searchQuery) { // Check if searchQuery is valid before submission
        toast.error('Sorry, we are unable to submit your review due to a product query issue. Please refresh the page and try again.');
        return;
      }
  
      if (!user) {
        toast.error('You must be logged in to submit a review. Please log in and try again.');
        return;
      }
  
      if (reviewData.rating === 0) {
        toast.error('Please provide a rating between 1 and 5 stars.');
        return;
      }
  
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
        const response = await axios.post(`${REVIEW_API_URL}/submit-review`, reviewPayload);
  
        if (response.data.success) {
          toast.success(hasReviewed ? 'Your review has been successfully updated!' : 'Your review has been successfully submitted! Your review will help others looking to purchase this product!.');
          setReviewData({ rating: 0, reviewText: '' });
          fetchReviews(); 
        } else {
          console.log("Failed to submit review:", response.data);
          toast.error('Failed to submit your review. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('Sorry, we are unable to submit your review at this time. Please try again later.');
      }
    };

    /*------------------------------
    Handle review deletion
    ------------------------------*/
    const handleDeleteReview = async () => {
    
      if (!existingReview || !user) {
        toast.error('Opps, we couldnt find that review or you are not loged in');
        console.log("No existing review or user not logged in.");
        return;
      }
    
      try {
        const response = await axios.delete(`${REVIEW_API_URL}/delete-review`, {
          data: {
            productQuery: searchQuery, // The product for which the review was written
            reviewId: existingReview.id, // The ID of the review to delete
            uid: user.uid, // User ID to verify ownership
          }
        });
            
        if (response.data.success) {
          toast.success('Your review has been deleted successfully.');
          setReviewData({ rating: 0, reviewText: '' });
          setHasReviewed(false);
          setExistingReview(null);
          setIsEditing(false);
          setRatingStats({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
          fetchReviews(); // Re-fetch reviews to update UI
        } else {
          console.log("Failed to delete review. Response:", response.data);
          toast.error('We failed to delete your review. Please refresh the page and try again.');
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error('Sorry, we are unable to delete your review at this time. Please try again later.');
      }
    };     
  
    /*------------------------------
    Handle review input changes
    ------------------------------*/
    const handleReviewChange = (e) => {
      const { name, value } = e.target;
      setReviewData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    /*------------------------------
    Handle logout action (from swtich accounts button)
    ------------------------------*/
    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('icon');
        navigate("/signout?logout=true");
    };

    /*------------------------------
    Star rating component
    ------------------------------*/
    const StarRating = ({ rating, onRatingChange, disabled }) => {
      return (
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (hoverRating || rating) ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onRatingChange(star)} // Set rating on click
              onMouseEnter={() => !disabled && setHoverRating(star)} // Set hover rating
              onMouseLeave={() => setHoverRating(0)} // Reset hover rating when not selected
              role="button"
              aria-label={`${star} star rating`}
            >
              ★
            </span>
          ))}
        </div>
      );
    };
  
    return (
      <div className="review-section-container">
        <div className="review-section">  
          <h2>Product Rating & Reviews</h2>
          
          {/*----------------------- 
              Display Rating Stats 
          --------------------------*/}
          <div className="rating-summary-container">
            <div className="rating-stats">
              <h3>Average Rating: {averageRating} / 5</h3> {/* Display the average rating */}
              <div className="rating-summary">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-bar">
                    <span className="rating-label"> {star} {star === 1 ? 'star' : 'stars'} </span> {/* Display the stars (1-5) */}
                    <div
                      className="rating-bar-fill" // Fill the bar based on the rating count
                      style={{ width: `${(ratingStats[star] / reviews.length) * 100}%`, maxWidth: '100px' }}
                    ></div>
                    <span className="rating-value">{ratingStats[star]}</span> {/* Display the number of ratings */}
                  </div>
                ))}
              </div>
            </div>

            {/*----------------------------------------- 
             Write (or Edit or delete) a Review Section
            --------------------------------------------*/}
            <div className="review-form-container">
              <h3>{hasReviewed ? 'Edit Your Review' : 'Write a Review'}</h3> {/* Dynamic heading - changes depending on new or exisitng review */}

              <form className="review-form" onSubmit={handleReviewSubmit}>
                {/* Star Rating Section */}
                <div className="rating-input">
                  <label htmlFor="rating" className="rating-label">Rating:
                    {hasReviewed && !isEditing && (
                      <i
                        className="fas fa-edit edit-icon" // Edit icon to allow user to edit their exisitng review
                        onClick={() => setIsEditing(true)}
                        title="Edit Rating"
                      ></i>
                    )}
                  </label>
                  <StarRating 
                    rating={reviewData.rating}
                    onRatingChange={handleRatingChange}
                    disabled={!user || (!isEditing && hasReviewed)} // Disable rating if user is not logged in or has already reviewed
                  />
                </div>

                {/* Review Section */}
                <div className="review-input-section">
                  <label htmlFor="reviewText" className="review-text-label">Review:
                    {hasReviewed && !isEditing && (
                      <i
                        className="fas fa-edit edit-icon"
                        onClick={() => setIsEditing(true)}
                        title="Edit Review"
                      ></i>
                    )}
                  </label>

                  <textarea // review text input
                    name="reviewText"
                    value={reviewData.reviewText}
                    onChange={handleReviewChange}
                    placeholder="Your Review (optional)"
                    className="review-input"
                    id="reviewText"
                    disabled={!user || (!isEditing && hasReviewed)} // Disable review input if user is not logged in or has already reviewed
                  ></textarea>
                </div>

                {/* Check if the user is logied in or not */}
                {user ? ( 
                  // Display users info if logged in
                  <p className="submit-info">
                    Submitting as: <span>{user.displayName} ({user.email})</span>
                    <br />
                    <a className="submit-info" onClick={handleLogout}>Not {user.displayName}? Switch Accounts</a>
                  </p>
                ) : (
                  // Display propmt to login if not logged in
                  <p className="submit-info">You must <a href="/login">log in</a> to submit a review.</p>
                )}

                {/* Buttons for editing review */}
                {isEditing && (
                  <div className="button-group">
                    {/* Button to cancel edit */}
                    <button type="button" className="discard-edit"
                      onClick={() => {
                        if (existingReview) {
                          setReviewData({
                            rating: existingReview.rating,
                            reviewText: existingReview.reviewText,
                          });
                        }
                        setIsEditing(false); // Exit editing mode
                      }} 
                    >Discard Edits</button>
                      
                    {/* Button to update review */}
                    <button className="submit-rating" type="submit">Update Review</button>

                    {/* Button to delete review */}
                    <button
                      type="button"
                      className="delete-review"
                      onClick={handleDeleteReview}
                    >Delete Review
                    </button>
                  </div>
                )}

                {/* Submit new Review Button */}
                {!isEditing && (
                  <button 
                    className="submit-rating"
                    type="submit"
                    disabled={!user || (!isEditing && hasReviewed)} // Disable submit button if user is not logged in or has already reviewed
                  >{user ? 'Submit Rating' : 'Login to Submit'}
                  </button>
                )}
              </form>
            </div>
          </div>
        
          {/*----------------------- 
            Display text Reviews
          --------------------------*/}
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            {reviewsWithText.length > 0 ? (
              reviewsWithText.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <p><strong>{review.name}</strong></p>  {/* Display users name */}
                    <div className="review-stars"> {/* Display the number of rating for the raiting*/}
                      {Array.from({ length: review.rating }, (_, index) => (
                        <span key={index} className="star" role="img" aria-label="star">⭐</span>
                      ))}
                    </div>
                  </div>
                  {/* Display the Review text */}
                  {review.reviewText && <p className="review-text">{review.reviewText}</p>}
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this product!</p> // Display if no reviews are found
            )}
          </div>
        </div>
  
       {/*----------------------- 
          Advertisement Section
        --------------------------*/}
        <div className="ad-section">
          {/* Ad component */}
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
