import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import '../css/Global.css';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when scrolling down 300px from the top
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-button"><FaArrowUp /></button>
      )}
    </div>
  );
}

export default ScrollToTopButton;
