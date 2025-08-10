import React, { useRef, useEffect, useState } from 'react';
import GameCanvas from './GameCanvas';
import './Game.css';

const Game = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    level: 1,
    gameStatus: 'playing' // playing, paused, gameOver
  });

  const [showInstructions, setShowInstructions] = useState(true);

  const handleScoreUpdate = (newScore) => {
    setGameState(prev => ({ ...prev, score: newScore }));
  };

  const handleLifeLoss = () => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      return {
        ...prev,
        lives: newLives,
        gameStatus: newLives <= 0 ? 'gameOver' : 'playing'
      };
    });
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameStatus: 'playing'
    });
  };

  const startGame = () => {
    setShowInstructions(false);
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  };

  if (showInstructions) {
    return (
      <div className="game-container">
        <div className="instruction-screen">
          <div className="instruction-card">
            <h1 className="game-title">🎀 Hello Kitty Adventure 🎀</h1>
            <div className="kitty-pixel">
              <div className="kitty-face">
                <div className="kitty-ear kitty-ear-left"></div>
                <div className="kitty-ear kitty-ear-right"></div>
                <div className="kitty-head">
                  <div className="kitty-eye kitty-eye-left"></div>
                  <div className="kitty-eye kitty-eye-right"></div>
                  <div className="kitty-nose"></div>
                  <div className="kitty-bow"></div>
                </div>
              </div>
            </div>
            <div className="instructions">
              <h2>How to Play:</h2>
              <div className="controls">
                <div className="control-item">
                  <span className="key">← →</span> Move Left/Right
                </div>
                <div className="control-item">
                  <span className="key">SPACE</span> Jump
                </div>
                <div className="control-item">
                  <span className="key">P</span> Pause
                </div>
              </div>
              <div className="game-info">
                <p>🎯 Collect pink hearts to score points!</p>
                <p>⚠️ Avoid the Sanrio enemies!</p>
                <p>💝 You have 3 lives - make them count!</p>
              </div>
            </div>
            <button className="start-button" onClick={startGame}>
              Start Adventure! 💖
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-hud">
        <div className="hud-item">
          <span className="hud-label">Score:</span>
          <span className="hud-value">{gameState.score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Lives:</span>
          <span className="hud-value">
            {'💖'.repeat(gameState.lives)}
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Level:</span>
          <span className="hud-value">{gameState.level}</span>
        </div>
      </div>

      {gameState.gameStatus === 'gameOver' && (
        <div className="game-over-screen">
          <div className="game-over-card">
            <h2>Game Over! 💔</h2>
            <p>Final Score: {gameState.score}</p>
            <div className="game-over-buttons">
              <button className="retry-button" onClick={resetGame}>
                Try Again 💖
              </button>
              <button className="menu-button" onClick={() => setShowInstructions(true)}>
                Main Menu 🏠
              </button>
            </div>
          </div>
        </div>
      )}

      <GameCanvas
        gameState={gameState}
        onScoreUpdate={handleScoreUpdate}
        onLifeLoss={handleLifeLoss}
      />

      {gameState.gameStatus === 'paused' && (
        <div className="pause-screen">
          <div className="pause-card">
            <h2>Paused ⏸️</h2>
            <p>Press P to continue</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;