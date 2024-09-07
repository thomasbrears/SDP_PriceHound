import React, { useState, useEffect } from 'react';
import '../css/Message.css';

const Message = ({ message, type = 'success', duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  // Auto-hide the message after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Manually dismiss the message
  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`message ${type}`}>
      <p>{message}</p>
      <button className="close-button" onClick={handleClose}>X</button>
    </div>
  );
};

export default Message;
