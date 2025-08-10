import React, { useRef, useEffect, useCallback } from 'react';
import { gameEngine } from '../utils/gameEngine';

const GameCanvas = ({ gameState, onScoreUpdate, onLifeLoss, onLevelComplete, onGameWon }) => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const animationFrameRef = useRef(null);

  const gameLoop = useCallback(() => {
    if (gameEngineRef.current && gameState.gameStatus === 'playing') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas with retro pink gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#FFE4E1'); // Misty Rose
      gradient.addColorStop(0.5, '#FFC0CB'); // Pink
      gradient.addColorStop(1, '#FF69B4'); // Hot Pink
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and render game
      const result = gameEngineRef.current.update();
      gameEngineRef.current.render(ctx);

      // Handle game events
      if (result.scoreChanged) {
        onScoreUpdate(result.score);
      }
      if (result.lifeLost) {
        onLifeLoss();
      }
      if (result.levelWon) {
        onLevelComplete(result.currentLevel);
        // Trigger next level in game engine after a delay
        setTimeout(() => {
          gameEngineRef.current.nextLevel();
        }, 100);
      }
      if (result.gameWon) {
        onGameWon();
      }
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameStatus, onScoreUpdate, onLifeLoss, onLevelComplete, onGameWon]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize game engine
    gameEngineRef.current = gameEngine.init(canvas.width, canvas.height);

    // Start game loop
    gameLoop();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    // Reset game when gameState changes
    if (gameEngineRef.current && gameState.gameStatus === 'playing' && gameState.score === 0 && gameState.lives === 3) {
      gameEngineRef.current.reset();
    }
  }, [gameState]);

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        tabIndex={0}
      />
    </div>
  );
};

export default GameCanvas;