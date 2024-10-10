import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdSection.css';

const AdSection = ({ adType, maxAds }) => { // Accept adType and maxAds as props
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adVisible, setAdVisible] = useState(true); // State to control ad visibility
  const [adsBlocked, setAdsBlocked] = useState(() => {
    // Initialize the state based on local storage
    return JSON.parse(localStorage.getItem('adsBlocked')) || false;
  });
  const [user, setUser] = useState(null); // New state to track registration


  // Define rotation interval
  const rotateInterval = process.env.NODE_ENV === 'production' ? 30000 : 10000; // 30s for production, 10s for dev

    // Check if UserId exists in local storage to determine if user is registered
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser); 
      }
    }, []);

  useEffect(() => {
    const shuffleAds = (adsList) => {
      for (let i = adsList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [adsList[i], adsList[j]] = [adsList[j], adsList[i]];
      }
      return adsList;
    };

    const fetchAds = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/ads');
        if (response.data.success) {
          const filteredAds = shuffleAds(response.data.ads.filter(ad => ad.adType === adType));
          setAds(filteredAds.slice(0, maxAds)); // Set limited ads based on maxAds
        } else {
          setError('Failed to load ads');
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
        setError('Error fetching ads');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [adType, maxAds]);

  // Rotate ads every defined interval
  useEffect(() => {
    if (ads.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, rotateInterval);

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [ads, rotateInterval]);

  // Handle close ad functionality
  const handleCloseAd = () => {
    setAdVisible(false); // Set ad visibility to false to hide ads
  };

  const handleBlockAds = () => {
    setAdsBlocked(true);
    localStorage.setItem('adsBlocked', JSON.stringify(true)); // Save blocked state  to localStorage
  };
  if (loading) {
    return <div className="ad-section">Loading ads...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  if (!adVisible || adsBlocked) {
    return null; 
  }

  return (
    <div className="ad-section">
      {ads.length > 0 ? (
        <div key={ads[currentAdIndex].id} className="ad-container">
          {/* Close button */}
          {user && (
            <>
              <button className="close-ad-button" onClick={handleCloseAd}>X</button>
              {/* <button className="block-ad-button" onClick={handleBlockAds}>Block Ads</button>
            */}
            </> 
          )}
          <a href={ads[currentAdIndex].adLink} target="_blank" rel="noopener noreferrer">
            <img
              src={ads[currentAdIndex].adImage}
              alt={ads[currentAdIndex].companyName}
              className={`ad-image ${ads[currentAdIndex].adType === 'landscape' ? 'ad-landscape' : 'ad-portrait'}`}
              loading="lazy"
            />
          </a>
          <p className="ad-label">Advertisement by <strong>{ads[currentAdIndex].companyName}</strong></p>
          <p className="ad-label"><a href="/contact">Advertise with us today</a></p>

        </div>
      ) : (
        <p> No ads available</p>
      )}
    </div>
  );
};


export default AdSection;
