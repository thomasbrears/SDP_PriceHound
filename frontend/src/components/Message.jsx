import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../css/Message.css';

const Message = ({ message, type = 'success', duration = 5000 }) => {
  const [visible, setVisible] = useState(false);
  const [prevMessage, setPrevMessage] = useState('');

  useEffect(() => {
    if (message) {
      if (message === prevMessage) {
        // Temporarily hide the message and then show it again to force re-render
        setVisible(false);
        setTimeout(() => {
          setVisible(true);
        }, 100); // Add a slight delay before showing the same message again
      } else {
        setVisible(true);
      }
      setPrevMessage(message);
    }
  }, [message, prevMessage]);

  // Auto-hide the message after the specified duration
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  // Manually dismiss the message
  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  // Determine the icon based on the type
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className={`message ${type}`}>
      <div className="message-icon">{renderIcon()}</div>
      <p>{message}</p>
      <button className="close-button" onClick={handleClose}>X</button>
    </div>
  );
};

export default Message;
