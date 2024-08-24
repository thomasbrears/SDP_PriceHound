import React from 'react';
import '../css/PinkButton.css'; 

function PinkButton({ text }) {
  return (
    <button className="pink-button">
      {text}
    </button>
  );
}

export default PinkButton;
