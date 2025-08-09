import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedDoodle from '../components/AnimatedDoodle';

const landingPageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  backgroundColor: '#f0f0f0',
  fontFamily: 'Arial, sans-serif',
};

const titleStyle = {
  fontSize: '3rem',
  color: '#333',
  marginBottom: '1rem',
};

const descriptionStyle = {
  fontSize: '1.2rem',
  color: '#666',
  maxWidth: '600px',
  marginBottom: '2rem',
};

const buttonStyle = {
  padding: '1rem 2rem',
  fontSize: '1.2rem',
  color: '#fff',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  textDecoration: 'none',
  cursor: 'pointer',
};

function Landing() {
  return (
    <div style={landingPageStyle}>
      <AnimatedDoodle />
      <h1 style={titleStyle}>Bring Your Doodles to Life</h1>
      <p style={descriptionStyle}>
        Unleash your creativity with our simple yet powerful doodle animator.
        Draw frame-by-frame, and watch your creations turn into fun animations.
        It's never been easier to make your ideas move.
      </p>
      <Link to="/editor" style={buttonStyle}>
        Start Animating
      </Link>
    </div>
  );
}

export default Landing;
