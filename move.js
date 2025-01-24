const foregroundImages = {};

// Load all foreground images from overlay folder
for (let i = 1; i <= 15; i++) {
  const img = new Image();
  img.src = `overlay/fg${i}.png`;
  // Only store the image if it loads successfully
  img.onload = () => {
    foregroundImages[i] = img;
  };
}
const backgroundImages = {};

// Load all background images from bg folder
for (let i = 1; i <= 15; i++) {
  const img = new Image();
  img.src = `bg/bg${i}.png`;
  img.onload = () => {
    backgroundImages[i] = img;
  };
}

import { getLevelData } from "./levels.js";

const TARGET_WIDTH = 959;
const TARGET_HEIGHT = 716;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const container = canvas.parentElement;
  const containerAspect = container.clientWidth / container.clientHeight;
  const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;

  if (containerAspect > targetAspect) {
    canvas.height = container.clientHeight;
    canvas.width = container.clientHeight * targetAspect;
  } else {
    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth / targetAspect;
  }
}

resizeCanvas();

const GROUND_HEIGHT = 65;
const GROUND_COLOR = "#4a4a4a";

const levels = [
  getLevelData().level1,
  getLevelData().level2,
  getLevelData().level3,
  getLevelData().level4,
  getLevelData().level5,
  getLevelData().level6,
  getLevelData().level7,
  getLevelData().level8,
  getLevelData().level9,
  getLevelData().level10,
  getLevelData().level11,
  getLevelData().level12,
  getLevelData().level13,
  getLevelData().level14,
  getLevelData().level15,
];

const gameState = {
  currentScreen: 9,
  adminMode: false,
  startTime: null,
  elapsedTime: 0,
  showCrownSprite: false,
  hasCrown: false,
  lastTime: null,
  isPaused: true,
  hasWon: false,
  fadeAlpha: 0,
  isPlayingVictoryAnimation: false,
  showStats: false,
  screenTransition: {
    active: false,
    offset: 0,
    targetOffset: 0,
  },
};
const spriteSheet = {
  image: new Image(),
  frameWidth: 32,
  frameHeight: 32,
  facingRight: true,
  animations: {
    idle: {
      x: 230,
      y: 18,
      frames: 1,
    },
    charging: {
      x: 232,
      y: 66,
      frames: 1,
    },
    walking: {
      frames: [
        { x: 274, y: 18 }, // First walking frame
        { x: 323, y: 18 }, // Second walking frame
        { x: 370, y: 18 }, // Third walking frame
        { x: 323, y: 18 }, // Second walking frame
      ],

      frameDurations: [400, 200, 400, 200], // Duration for each frame in ms
      currentFrame: 0,
      frameTimer: 0,
      reverse: false,
    },
    dancing: {
      frames: [
        { x: 274, y: 115 },
        { x: 323, y: 115 },
        { x: 370, y: 115 },
        { x: 323, y: 115 },
      ],
      frameDurations: [600, 600, 600, 600],
      currentFrame: 0,
      frameTimer: 0,
      reverse: false,
    },
    jumpUp: {
      x: 278,
      y: 58,
      frames: 1,
    },
    jumpDown: {
      x: 330,
      y: 58,
      frames: 1,
    },
    knocked: {
      x: 376,
      y: 66,
      frames: 1,
    },
    bump: {
      x: 232,
      y: 114,
      frames: 1,
    },
  },
  currentAnimation: "idle",
};
spriteSheet.image.src = "spritesheet.png";

const crownSprite = {
  image: new Image(),
  frameWidth: 32,
  frameHeight: 32,
  facingRight: true,
  animations: {
    idle: {
      x: 230,
      y: 18,
      frames: 1,
    },
    charging: {
      x: 232,
      y: 66,
      frames: 1,
    },
    walking: {
      frames: [
        { x: 274, y: 18 },
        { x: 323, y: 18 },
        { x: 370, y: 18 },
        { x: 323, y: 18 },
      ],
      frameDurations: [400, 200, 400, 200],
      currentFrame: 0,
      frameTimer: 0,
      reverse: false,
    },
    jumpUp: {
      x: 278,
      y: 58,
      frames: 1,
    },
    jumpDown: {
      x: 330,
      y: 58,
      frames: 1,
    },
    knocked: {
      x: 376,
      y: 66,
      frames: 1,
    },
    bump: {
      x: 232,
      y: 114,
      frames: 1,
    },
  },
  currentAnimation: "idle",
};

crownSprite.image.src = "./crown-spritesheet.png";

function drawCharacter() {
  const animation = spriteSheet.animations[spriteSheet.currentAnimation];

  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;

  const frameWidth = spriteSheet.currentAnimation === "walking" ? 40 : spriteSheet.frameWidth;
  const displayWidth = spriteSheet.currentAnimation === "walking" ? 75 : 60; // Add height adjustment for jumping animations

  const frameHeight =
    spriteSheet.currentAnimation === "jumpUp" || spriteSheet.currentAnimation === "jumpDown"
      ? 48
      : spriteSheet.frameHeight;
  const displayHeight =
    spriteSheet.currentAnimation === "jumpUp" || spriteSheet.currentAnimation === "jumpDown" ? 90 : 60;

  const xOffset = (blok.breedte - displayWidth) / 2;
  const yOffset = (blok.hoogte - displayHeight) / 2;

  ctx.save();
  if (!spriteSheet.facingRight) {
    ctx.scale(-1, 1);
    ctx.translate(-2 * (blok.x + xOffset) - displayWidth, 0);
  }

  let sourceX, sourceY;
  if (animation.frames && Array.isArray(animation.frames)) {
    sourceX = animation.frames[animation.currentFrame].x;
    sourceY = animation.frames[animation.currentFrame].y;
  } else {
    sourceX = animation.x;
    sourceY = animation.y;
  }

  ctx.drawImage(
    spriteSheet.image,
    sourceX,
    sourceY,
    frameWidth,
    frameHeight,
    blok.x + xOffset,
    blok.y + yOffset,
    displayWidth,
    displayHeight
  );

  // Draw crown spritesheet on top if enabled
  if (gameState.showCrownSprite) {
    ctx.drawImage(
      crownSprite.image,
      sourceX,
      sourceY,
      frameWidth,
      frameHeight,
      blok.x + xOffset,
      blok.y + yOffset,
      displayWidth,
      displayHeight
    );
  }
}

const blok = {
  x: TARGET_WIDTH / 2 - 25,
  y: TARGET_HEIGHT - GROUND_HEIGHT - 50,
  breedte: 40,
  hoogte: 50,
  kleur: "red",
  normalColor: "red",
  stunnedColor: "purple",
  fallDistance: 0,
  fallThreshold: 400,
  isStunned: false,
  stunTimer: 0,
  stunDuration: 800,
  snelheidX: 0,
  snelheidY: 0,
  zwaartekracht: 0.1, //zwaartekracht: -0.0001,
  springKracht: 0,
  minJumpForce: 0.7,
  maxJumpForce: 6.17,
  minHorizontalForce: 2.7,
  maxHorizontalForce: 3.0,
  jumpChargeTime: 0,
  maxChargeTime: 1500,
  isChargingJump: false,
  opGrond: true,
  jumpDirection: 0,
  bounceStrength: 0.47,
  walkSpeed: 1.2,
  isWalking: false,
  isOnRamp: false,
  lastTriangleSpeedX: null,
  lastTriangleSpeedY: null,
  hasCollided: false,
};
const audioManager = {
  // Background music tracks
  cricket: new Audio("sound/bg-music/cricket.wav"),
  riool: new Audio("sound/bg-music/riool.wav"),
  episch: new Audio("sound/bg-music/episch.mp3"),
  sunrise: new Audio("sound/bg-music/sunrise.mp3"),
  wind: new Audio("sound/bg-music/wind.wav"),
  currentTrack: null,
  isSoundEnabled: true,

  sfx: {
    splat: new Audio("sound/movement/king_splat.wav"),
    land: new Audio("sound/movement/king_land.wav"),
    jump: new Audio("sound/movement/king_jump.wav"),
    bump: new Audio("sound/movement/king_bump.wav"),
  },
  lastBumpTime: 0,
  bumpCooldown: 150,

  playSfx(soundName) {
    if (!this.isSoundEnabled) return;

    const sound = this.sfx[soundName];
    if (soundName === "bump") {
      const now = Date.now();
      if (now - this.lastBumpTime < this.bumpCooldown) {
        return;
      }
      this.lastBumpTime = now;
    }
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    clone.play();
  },

  toggleSound() {
    this.isSoundEnabled = !this.isSoundEnabled;

    if (this.isSoundEnabled) {
      this.playTrackForLevel(gameState.currentScreen + 1);
    } else {
      if (Array.isArray(this.currentTrack)) {
        this.currentTrack.forEach((track) => track.pause());
      } else if (this.currentTrack) {
        this.currentTrack.pause();
      }
      this.currentTrack = null;
    }
  },

  getTrackForLevel(levelNum) {
    if (levelNum <= 5) {
      this.cricket.volume = 1.0;
      return [this.cricket];
    } else if (levelNum === 6) {
      this.cricket.volume = 0.7;
      this.riool.volume = 0.3;
      return [this.cricket, this.riool];
    } else if (levelNum <= 10) {
      return this.riool;
    } else if (levelNum === 15) {
      return this.wind;
    } else {
      return this.episch;
    }
  },
  getTrackForLevel(levelNum) {
    if (levelNum <= 5) {
      this.cricket.volume = 1.0;
      return [this.cricket];
    } else if (levelNum === 6) {
      this.cricket.volume = 0.7;
      this.riool.volume = 0.3;
      return [this.cricket, this.riool];
    } else if (levelNum <= 10) {
      return this.riool;
    } else if (levelNum === 15) {
      return this.wind;
    } else {
      return this.episch;
    }
  },

  playTrackForLevel(levelNum) {
    if (!this.isSoundEnabled) return;

    const newTrack = this.getTrackForLevel(levelNum);

    // If current track is the same type as new track, don't restart it
    if (this.currentTrack === this.episch && newTrack === this.episch) {
      return;
    }

    // Stop current track(s)
    if (this.currentTrack) {
      if (Array.isArray(this.currentTrack)) {
        this.currentTrack.forEach((track) => {
          track.pause();
          track.currentTime = 0;
        });
      } else {
        this.currentTrack.pause();
        this.currentTrack.currentTime = 0;
      }
    }

    this.currentTrack = newTrack;
    if (Array.isArray(newTrack)) {
      newTrack.forEach((track) => {
        track.loop = true;
        track.play();
      });
    } else {
      newTrack.loop = true;
      newTrack.play();
    }
  },
}; // Close audioManager object

const keyboard = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
  ArrowUp: false,
  ArrowDown: false,
  KeyP: false,
  Escape: false,
};
function checkPlatformCollisions(nextX, nextY) {
  if (gameState.isPlayingVictoryAnimation) {
    return { x: nextX, y: nextY };
  }

  const currentLevel = levels[gameState.currentScreen]; // In checkPlatformCollisions function, update the triangle collision check:

  if (currentLevel.triangles) {
    for (const triangle of currentLevel.triangles) {
      const playerBottom = {
        x: nextX + blok.breedte / 2,
        y: nextY + blok.hoogte,
      };

      const edgeBuffer = 5;
      const inXBounds =
        triangle.direction === "right"
          ? nextX + blok.breedte >= triangle.x1 + edgeBuffer && nextX <= triangle.x2 - edgeBuffer
          : nextX + blok.breedte >= triangle.x2 + edgeBuffer && nextX <= triangle.x1 - edgeBuffer;

      if (!inXBounds) continue;

      const slope =
        triangle.direction === "right"
          ? (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1)
          : (triangle.y1 - triangle.y2) / (triangle.x1 - triangle.x2);

      const expectedY = triangle.y1 + slope * (playerBottom.x - triangle.x1); // Increase collision threshold based on vertical speed

      const speedBasedThreshold = Math.max(3, Math.abs(blok.snelheidY) * 1.5);

      if (Math.abs(playerBottom.y - expectedY) < speedBasedThreshold) {
        nextY = expectedY - blok.hoogte;
        const directionMultiplier = triangle.direction === "right" ? 1 : -1;
        blok.snelheidX += 0.1 * directionMultiplier;
        blok.snelheidX = Math.max(-3, Math.min(blok.snelheidX, 3));

        blok.snelheidY = 0; // Instead, just set vertical speed to 0
        blok.opGrond = true;
        return { x: nextX, y: nextY };
      }
    }
  }

  if (blok.lastTriangleSpeedX) {
    blok.snelheidX = blok.lastTriangleSpeedX;
    blok.snelheidY = blok.lastTriangleSpeedY;
    blok.lastTriangleSpeedX = null;
    blok.lastTriangleSpeedY = null;
  }

  for (const platform of currentLevel.platforms) {
    if (platform.decorative) continue;
    if (nextX + blok.breedte > platform.x && nextX < platform.x + platform.width) {
      if (blok.y + blok.hoogte <= platform.y && nextY + blok.hoogte > platform.y) {
        audioManager.playSfx("land");
        nextY = platform.y - blok.hoogte;
        blok.snelheidY = 0;
        blok.snelheidX = 0;
        blok.opGrond = true; // Add stun check here

        if (blok.fallDistance > blok.fallThreshold) {
          audioManager.playSfx("splat");
          blok.isStunned = true;
          blok.stunTimer = Date.now();
          spriteSheet.currentAnimation = "knocked";
        }
        blok.fallDistance = 0;

        return { x: nextX, y: nextY };
      }

      if (blok.y >= platform.y + platform.height && nextY < platform.y + platform.height) {
        nextY = platform.y + platform.height;
        blok.snelheidY = 0;
        blok.snelheidX *= 0.5;
        audioManager.playSfx("bump");
        blok.hasCollided = true;
        spriteSheet.currentAnimation = "bump";
        return { x: nextX, y: nextY };
      }
    }

    if (nextY + blok.hoogte > platform.y && nextY < platform.y + platform.height) {
      if (blok.x + blok.breedte <= platform.x + 2 && nextX + blok.breedte > platform.x) {
        nextX = platform.x - blok.breedte;
        handleWallCollision(true);
      }
      if (blok.x >= platform.x + platform.width - 2 && nextX < platform.x + platform.width) {
        nextX = platform.x + platform.width;
        handleWallCollision(false);
      }
      if (nextX < 0) {
        nextX = 0;
        handleWallCollision(true); // Left wall bounce
      }
      if (nextX + blok.breedte > TARGET_WIDTH) {
        nextX = TARGET_WIDTH - blok.breedte;
        handleWallCollision(false); // Right wall bounce
      }
    }
  }

  return { x: nextX, y: nextY };
}
function updateTimer() {
  if (!gameState.isPaused && gameState.startTime && !showingConfirmation) {
    const now = Date.now();
    if (gameState.lastTime) {
      gameState.elapsedTime += now - gameState.lastTime;
    }
    gameState.lastTime = now;
  }
}

function drawTimer() {
  const totalSeconds = Math.floor(gameState.elapsedTime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText(timeString, 10, 40);
  ctx.restore();
}

function updateJumpCharge() {
  if (blok.isChargingJump) {
    spriteSheet.currentAnimation = "charging";
    blok.jumpChargeTime += 16;
    let chargeProgress = Math.min(blok.jumpChargeTime / blok.maxChargeTime, 1);
    blok.springKracht = blok.minJumpForce + (blok.maxJumpForce - blok.minJumpForce) * chargeProgress;

    if (chargeProgress >= 1) {
      executeJump();
    }
  } else if (blok.opGrond && Math.abs(blok.snelheidX) < 0.1) {
    spriteSheet.currentAnimation = "idle";
  }
}

function executeJump() {
  if (blok.springKracht > 0) {
    audioManager.playSfx("jump");
    let jumpPower = blok.springKracht * 1.3;
    let chargeProgress = blok.jumpChargeTime / blok.maxChargeTime;

    blok.snelheidY = -jumpPower;

    let horizontalPower =
      blok.minHorizontalForce + (blok.maxHorizontalForce - blok.minHorizontalForce) * chargeProgress;

    if (keyboard.ArrowLeft) {
      spriteSheet.currentAnimation = "walking";
      spriteSheet.facingRight = false;
      blok.snelheidX = -horizontalPower;
    } else if (keyboard.ArrowRight) {
      spriteSheet.currentAnimation = "walking";
      spriteSheet.facingRight = true;
      blok.snelheidX = horizontalPower;
    } else if (blok.opGrond && !blok.isChargingJump) {
      spriteSheet.currentAnimation = "idle";
    }

    blok.isChargingJump = false;
    blok.opGrond = false;
    blok.isWalking = false;
  }
}

window.addEventListener("blur", () => {
  keyboard.ArrowLeft = false;
  keyboard.ArrowRight = false;
  keyboard.Space = false;
});

function handleWallCollision(isLeftWall) {
  if (!blok.opGrond) {
    audioManager.playSfx("bump");
    blok.snelheidX *= -blok.bounceStrength;
    blok.springKracht *= blok.bounceStrength;
    blok.snelheidY *= 0.98;
    blok.hasCollided = true;
    spriteSheet.currentAnimation = "bump";
  } else {
    blok.snelheidX = 0;
  }
}

function updateAnimation() {
  const animation = spriteSheet.animations[spriteSheet.currentAnimation];
  if (animation.frames && Array.isArray(animation.frames)) {
    animation.frameTimer += 16;
    if (animation.frameTimer >= animation.frameDurations[animation.currentFrame]) {
      animation.frameTimer = 0;
      animation.currentFrame = (animation.currentFrame + 1) % animation.frames.length;
    }
  }
}

// Add event listener for when tab/window closes
window.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    gameState.isPaused = true;
    const gameStateToSave = {
      screen: gameState.currentScreen,
      position: { x: blok.x, y: blok.y },
      velocity: { x: blok.snelheidX, y: blok.snelheidY },
      timer: {
        elapsed: gameState.elapsedTime,
        lastTime: Date.now(),
      },
    };
    localStorage.setItem("jumpKingState", JSON.stringify(gameStateToSave));
  } else {
    // When returning to tab, update lastTime to prevent time counting while away
    gameState.lastTime = Date.now();
  }
  if (audioManager.currentTrack) {
    if (Array.isArray(audioManager.currentTrack)) {
      audioManager.currentTrack.forEach((track) => track.pause());
    } else {
      audioManager.currentTrack.pause();
    }
  }
});

window.addEventListener("load", () => {
  const savedState = localStorage.getItem("jumpKingState");
  if (savedState) {
    const state = JSON.parse(savedState);
    gameState.currentScreen = state.screen;
    blok.x = state.position.x;
    blok.y = state.position.y;
    blok.snelheidX = state.velocity.x;
    blok.snelheidY = state.velocity.y;

    // Restore timer state
    gameState.elapsedTime = state.timer.elapsed;
    gameState.startTime = Date.now();
    gameState.lastTime = gameState.startTime;
    gameState.isPaused = true;
  }
});

// Add updateAnimation() call in spelLus function before drawCharacter:
// Keep game paused while showing confirmation
function spelLus() {
  updateTimer();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scaleX = canvas.width / TARGET_WIDTH;
  const scaleY = canvas.height / TARGET_HEIGHT;
  ctx.scale(scaleX, scaleY);

  drawScreen(gameState.currentScreen, 0);
  updateAnimation();
  drawCharacter();
  drawTimer();

  if (gameState.hasWon) {
    // Fade to black
    ctx.fillStyle = `rgba(0, 0, 0, ${gameState.fadeAlpha})`;
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    if (gameState.fadeAlpha < 1) {
      gameState.fadeAlpha += 0.02;
    } else {
      gameState.showStats = true;
    }

    if (gameState.showStats) {
      // Draw stats screen
      ctx.font = "48px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Congratulations! You Got the Crown!", TARGET_WIDTH / 2, TARGET_HEIGHT / 3);

      // Show time
      const totalSeconds = Math.floor(gameState.elapsedTime / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const timeString = `Time: ${hours}:${minutes}:${seconds}`;
      ctx.fillText(timeString, TARGET_WIDTH / 2, TARGET_HEIGHT / 2);

      // Draw restart button
      ctx.fillStyle = "#3D283A";
      ctx.fillRect(TARGET_WIDTH / 2 - 100, (TARGET_HEIGHT * 2) / 3 - 25, 200, 50);
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText("Start Over", TARGET_WIDTH / 2, (TARGET_HEIGHT * 2) / 3 + 10);
    }
  }

  // Only draw menu if we're actually paused
  if (gameState.isPaused) {
    drawMenu();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!gameState.isPaused) {
    updateBlok();
  }
  requestAnimationFrame(spelLus);
}
canvas.addEventListener("click", (e) => {
  if (gameState.showStats) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (TARGET_WIDTH / canvas.width);
    const y = (e.clientY - rect.top) * (TARGET_HEIGHT / canvas.height);

    if (
      x >= TARGET_WIDTH / 2 - 100 &&
      x <= TARGET_WIDTH / 2 + 100 &&
      y >= (TARGET_HEIGHT * 2) / 3 - 25 &&
      y <= (TARGET_HEIGHT * 2) / 3 + 25
    ) {
      // Reset everything
      resetGame();
      gameState.hasWon = false;
      gameState.fadeAlpha = 0;
      gameState.showStats = false;
      spriteSheet.image.src = "spritesheet.png";
    }
  }
});

function updateBlok() {
  if (!gameState.isPlayingVictoryAnimation || gameState.adminMode) {
    const currentLevel = levels[gameState.currentScreen];
    const isOnTriangle =
      currentLevel.triangles &&
      currentLevel.triangles.some((triangle) => {
        const playerBottom = {
          x: blok.x + blok.breedte / 2,
          y: blok.y + blok.hoogte,
        };
        const inXBounds =
          triangle.direction === "right"
            ? blok.x + blok.breedte >= triangle.x1 && blok.x <= triangle.x2
            : blok.x + blok.breedte >= triangle.x2 && blok.x <= triangle.x1;

        if (!inXBounds) return false;

        const slope =
          triangle.direction === "right"
            ? (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1)
            : (triangle.y1 - triangle.y2) / (triangle.x1 - triangle.x2);

        const expectedY = triangle.y1 + slope * (playerBottom.x - triangle.x1);
        return Math.abs(playerBottom.y - expectedY) < 4;
      });

    if (gameState.adminMode) {
      const flySpeed = 5;
      if (keyboard.ArrowLeft) blok.x -= flySpeed;
      if (keyboard.ArrowRight) blok.x += flySpeed;
      if (keyboard.ArrowUp) {
        blok.y -= flySpeed;
        if (blok.y + blok.hoogte < 0 && gameState.currentScreen < levels.length - 1) {
          blok.y = TARGET_HEIGHT + blok.y;
          gameState.currentScreen++;
        }
      }
      if (keyboard.ArrowDown) {
        blok.y += flySpeed;
        if (blok.y > TARGET_HEIGHT && gameState.currentScreen > 0) {
          blok.y = blok.y - TARGET_HEIGHT;
          gameState.currentScreen--;
        }
      }
      return;
    }

    if (gameState.isPlayingVictoryAnimation) {
      return;
    }
    if (isOnTriangle) {
      keyboard.ArrowLeft = false;
      keyboard.ArrowRight = false;
      keyboard.Space = false;
      blok.isChargingJump = false;
      blok.isWalking = false; // Get the current triangle

      const triangle = currentLevel.triangles.find((t) => {
        const playerBottom = {
          x: blok.x + blok.breedte / 2,
          y: blok.y + blok.hoogte,
        };
        return playerBottom.x >= t.x1 && playerBottom.x <= t.x2;
      });

      if (triangle) {
        const slope = (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1);
        const directionMultiplier = triangle.direction === "right" ? 1 : -1;
        blok.snelheidX += 0.1 * directionMultiplier;
        blok.snelheidX = Math.max(-3, Math.min(blok.snelheidX, 3));
        blok.snelheidY = Math.abs(slope * blok.snelheidX);
      }
    } // Platform edge detection

    if (blok.opGrond) {
      let isOnPlatform = false;
      for (const platform of currentLevel.platforms) {
        if (
          blok.x + blok.breedte > platform.x &&
          blok.x < platform.x + platform.width &&
          Math.abs(blok.y + blok.hoogte - platform.y) < 2
        ) {
          isOnPlatform = true;
          break;
        }
      }

      const isOnGround =
        gameState.currentScreen === 0 && Math.abs(blok.y + blok.hoogte - (TARGET_HEIGHT - GROUND_HEIGHT)) < 2;

      if (!isOnPlatform && !isOnGround && !isOnTriangle) {
        blok.opGrond = false;
        blok.snelheidY = 0.1;
        if (keyboard.ArrowLeft) {
          blok.snelheidX = -1.33;
        } else if (keyboard.ArrowRight) {
          blok.snelheidX = 1.33;
        }
      }
    }

    updateJumpCharge();

    // Add crown collision detection in updateBlok

    if (blok.isChargingJump) {
      spriteSheet.currentAnimation = "charging";
    }
    if (!blok.opGrond) {
      if (blok.hasCollided && !isOnTriangle) {
        spriteSheet.currentAnimation = "bump";
      } else if (blok.snelheidY < 0) {
        spriteSheet.currentAnimation = "jumpUp";
      } else {
        spriteSheet.currentAnimation = "jumpDown";
      }
      blok.fallDistance += blok.snelheidY;
      blok.snelheidY += blok.zwaartekracht;
    } else {
      blok.hasCollided = false;
    }

    if (blok.isStunned) {
      spriteSheet.currentAnimation = "knocked";
      blok.snelheidX = 0;
      blok.snelheidY = 0;
      if (Date.now() - blok.stunTimer >= blok.stunDuration) {
        blok.isStunned = false;
        spriteSheet.currentAnimation = "idle";
      }
      return;
    } else {
      blok.kleur = blok.normalColor;
    }

    if (blok.opGrond && !blok.isChargingJump && !isOnTriangle) {
      let nextPosition = blok.x;
      if (keyboard.ArrowLeft) {
        nextPosition = blok.x - blok.walkSpeed;
        blok.jumpDirection = -1;
        spriteSheet.currentAnimation = "walking";
        spriteSheet.facingRight = false;
      } else if (keyboard.ArrowRight) {
        nextPosition = blok.x + blok.walkSpeed;
        blok.jumpDirection = 1;
        spriteSheet.currentAnimation = "walking";
        spriteSheet.facingRight = true;
      } else {
        spriteSheet.currentAnimation = "idle";
      }
      blok.x = nextPosition;
    }

    let nextX = blok.x + blok.snelheidX;
    let nextY = blok.y + blok.snelheidY;

    const collision = checkPlatformCollisions(nextX, nextY);
    nextX = collision.x;
    nextY = collision.y;

    if (nextX < 0) {
      nextX = 0;
      blok.snelheidX = 0;
    }
    if (nextX + blok.breedte > TARGET_WIDTH) {
      nextX = TARGET_WIDTH - blok.breedte;
      blok.snelheidX = 0;
    }

    if (nextY + blok.hoogte < 0 && gameState.currentScreen < levels.length - 1) {
      gameState.screenTransition.active = true;
      gameState.screenTransition.targetOffset = TARGET_HEIGHT;
      nextY = TARGET_HEIGHT + nextY;
      gameState.currentScreen++;
      audioManager.playTrackForLevel(gameState.currentScreen + 1);
    }

    if (nextY > TARGET_HEIGHT && gameState.currentScreen > 0) {
      gameState.screenTransition.active = true;
      gameState.screenTransition.targetOffset = -TARGET_HEIGHT;
      nextY = nextY - TARGET_HEIGHT;
      gameState.currentScreen--;
      audioManager.playTrackForLevel(gameState.currentScreen + 1);
    }

    if (gameState.currentScreen === 0 && nextY + blok.hoogte > TARGET_HEIGHT - GROUND_HEIGHT) {
      nextY = TARGET_HEIGHT - GROUND_HEIGHT - blok.hoogte;
      blok.snelheidY = 0;
      blok.snelheidX = 0;
      blok.opGrond = true;
    }
    // Right before blok.x = nextX and blok.y = nextY
    if (gameState.currentScreen === 14) {
      // Level 15
      // Draw collision box for debugging
      ctx.strokeStyle = "red";
      ctx.strokeRect(710, 240, 50, 20);

      // More generous collision detection
      if (nextX + blok.breedte > 710 && nextX < 760 && nextY + blok.hoogte > 240 && nextY < 260) {
        gameState.hasCrown = true;
        gameState.showCrownSprite = true;

        if (gameState.hasCrown && blok.opGrond && !gameState.isPlayingVictoryAnimation) {
          console.log("Starting victory sequence");
          gameState.isPlayingVictoryAnimation = true;
          spriteSheet.currentAnimation = "dancing";

          setTimeout(() => {
            console.log("Starting charge");
            spriteSheet.currentAnimation = "charging";

            setTimeout(() => {
              console.log("Executing jump");
              gameState.isPlayingVictoryAnimation = false;

              // Use actual full charge jump values
              blok.springKracht = blok.maxJumpForce;
              blok.snelheidY = -blok.maxJumpForce * 1.3;
              blok.snelheidX = blok.maxHorizontalForce;
              blok.opGrond = false;
              spriteSheet.facingRight = true;

              checkPlatformCollisions = () => ({ x: blok.x + blok.snelheidX, y: blok.y + blok.snelheidY });

              setTimeout(() => {
                gameState.hasWon = true;
              }, 100);
            }, 2000);
          }, 2400);
        }
      }
    }

    blok.x = nextX;
    blok.y = nextY;
  } else {
    // Only victory animation movement
    blok.x += blok.snelheidX;
    blok.y += blok.snelheidY;
  }
}

function drawScreen(screenIndex, offset) {
  const level = levels[screenIndex];

  if (level.backgroundColor) {
    ctx.fillStyle = level.backgroundColor;
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
  }

  if (backgroundImages[screenIndex + 1]) {
    ctx.drawImage(backgroundImages[screenIndex + 1], 0, -offset, TARGET_WIDTH, TARGET_HEIGHT);
  }
  if (screenIndex === 14) {
    // Index 14 is level 15 since arrays start at 0
    const customImage = new Image();
    customImage.src = "crown.png";

    // Parameters: image, x, y, width, height
    ctx.drawImage(customImage, 710, 250, 100, 100); // Adjust these numbers for position and size
  }

  // Draw ground
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, level.ground.y - offset, TARGET_WIDTH, level.ground.height);

  // Draw platforms
  for (const platform of level.platforms) {
    ctx.fillStyle = platform.color || "#666666";
    ctx.fillRect(platform.x, platform.y - offset, platform.width, platform.height);

    if (level.platformOutlineColor) {
      ctx.strokeStyle = level.platformOutlineColor;
      ctx.lineWidth = level.platformOutlineWidth || 2;
      ctx.strokeRect(platform.x, platform.y - offset, platform.width, platform.height);
    }
  }

  if (level.triangles) {
    for (const triangle of level.triangles) {
      ctx.fillStyle = triangle.color || level.triangleColor || "#888888";
      ctx.beginPath();
      ctx.moveTo(triangle.x1, triangle.y1);
      ctx.lineTo(triangle.x2, triangle.y2);
      ctx.lineTo(triangle.x3, triangle.y3);
      ctx.closePath();
      ctx.fill();

      if (level.triangleOutlineColor) {
        ctx.strokeStyle = level.triangleOutlineColor;
        ctx.lineWidth = level.triangleOutlineWidth || 2;
        ctx.stroke();
      }
    }
  } // Draw detection points
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(blok.x, blok.y + blok.hoogte, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(blok.x + blok.breedte, blok.y + blok.hoogte, 3, 0, Math.PI * 2);
  ctx.fill();

  if (foregroundImages[screenIndex + 1]) {
    ctx.drawImage(foregroundImages[screenIndex + 1], 0, -offset, TARGET_WIDTH, TARGET_HEIGHT);
  }
}

window.addEventListener("keydown", (e) => {
  keyboard[e.code] = true;

  if (e.code === "KeyP") {
    gameState.adminMode = !gameState.adminMode;
    blok.snelheidX = 0;
    blok.snelheidY = 0;
  }
  if (e.code === "Escape") {
    gameState.isPaused = !gameState.isPaused;
    if (!gameState.isPaused) {
      gameState.lastTime = Date.now();
    }
  }

  if (!gameState.adminMode) {
    if (!blok.opGrond) return;
    if (e.code === "Space" && !blok.isChargingJump) {
      blok.isChargingJump = true;
      blok.jumpChargeTime = 0;
      blok.springKracht = 0;
    }
  }
});
let showingConfirmation = false;

function drawMenu() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const scaleX = canvas.width / TARGET_WIDTH;
  const scaleY = canvas.height / TARGET_HEIGHT;
  ctx.scale(scaleX, scaleY);

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  const buttons = [
    { text: "Return To Game", y: TARGET_HEIGHT / 2 - 80 },
    { text: audioManager.isSoundEnabled ? "Turn Off Sound" : "Turn On Sound", y: TARGET_HEIGHT / 2 },
    { text: "Reset Game", y: TARGET_HEIGHT / 2 + 80 },
  ];

  ctx.font = "30px Arial";
  ctx.textAlign = "center";

  buttons.forEach((button) => {
    ctx.fillStyle = "#3D283A";
    ctx.fillRect(TARGET_WIDTH / 2 - 150, button.y - 25, 300, 50);
    ctx.fillStyle = "white";
    ctx.fillText(button.text, TARGET_WIDTH / 2, button.y + 10);
  });

  ctx.restore();
}

canvas.addEventListener("click", (e) => {
  if (!gameState.isPaused) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (TARGET_WIDTH / canvas.width);
  const y = (e.clientY - rect.top) * (TARGET_HEIGHT / canvas.height);

  if (x >= TARGET_WIDTH / 2 - 150 && x <= TARGET_WIDTH / 2 + 150) {
    if (y >= TARGET_HEIGHT / 2 - 105 && y <= TARGET_HEIGHT / 2 - 55) {
      gameState.isPaused = false;
      if (audioManager.isSoundEnabled) {
        audioManager.playTrackForLevel(gameState.currentScreen + 1);
      }
    } else if (y >= TARGET_HEIGHT / 2 - 25 && y <= TARGET_HEIGHT / 2 + 25) {
      audioManager.toggleSound();
    } else if (y >= TARGET_HEIGHT / 2 + 55 && y <= TARGET_HEIGHT / 2 + 105) {
      // Reset game and exit menu
      resetGame();
      gameState.currentScreen = 0;
      blok.x = TARGET_WIDTH / 2 - 25;
      blok.y = TARGET_HEIGHT - GROUND_HEIGHT - 50;
      blok.snelheidX = 0;
      blok.snelheidY = 0;
      gameState.isPaused = false;
    }
  }
});
function resetGame() {
  gameState.startTime = Date.now();
  gameState.lastTime = gameState.startTime;
  gameState.elapsedTime = 0;
  gameState.isPaused = false;
}

window.addEventListener("keyup", (e) => {
  keyboard[e.code] = false;
  if (e.code === "Space" && blok.isChargingJump) {
    executeJump();
  }
});

window.addEventListener("resize", resizeCanvas);

requestAnimationFrame(spelLus);
audioManager.playTrackForLevel(1);
