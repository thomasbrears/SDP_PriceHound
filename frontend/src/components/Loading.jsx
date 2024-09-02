import React from 'react';
import '../css/Loading.css';

const Loading = ({ message }) => {  // Destructure message prop
  return (
    <div className="loading-container">
      <div className="spinner">
        <img src="images/PriceHoundIconNoBg.png" alt="Loading..." className="loading-icon" />
      </div>
      {message && <div className="loading-message">{message}</div>} {/* Display the message */}
    </div>
  );
};

export default Loading;
