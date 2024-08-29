import React from 'react';
import '../css/PinkButton.css'; 

function PinkButton({ text, style, onClick}) {
  return (
    <button className="pink-button" style={style} onClick={onClick}>
      {text}
    </button>
  );
}

export default PinkButton;
