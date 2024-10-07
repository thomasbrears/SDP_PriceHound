// CountrySelector.js
import React, { useEffect, useState } from 'react';

const countries = [
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },

];

const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    // Load the selected country from local storage
    const storedCountry = localStorage.getItem('selectedCountry');
    if (storedCountry) {
      setSelectedCountry(storedCountry);
    }
  }, []);

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
    localStorage.setItem('selectedCountry', countryCode);
  };

  return (
    <select className="country-selector" value={selectedCountry} onChange={handleCountryChange}>
      <option value="">Select a country</option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
