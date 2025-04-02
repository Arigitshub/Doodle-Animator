import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ width, height, frameData, onDraw }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);

  const getCoords = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (event.touches) { // Touch event
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else { // Mouse event
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    return { x, y };
  };

  const startDrawing = (event) => {
    event.preventDefault(); // Prevent default touch behavior (like scrolling)
    const { x, y } = getCoords(event);
    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    event.preventDefault();
    const { x, y } = getCoords(event);
    const newStroke = [...currentStroke, { x, y }];
    setCurrentStroke(newStroke);

    // Draw the current segment being drawn
    const context = canvasRef.current.getContext('2d');
    if (currentStroke.length > 1) {
      const prevPoint = currentStroke[currentStroke.length - 1];
      context.beginPath();
      context.moveTo(prevPoint.x, prevPoint.y);
      context.lineTo(x, y);
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 1) { // Only save if it's more than a dot
      onDraw(currentStroke); // Pass the completed stroke up
    }
    setCurrentStroke([]); // Reset for the next stroke
  };

  // Redraw canvas when frameData changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height); // Clear canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Draw all strokes for the current frame
    frameData.forEach(stroke => {
      if (stroke.length < 2) return; // Need at least two points to draw a line
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      stroke.forEach((point, index) => {
        if (index > 0) {
          context.lineTo(point.x, point.y);
        }
      });
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    });

  }, [frameData, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing} // Stop drawing if mouse leaves canvas
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      onTouchCancel={stopDrawing} // Handle touch cancellation
    />
  );
};

export default Canvas;
