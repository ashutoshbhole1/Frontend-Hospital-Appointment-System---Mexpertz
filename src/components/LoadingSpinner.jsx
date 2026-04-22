import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`spinner-container ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-heart">🫀</div>
      </div>
      <p>Consulting Dr. Ashutosh...</p>
    </div>
  );
};

export default LoadingSpinner;
