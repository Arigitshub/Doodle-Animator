import React from 'react';

const svgStyle = {
  width: '150px',
  height: '150px',
  marginBottom: '2rem',
};

const pathStyle = {
  stroke: '#007bff',
  strokeWidth: 5,
  fill: 'none',
  strokeDasharray: 1000, // A large value, bigger than the path length
  strokeDashoffset: 1000, // Start with the path "hidden"
  animation: 'draw 3s ease-in-out forwards infinite',
};

// Keyframes for the drawing animation
const keyframes = `
@keyframes draw {
  to {
    stroke-dashoffset: 0; // "Draw" the path
  }
}
`;

function AnimatedDoodle() {
  return (
    <div>
      <style>{keyframes}</style>
      <svg style={svgStyle} viewBox="0 0 100 100">
        <path
          style={pathStyle}
          d="M10,90 C20,10 80,10 90,90" // A simple curve path
        />
      </svg>
    </div>
  );
}

export default AnimatedDoodle;
