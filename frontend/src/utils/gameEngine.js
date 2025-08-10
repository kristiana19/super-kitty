// Game Engine for Hello Kitty Retro Platformer
class GameEngine {
  constructor() {
    this.reset();
    this.setupControls();
  }

  init(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    return this;
  }

  reset() {
    // Game state
    this.score = 0;
    this.gameTime = 0;
    this.lastScoreUpdate = 0;
    this.currentLevel = 1;
    this.levelComplete = false;
    this.gameWon = false;
    
    // Hello Kitty player
    this.player = {
      x: 100,
      y: 400,
      width: 40,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      speed: 5,
      jumpPower: 15,
      onGround: false,
      facingRight: true,
      animationFrame: 0,
      animationTimer: 0
    };

    // Physics
    this.gravity = 0.8;
    this.friction = 0.8;

    // Controls
    this.keys = {
      left: false,
      right: false,
      up: false,
      space: false,
      p: false
    };

    // Game objects
    this.platforms = this.generatePlatforms(this.currentLevel);
    this.enemies = this.generateEnemies(this.currentLevel);
    this.collectibles = this.generateCollectibles(this.currentLevel);
    this.particles = [];

    // Add finish line/goal
    this.goal = this.generateGoal();

    // Game state tracking
    this.lastLifeLoss = false;
    this.lastScoreChange = 0;
    this.levelWon = false;
  }

  setupControls() {
    // Remove existing listeners to avoid duplicates
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    
    this.handleKeyDown = (e) => {
      switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.keys.left = true;
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = true;
          e.preventDefault();
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          this.keys.space = true;
          e.preventDefault();
          break;
        case 'KeyP':
          this.keys.p = true;
          e.preventDefault();
          break;
      }
    };

    this.handleKeyUp = (e) => {
      switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.keys.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          this.keys.space = false;
          break;
        case 'KeyP':
          this.keys.p = false;
          break;
      }
    };

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  generatePlatforms(level = 1) {
    const basePlatforms = [
      // Ground platforms
      { x: 0, y: 550, width: 200, height: 50, type: 'ground' },
      { x: 300, y: 550, width: 200, height: 50, type: 'ground' },
      { x: 600, y: 550, width: 200, height: 50, type: 'ground' },
    ];

    if (level === 1) {
      return [
        ...basePlatforms,
        // Level 1 platforms
        { x: 150, y: 450, width: 100, height: 20, type: 'platform' },
        { x: 400, y: 400, width: 120, height: 20, type: 'platform' },
        { x: 650, y: 350, width: 100, height: 20, type: 'platform' },
        { x: 200, y: 300, width: 150, height: 20, type: 'platform' },
        { x: 500, y: 250, width: 100, height: 20, type: 'platform' }
      ];
    } else if (level === 2) {
      return [
        ...basePlatforms,
        // Level 2 - more challenging
        { x: 120, y: 480, width: 80, height: 20, type: 'platform' },
        { x: 280, y: 420, width: 60, height: 20, type: 'platform' },
        { x: 450, y: 380, width: 80, height: 20, type: 'platform' },
        { x: 320, y: 320, width: 100, height: 20, type: 'platform' },
        { x: 550, y: 280, width: 120, height: 20, type: 'platform' },
        { x: 100, y: 200, width: 150, height: 20, type: 'platform' },
        { x: 400, y: 150, width: 200, height: 20, type: 'platform' }
      ];
    } else if (level === 3) {
      return [
        ...basePlatforms,
        // Level 3 - expert level
        { x: 50, y: 500, width: 60, height: 20, type: 'platform' },
        { x: 180, y: 450, width: 50, height: 20, type: 'platform' },
        { x: 300, y: 400, width: 80, height: 20, type: 'platform' },
        { x: 480, y: 360, width: 60, height: 20, type: 'platform' },
        { x: 620, y: 320, width: 70, height: 20, type: 'platform' },
        { x: 200, y: 280, width: 100, height: 20, type: 'platform' },
        { x: 450, y: 240, width: 80, height: 20, type: 'platform' },
        { x: 150, y: 180, width: 120, height: 20, type: 'platform' },
        { x: 500, y: 120, width: 150, height: 20, type: 'platform' }
      ];
    }
    
    return basePlatforms;
  }

  generateEnemies(level = 1) {
    if (level === 1) {
      return [
        { x: 350, y: 510, width: 30, height: 30, velocityX: -1, type: 'badtz', alive: true },
        { x: 650, y: 510, width: 25, height: 25, velocityX: 1.5, type: 'melody', alive: true },
        { x: 450, y: 360, width: 35, height: 35, velocityX: -0.8, type: 'pompom', alive: true }
      ];
    } else if (level === 2) {
      return [
        { x: 320, y: 510, width: 30, height: 30, velocityX: -1.2, type: 'badtz', alive: true },
        { x: 680, y: 510, width: 25, height: 25, velocityX: 1.8, type: 'melody', alive: true },
        { x: 320, y: 280, width: 35, height: 35, velocityX: -1, type: 'pompom', alive: true },
        { x: 550, y: 240, width: 28, height: 28, velocityX: 1.5, type: 'cinna', alive: true },
        { x: 150, y: 160, width: 32, height: 32, velocityX: -0.7, type: 'badtz', alive: true }
      ];
    } else if (level === 3) {
      return [
        { x: 300, y: 510, width: 30, height: 30, velocityX: -1.5, type: 'badtz', alive: true },
        { x: 700, y: 510, width: 25, height: 25, velocityX: 2, type: 'melody', alive: true },
        { x: 200, y: 240, width: 35, height: 35, velocityX: -1.2, type: 'pompom', alive: true },
        { x: 450, y: 200, width: 28, height: 28, velocityX: 1.8, type: 'cinna', alive: true },
        { x: 150, y: 140, width: 32, height: 32, velocityX: -1, type: 'badtz', alive: true },
        { x: 500, y: 80, width: 30, height: 30, velocityX: 1.3, type: 'melody', alive: true }
      ];
    }
    
    return [];
  }

  generateCollectibles(level = 1) {
    if (level === 1) {
      return [
        { x: 180, y: 420, width: 20, height: 20, type: 'heart', collected: false },
        { x: 430, y: 370, width: 20, height: 20, type: 'heart', collected: false },
        { x: 680, y: 320, width: 20, height: 20, type: 'heart', collected: false },
        { x: 230, y: 270, width: 20, height: 20, type: 'heart', collected: false },
        { x: 530, y: 220, width: 20, height: 20, type: 'heart', collected: false },
        { x: 120, y: 520, width: 15, height: 15, type: 'bow', collected: false },
        { x: 720, y: 520, width: 15, height: 15, type: 'bow', collected: false }
      ];
    } else if (level === 2) {
      return [
        { x: 150, y: 450, width: 20, height: 20, type: 'heart', collected: false },
        { x: 310, y: 390, width: 20, height: 20, type: 'heart', collected: false },
        { x: 480, y: 350, width: 20, height: 20, type: 'heart', collected: false },
        { x: 350, y: 290, width: 20, height: 20, type: 'heart', collected: false },
        { x: 580, y: 250, width: 20, height: 20, type: 'heart', collected: false },
        { x: 130, y: 170, width: 20, height: 20, type: 'heart', collected: false },
        { x: 430, y: 120, width: 20, height: 20, type: 'heart', collected: false },
        { x: 50, y: 520, width: 15, height: 15, type: 'bow', collected: false },
        { x: 750, y: 520, width: 15, height: 15, type: 'bow', collected: false }
      ];
    } else if (level === 3) {
      return [
        { x: 80, y: 470, width: 20, height: 20, type: 'heart', collected: false },
        { x: 210, y: 420, width: 20, height: 20, type: 'heart', collected: false },
        { x: 330, y: 370, width: 20, height: 20, type: 'heart', collected: false },
        { x: 510, y: 330, width: 20, height: 20, type: 'heart', collected: false },
        { x: 650, y: 290, width: 20, height: 20, type: 'heart', collected: false },
        { x: 230, y: 250, width: 20, height: 20, type: 'heart', collected: false },
        { x: 480, y: 210, width: 20, height: 20, type: 'heart', collected: false },
        { x: 180, y: 150, width: 20, height: 20, type: 'heart', collected: false },
        { x: 530, y: 90, width: 20, height: 20, type: 'heart', collected: false },
        { x: 30, y: 520, width: 15, height: 15, type: 'bow', collected: false },
        { x: 770, y: 520, width: 15, height: 15, type: 'bow', collected: false }
      ];
    }
    
    return [];
  }

  update() {
    this.gameTime++;
    
    // Update player
    this.updatePlayer();
    
    // Update enemies
    this.updateEnemies();
    
    // Update particles
    this.updateParticles();
    
    // Check collisions
    this.checkCollisions();
    
    // Check win condition
    this.checkWinCondition();
    
    // Update camera (simple following)
    this.updateCamera();
    
    // Return game state changes
    const result = {
      scoreChanged: this.score !== this.lastScoreChange,
      score: this.score,
      lifeLost: this.lastLifeLoss,
      levelWon: this.levelWon,
      gameWon: this.gameWon,
      currentLevel: this.currentLevel
    };
    
    this.lastScoreChange = this.score;
    this.lastLifeLoss = false;
    this.levelWon = false;
    
    return result;
  }

  updatePlayer() {
    // Horizontal movement
    if (this.keys.left) {
      this.player.velocityX = -this.player.speed;
      this.player.facingRight = false;
    } else if (this.keys.right) {
      this.player.velocityX = this.player.speed;
      this.player.facingRight = true;
    } else {
      this.player.velocityX *= this.friction;
    }

    // Jumping
    if (this.keys.space && this.player.onGround) {
      this.player.velocityY = -this.player.jumpPower;
      this.player.onGround = false;
    }

    // Apply gravity
    this.player.velocityY += this.gravity;

    // Update position
    this.player.x += this.player.velocityX;
    this.player.y += this.player.velocityY;

    // Keep player in bounds
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > this.canvasWidth - this.player.width) {
      this.player.x = this.canvasWidth - this.player.width;
    }

    // Update animation
    this.player.animationTimer++;
    if (this.player.animationTimer > 10) {
      this.player.animationFrame = (this.player.animationFrame + 1) % 4;
      this.player.animationTimer = 0;
    }

    // Check if fallen off screen
    if (this.player.y > this.canvasHeight) {
      this.respawnPlayer();
    }
  }

  updateEnemies() {
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;

      // Move enemy
      enemy.x += enemy.velocityX;

      // Simple AI - turn around at platform edges
      const onPlatform = this.platforms.some(platform => 
        enemy.x + enemy.width > platform.x &&
        enemy.x < platform.x + platform.width &&
        Math.abs(enemy.y + enemy.height - platform.y) < 5
      );

      if (!onPlatform || enemy.x <= 0 || enemy.x >= this.canvasWidth - enemy.width) {
        enemy.velocityX *= -1;
      }

      // Keep enemies in bounds
      if (enemy.x < 0) enemy.x = 0;
      if (enemy.x > this.canvasWidth - enemy.width) {
        enemy.x = this.canvasWidth - enemy.width;
      }
    });
  }

  updateParticles() {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.3; // Gravity for particles
      particle.life--;
      return particle.life > 0;
    });
  }

  checkWinCondition() {
    // Check if player reached the goal
    if (this.isColliding(this.player, this.goal)) {
      // Check if all hearts are collected
      const allHeartsCollected = this.collectibles
        .filter(item => item.type === 'heart')
        .every(heart => heart.collected);
      
      if (allHeartsCollected) {
        this.levelWon = true;
        this.levelComplete = true;
        this.createParticles(this.goal.x, this.goal.y, '#FFD700', 15);
      }
    }
  }

  checkCollisions() {
    // Platform collisions
    this.player.onGround = false;
    
    this.platforms.forEach(platform => {
      if (this.isColliding(this.player, platform)) {
        // Landing on top
        if (this.player.velocityY > 0 && this.player.y < platform.y) {
          this.player.y = platform.y - this.player.height;
          this.player.velocityY = 0;
          this.player.onGround = true;
        }
      }
    });

    // Enemy collisions
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      
      if (this.isColliding(this.player, enemy)) {
        // Player loses life and respawns
        this.lastLifeLoss = true;
        this.respawnPlayer();
        this.createParticles(this.player.x, this.player.y, '#FF1493', 8);
      }
    });

    // Collectible collisions
    this.collectibles.forEach(collectible => {
      if (!collectible.collected && this.isColliding(this.player, collectible)) {
        collectible.collected = true;
        
        if (collectible.type === 'heart') {
          this.score += 100;
          this.createParticles(collectible.x, collectible.y, '#FF69B4', 5);
        } else if (collectible.type === 'bow') {
          this.score += 50;
          this.createParticles(collectible.x, collectible.y, '#FFD700', 3);
        }
      }
    });
  }

  isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + Math.random() * 20,
        y: y + Math.random() * 20,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: (Math.random() - 0.5) * 4 - 2,
        color: color,
        life: 30 + Math.random() * 20
      });
    }
  }

  respawnPlayer() {
    this.player.x = 100;
    this.player.y = 400;
    this.player.velocityX = 0;
    this.player.velocityY = 0;
  }

  generateGoal() {
    // Goal area - reach this to complete the level
    return {
      x: 700, 
      y: 200, 
      width: 60, 
      height: 80, 
      type: 'goal'
    };
  }

  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel > 3) {
      this.gameWon = true;
      return;
    }
    
    // Reset player position
    this.player.x = 100;
    this.player.y = 400;
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    
    // Generate new level content
    this.platforms = this.generatePlatforms(this.currentLevel);
    this.enemies = this.generateEnemies(this.currentLevel);
    this.collectibles = this.generateCollectibles(this.currentLevel);
    this.goal = this.generateGoal();
    this.particles = [];
    
    // Reset level states
    this.levelComplete = false;
    this.levelWon = false;
  }

  updateCamera() {
    // Simple camera that could follow the player
    // For now, we'll keep it static but this is where camera logic would go
  }

  render(ctx) {
    // Render platforms
    this.platforms.forEach(platform => {
      if (platform.type === 'ground') {
        ctx.fillStyle = '#8B4513';
      } else {
        ctx.fillStyle = '#DDA0DD';
      }
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Platform border
      ctx.strokeStyle = '#FF1493';
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Render goal area
    this.drawGoal(ctx);

    // Render collectibles
    this.collectibles.forEach(collectible => {
      if (collectible.collected) return;
      
      if (collectible.type === 'heart') {
        this.drawHeart(ctx, collectible.x, collectible.y, collectible.width);
      } else if (collectible.type === 'bow') {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
      }
    });

    // Render enemies
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      
      this.drawEnemy(ctx, enemy);
    });

    // Render player (Hello Kitty)
    this.drawPlayer(ctx);

    // Render particles
    this.particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life / 50;
      ctx.fillRect(particle.x, particle.y, 4, 4);
      ctx.globalAlpha = 1;
    });

    // Render level completion message
    if (this.levelComplete && !this.gameWon) {
      this.drawLevelCompleteMessage(ctx);
    }
  }

  drawGoal(ctx) {
    // Draw the goal area - a magical pink portal
    const x = this.goal.x;
    const y = this.goal.y;
    const w = this.goal.width;
    const h = this.goal.height;
    
    // Goal background with sparkle effect
    const gradient = ctx.createLinearGradient(x, y, x, y + h);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FF69B4');
    gradient.addColorStop(1, '#FF1493');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);
    
    // Border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    
    // Goal text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GOAL!', x + w/2, y + h/2 - 10);
    ctx.fillText('Collect', x + w/2, y + h/2 + 5);
    ctx.fillText('All ♥!', x + w/2, y + h/2 + 20);
    
    // Reset text align
    ctx.textAlign = 'left';
  }

  drawLevelCompleteMessage(ctx) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Level complete message
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', this.canvasWidth/2, this.canvasHeight/2 - 50);
    
    if (this.currentLevel < 3) {
      ctx.fillStyle = '#FF69B4';
      ctx.font = 'bold 24px Courier New';
      ctx.fillText('Press SPACE for Next Level!', this.canvasWidth/2, this.canvasHeight/2 + 20);
    } else {
      ctx.fillStyle = '#FF69B4';
      ctx.font = 'bold 24px Courier New';
      ctx.fillText('You Won All Levels!', this.canvasWidth/2, this.canvasHeight/2 + 20);
    }
    
    ctx.textAlign = 'left';
  }

  drawPlayer(ctx) {
    // Hello Kitty body
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Border
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Face features
    const centerX = this.player.x + this.player.width / 2;
    const centerY = this.player.y + this.player.height / 2;
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(centerX - 8, centerY - 5, 3, 3);
    ctx.fillRect(centerX + 5, centerY - 5, 3, 3);
    
    // Nose
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(centerX - 1, centerY, 2, 2);
    
    // Bow
    ctx.fillStyle = '#FF1493';
    if (this.player.facingRight) {
      ctx.fillRect(this.player.x + this.player.width - 10, this.player.y + 5, 8, 6);
    } else {
      ctx.fillRect(this.player.x + 2, this.player.y + 5, 8, 6);
    }
  }

  drawEnemy(ctx, enemy) {
    let color = '#DDA0DD'; // Default purple
    
    switch(enemy.type) {
      case 'badtz':
        color = '#333333';
        break;
      case 'melody':
        color = '#FFB6C1';
        break;
      case 'pompom':
        color = '#FFFFE0';
        break;
      case 'cinna':
        color = '#FFFFFF';
        break;
    }
    
    ctx.fillStyle = color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Border
    ctx.strokeStyle = '#8B008B';
    ctx.lineWidth = 1;
    ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Simple face
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 5, enemy.y + 8, 2, 2);
    ctx.fillRect(enemy.x + enemy.width - 7, enemy.y + 8, 2, 2);
  }

  drawHeart(ctx, x, y, size) {
    ctx.fillStyle = '#FF69B4';
    
    // Simple heart shape using rectangles (pixel art style)
    ctx.fillRect(x + 2, y, size - 8, size / 2);
    ctx.fillRect(x, y + 2, size / 2, size - 8);
    ctx.fillRect(x + size / 2, y + 2, size / 2, size - 8);
    ctx.fillRect(x + 4, y + size - 6, size - 8, 4);
    
    // Heart shine
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(x + 2, y + 2, 2, 2);
  }
}

export const gameEngine = new GameEngine();