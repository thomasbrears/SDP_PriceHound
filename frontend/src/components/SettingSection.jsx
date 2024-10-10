import React, { useEffect, useState } from 'react';

const SettingSection = () => {
  const [adsBlocked, setAdsBlocked] = useState(() => JSON.parse(localStorage.getItem('adsBlocked')) || false);

  const toggleAdsBlocked = () => {
    const newBlockedState = !adsBlocked;
    setAdsBlocked(newBlockedState);
    localStorage.setItem('adsBlocked', JSON.stringify(newBlockedState));
  };
    useEffect(() => {
      // Load adsBlocked state from localStorage
      const storedAdsBlocked = JSON.parse(localStorage.getItem('adsBlocked'));
      if (storedAdsBlocked !== null) {
        setAdsBlocked(storedAdsBlocked);
      }
    }, []);
  
  return (
    <div className="checkbox-label">
      <label>
        <input type="checkbox" checked={adsBlocked} onChange={toggleAdsBlocked} />
        Block Ads
      </label>
    </div>
  );
};

export default SettingSection;