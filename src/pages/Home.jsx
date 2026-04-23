import React from 'react';
import { Link } from 'react-router-dom';
import doctorHero from '../assets/hero.jpg';
import doctorAbout from '../assets/about image.jpg';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">World-Class Cardiac Care</span>
          <h1 className="hero-title">
            Your Heart is in <span>Expert Hands.</span>
          </h1>
          <p className="hero-description">
            Experience advanced cardiac treatments and compassionate care led by Dr. Ashutosh,
            a renowned Heart Surgeon dedicated to your long-term heart health.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-cta">Book Consultation</Link>
          </div>

          <div className="trust-badges">
            <div className="trust-item">
              <span className="trust-number">15+</span>
              <span className="trust-label">Years Experience</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">5k+</span>
              <span className="trust-label">Successful Surgeries</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">99%</span>
              <span className="trust-label">Patient Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <img src={doctorHero} alt="Dr. Ashutosh - Heart Surgeon" className="hero-image" />
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <span className="section-tag">Specializations</span>
        <h2 className="section-title">Advanced Cardiac Services</h2>

        <div className="services-grid">
          <div className="service-card">
            <span className="service-icon">🫀</span>
            <h3>Complex Heart Surgery</h3>
            <p>Specialized procedures including bypass surgery and valve replacement with precision care.</p>
          </div>
          <div className="service-card">
            <span className="service-icon">🔬</span>
            <h3>Diagnostic Cardiology</h3>
            <p>State-of-the-art heart screening and diagnostic testing to detect issues early.</p>
          </div>
          <div className="service-card">
            <span className="service-icon">🚑</span>
            <h3>Emergency Cardiac Care</h3>
            <p>24/7 dedicated support for critical cardiac conditions and urgent interventions.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="hero-image-container about-image">
          <img src={doctorAbout} alt="Dr. Ashutosh in Clinic" className="hero-image" />
        </div>
        <div className="about-content">
          <span className="section-tag">About the Doctor</span>
          <h2 className="about-title">Meet Dr. Ashutosh</h2>
          <p className="about-text">
            Dr. Ashutosh is a triple board-certified Cardiovascular Surgeon with over 15 years of experience
            in treating complex heart conditions. Having performed over 5,000 successful surgeries,
            he combines technical excellence with a personalized approach to ensure the best possible
            outcomes for every patient.
          </p>
          <p className="about-text">
            His clinic is equipped with the latest medical technology, providing a safe and comfortable
            environment for diagnosis, treatment, and recovery.
          </p>
          <Link to="/register" className="btn-cta" style={{ background: '#0f172a' }}>Learn More About Care</Link>
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="services-section" style={{ background: '#3b82f6', color: 'white' }}>
        <h2 className="section-title" style={{ color: 'white', marginBottom: '2rem' }}>Ready to Prioritize Your Heart Health?</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9 }}>Join thousands of patients who trust Dr. Ashutosh for their cardiac well-being.</p>
        <Link to="/register" className="btn-cta" style={{ background: 'white', color: '#3b82f6' }}>Create Your Patient Profile</Link>
      </section>
    </div>
  );
};

export default Home;
