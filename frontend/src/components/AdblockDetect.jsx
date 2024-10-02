import React from 'react';
import { useDetectAdBlock } from 'adblock-detect-react';
import '../css/AdblockDetect.css'; 

const AdblockDetect = () => {
  // Detect adblock 
  const adBlockDetected = useDetectAdBlock();

  // If adblock detected, show blocking overlay
  if (adBlockDetected) {
    return (
      <div className="adblock-overlay">
        <div className="adblock-modal">
          <h2>We have detected you are using an Adblocker</h2>
          <p>We kindly ask you to disable your adblocker to continue to provide our services, thank you.</p>
          <p>Once you have disabled your Adblock, press the button to reload the page.</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            I have disabled my Adblocker
          </button>
        </div>
      </div>
    );
  }

  // If no adblocker is detected, render nothing
  return null;
};

export default AdblockDetect;
