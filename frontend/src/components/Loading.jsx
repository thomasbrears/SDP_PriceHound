import React from 'react';
import '../css/Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <img src="images/PriceHoundIconNoBg.png" alt="Loading..." className="loading-icon" />
      </div>
    </div>
  );
};

export default Loading;
