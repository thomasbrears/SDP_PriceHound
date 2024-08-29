import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/PinkButton.css'; 

const PinkButton = ({ text, onClick, to }) => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button className="pink-button" onClick={handleClick}>
      {text}
    </button>
  );
};

export default PinkButton;