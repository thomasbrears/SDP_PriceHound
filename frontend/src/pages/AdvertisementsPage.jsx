import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import PinkButton from '../components/PinkButton';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../pages/css/AdvertisementsPage.css';
import MainHeadTitle from '../components/MainHeadTitle';

// List of allowed UIDs
const allowedUIDs = ['MuDHA50P1pbvbjf4uMIrfW9Ljmw1'];

function AdSubmissionPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    adImageUrl: '',
    adLink: '',
    adType: '',
    startDate: '',
    expiryDate: ''
  });

  const [ads, setAds] = useState([]); // To hold the list of ads
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if (!allowedUIDs.includes(uid)) {
          console.log('User UID not allowed. Redirecting...');
          toast.error('You do not have access to this page.');
          navigate('/'); // Redirect to home page or another page
        } else {
          console.log('User UID is allowed. Fetching ads...');
          fetchAds(); // Only fetch ads if the user is allowed
        }
      } else {
        console.log('User not logged in. Redirecting to login...');
        navigate('/login');
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [auth, navigate]);

  const fetchAds = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ads'); // Fetch all ads
      if (response.data.success) {
        setAds(response.data.ads); // Set all ads, not just active ones
      } else {
        setError('Failed to load ads.');
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError('Error fetching ads.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/ads/create-ad', formData);
      if (response.data.success) {
        toast.success('Ad submitted successfully!');
        setAds((prevAds) => [...prevAds, response.data.newAd]); // Add new ad to the list
        setFormData({
          companyName: '',
          email: '',
          adImageUrl: '',
          adLink: '',
          adType: '',
          startDate: '',
          expiryDate: ''
        });
      } else {
        toast.error('Failed to submit ad. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the ad. Please try again.');
    }
  };

  // Handle deleting an ad
  const handleDeleteAd = async (adId) => {
    try {
      const response = await axios.delete('http://localhost:8000/api/ads/delete-ad', {
        data: { adId }
      });
      if (response.data.success) {
        toast.success('Ad deleted successfully.');
        setAds(ads.filter((ad) => ad.id !== adId)); // Remove deleted ad from the list
      } else {
        toast.error('Failed to delete ad. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the ad. Please try again.');
    }
  };

  return (
    <div className="ad-submission-page">
      <MainHeadTitle title="Advertisements" />
      <div className="ad-form-container">
        <form className="ad-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="form-input"
              placeholder="Company Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Email Address"
              required
            />
          </div>

          <input
            type="url"
            name="adImageUrl"
            value={formData.adImageUrl}
            onChange={handleChange}
            className="form-input"
            placeholder="Ad Image URL"
            required
          />

          <input
            type="url"
            name="adLink"
            value={formData.adLink}
            onChange={handleChange}
            className="form-input"
            placeholder="Ad Link (URL)"
            required
          />

          <div className="form-group">
            <label>Ad Type</label>
            <select
              name="adType"
              value={formData.adType}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Ad Type</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <PinkButton text="Submit Ad" style={{ width: '100%' }} />
        </form>
      </div>

      {/* Display all ads */}
      <div className="ads-list-container">
        <h2>All Submitted Ads</h2>
        {loading ? (
          <p>Loading ads...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="ads-list">
            {ads.map((ad) => {
              const startDate = ad.startDate && ad.startDate.toDate ? new Date(ad.startDate.seconds * 1000).toLocaleDateString() : 'N/A';
              const expiryDate = ad.expiryDate && ad.expiryDate.toDate ? new Date(ad.expiryDate.seconds * 1000).toLocaleDateString() : 'N/A';
              return (
                <li key={ad.id} className="ad-item">
                  <img
                    src={ad.adImage || '/images/image-unavailable.jpg'}
                    alt={ad.companyName || 'Advertisement'}
                    className="ad-image-small"
                  />
                  <div className="ad-details">
                    <p><strong>Company:</strong> {ad.companyName}</p>
                    <p><strong>Email:</strong> {ad.email}</p>
                    <p><strong>Ad Type:</strong> {ad.adType}</p>
                    <p><strong>Start Date:</strong> {startDate}</p>
                    <p><strong>Expiry Date:</strong> {expiryDate}</p>
                    <p><strong>Ad Link:</strong> <a href={ad.adLink} target="_blank" rel="noopener noreferrer">{ad.adLink}</a></p>
                    <button onClick={() => handleDeleteAd(ad.id)}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdSubmissionPage;
