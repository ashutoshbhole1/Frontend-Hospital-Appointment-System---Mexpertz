import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="animated-name">Dr. Ashutosh</div>
          <h2>HealthCare<span>Hub</span></h2>
          <p>Providing world-class cardiac care and surgical excellence with a commitment to patient health and recovery.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Book Appointment</Link></li>
            <li><Link to="/login">Patient Portal</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Contact Us</h3>
          <ul>
            <li>Indore,Madhya Pradesh</li>
            <li>452001</li>
            <li>Phone: 9303580738</li>
            <li>Email: care@drashutosh.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Dr. Ashutosh Cardiac Care. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#!">Privacy Policy</a>
          <span style={{margin: '0 10px'}}>|</span>
          <a href="#!">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
