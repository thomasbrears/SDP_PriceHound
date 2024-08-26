import React from 'react';
import '../css/PinkButton.css'; 

function PinkButton({ text, style }) {
  return (
    <button className="pink-button" style={style}>
      {text}
    </button>
  );
}

export default PinkButton;
