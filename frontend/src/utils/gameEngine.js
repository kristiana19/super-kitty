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

  generatePlatforms() {
    return [
      // Ground platforms
      { x: 0, y: 550, width: 200, height: 50, type: 'ground' },
      { x: 300, y: 550, width: 200, height: 50, type: 'ground' },
      { x: 600, y: 550, width: 200, height: 50, type: 'ground' },
      
      // Floating platforms
      { x: 150, y: 450, width: 100, height: 20, type: 'platform' },
      { x: 400, y: 400, width: 120, height: 20, type: 'platform' },
      { x: 650, y: 350, width: 100, height: 20, type: 'platform' },
      { x: 200, y: 300, width: 150, height: 20, type: 'platform' },
      { x: 500, y: 250, width: 100, height: 20, type: 'platform' }
    ];
  }

  generateEnemies() {
    return [
      { x: 350, y: 510, width: 30, height: 30, velocityX: -1, type: 'badtz', alive: true },
      { x: 650, y: 510, width: 25, height: 25, velocityX: 1.5, type: 'melody', alive: true },
      { x: 450, y: 360, width: 35, height: 35, velocityX: -0.8, type: 'pompom', alive: true },
      { x: 250, y: 260, width: 28, height: 28, velocityX: 1.2, type: 'cinna', alive: true }
    ];
  }

  generateCollectibles() {
    return [
      { x: 180, y: 420, width: 20, height: 20, type: 'heart', collected: false },
      { x: 430, y: 370, width: 20, height: 20, type: 'heart', collected: false },
      { x: 680, y: 320, width: 20, height: 20, type: 'heart', collected: false },
      { x: 230, y: 270, width: 20, height: 20, type: 'heart', collected: false },
      { x: 530, y: 220, width: 20, height: 20, type: 'heart', collected: false },
      { x: 120, y: 520, width: 15, height: 15, type: 'bow', collected: false },
      { x: 720, y: 520, width: 15, height: 15, type: 'bow', collected: false }
    ];
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
    
    // Update camera (simple following)
    this.updateCamera();
    
    // Return game state changes
    const result = {
      scoreChanged: this.score !== this.lastScoreChange,
      score: this.score,
      lifeLost: this.lastLifeLoss
    };
    
    this.lastScoreChange = this.score;
    this.lastLifeLoss = false;
    
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