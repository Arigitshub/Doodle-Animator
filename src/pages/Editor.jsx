import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from '../Canvas';
import '../index.css'; // Ensure styles are imported

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;
const FRAME_RATE = 5; // Frames per second for playback

function Editor() {
  // State for all frames. Each frame is an array of strokes.
  // A stroke is an array of points {x, y}.
  const [frames, setFrames] = useState([[]]); // Start with one empty frame
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const playbackFrameIndexRef = useRef(0);

  // Handler for when a stroke is completed on the canvas
  const handleDraw = (newStroke) => {
    if (isPlaying) return; // Don't allow drawing while playing

    const updatedFrames = frames.map((frame, index) => {
      if (index === currentFrameIndex) {
        // Add the new stroke to the current frame's data
        return [...frame, newStroke];
      }
      return frame;
    });
    setFrames(updatedFrames);
  };

  const addFrame = () => {
    if (isPlaying) return;
    // Insert a new empty frame after the current one
    const newFrames = [
      ...frames.slice(0, currentFrameIndex + 1),
      [], // New empty frame
      ...frames.slice(currentFrameIndex + 1),
    ];
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex + 1); // Switch to the new frame
  };

  const goToFrame = (index) => {
    if (isPlaying || index < 0 || index >= frames.length) return;
    setCurrentFrameIndex(index);
  };

  const deleteFrame = () => {
    if (isPlaying || frames.length <= 1) return; // Can't delete the last frame

    const confirmDelete = window.confirm(`Are you sure you want to delete frame ${currentFrameIndex + 1}?`);
    if (!confirmDelete) return;

    const newFrames = frames.filter((_, index) => index !== currentFrameIndex);
    setFrames(newFrames);
    // Adjust current frame index if necessary
    setCurrentFrameIndex(prevIndex => Math.max(0, Math.min(prevIndex, newFrames.length - 1)));
  };


  // --- Animation Playback Logic ---
  const animate = useCallback((timestamp) => {
    if (!isPlaying) return; // Stop if isPlaying turned false

    const elapsed = timestamp - lastFrameTimeRef.current;
    const frameInterval = 1000 / FRAME_RATE;

    if (elapsed >= frameInterval) {
      lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);

      // Move to the next frame for playback
      playbackFrameIndexRef.current = (playbackFrameIndexRef.current + 1) % frames.length;
      // Update the displayed frame (this triggers canvas redraw via useEffect in Canvas)
      // We directly set the currentFrameIndex for display during playback
      setCurrentFrameIndex(playbackFrameIndexRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isPlaying, frames.length]); // Dependencies for useCallback

  const startPlayback = () => {
    if (frames.length <= 1) return; // Need more than one frame to play
    setIsPlaying(true);
    playbackFrameIndexRef.current = currentFrameIndex; // Start from current frame
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    // Optionally reset to the frame where playback started or frame 0
    // setCurrentFrameIndex(playbackFrameIndexRef.current); // Stay on last shown frame
  };

  // Cleanup animation frame on unmount or when isPlaying becomes false
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Toggle Play/Stop
  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  return (
    <div>
      <h1>🖌️ Doodle Animator</h1>
      <div className="controls">
        <button onClick={addFrame} disabled={isPlaying}>Add Frame</button>
        <button onClick={togglePlayback} disabled={frames.length <= 1}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
         <button
          onClick={() => goToFrame(currentFrameIndex - 1)}
          disabled={isPlaying || currentFrameIndex === 0}
        >
          Prev Frame
        </button>
        <button
          onClick={() => goToFrame(currentFrameIndex + 1)}
          disabled={isPlaying || currentFrameIndex === frames.length - 1}
        >
          Next Frame
        </button>
         <button
          onClick={deleteFrame}
          disabled={isPlaying || frames.length <= 1}
          style={{ backgroundColor: '#dc3545' }} // Red color for delete
        >
          Delete Frame
        </button>
      </div>
      <Canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        frameData={frames[currentFrameIndex] || []} // Pass current frame's drawing data
        onDraw={handleDraw}
      />
      <div className="frame-info">
        Frame: {currentFrameIndex + 1} / {frames.length}
      </div>
    </div>
  );
}

export default Editor;
