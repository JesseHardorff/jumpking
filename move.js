// Import level data van levells.js
import { getLevelData } from "./levels.js";

// Canvas setup voor de game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const TARGET_WIDTH = 959;
const TARGET_HEIGHT = 716;

const FRAME_TIME = 1 / 60; // Target 60 FPS for consistent movement
const GAME_SPEED = 2.0; // 2x speed, adjust this number to control overall game speed

// Grond settings(is eigenlijk alleen voor level 1)
const GROUND_HEIGHT = 65;
const GROUND_COLOR = "#4a4a4a";

let lastFrameTime = Date.now();
// Plaatjes voor de voorgrond laden
const foregroundImages = {};
for (let i = 1; i <= 15; i++) {
  const img = new Image();
  img.src = `overlay/fg${i}.png`;
  img.onload = () => {
    foregroundImages[i] = img;
  };
}

// Plaatjes voor de achtergrond laden
const backgroundImages = {};
for (let i = 1; i <= 15; i++) {
  const img = new Image();
  img.src = `bg/bg${i}.png`;
  img.onload = () => {
    backgroundImages[i] = img;
  };
}

// Alle levels inladen
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

// Game status bijhouden
const gameState = {
  currentScreen: 0, // In welk level je zit
  adminMode: false, // Admin mode aan/uit
  startTime: null, // Wanneer je begint
  elapsedTime: 0, // Hoelang je al speelt
  lastTime: null, // Laatste tijd update
  isPaused: true, // Pauze menu

  // Crown stuff
  showCrownSprite: false, // Of je crown sprite moet zien
  hasCrown: false, // Of je crown hebt gepakt

  // Win conditions
  hasWon: false,
  isPlayingVictoryAnimation: false,
  showStats: false,
  fadeAlpha: 0,

  // Screen transition
  screenTransition: {
    active: false,
    offset: 0,
    targetOffset: 0,
  },
};

// Canvas grootte fixen als window size verandert
function resizeCanvas() {
  // Pak scherm grootte
  const screen = canvas.parentElement;

  // Check of het scherm breed of hoog is
  if (screen.clientWidth / screen.clientHeight > TARGET_WIDTH / TARGET_HEIGHT) {
    // Breed scherm - hoogte is basis
    canvas.height = screen.clientHeight;
    canvas.width = canvas.height * (TARGET_WIDTH / TARGET_HEIGHT);
  } else {
    // Hoog scherm - breedte is basis
    canvas.width = screen.clientWidth;
    canvas.height = canvas.width * (TARGET_HEIGHT / TARGET_WIDTH);
  }
}

resizeCanvas();

// Basis sprite settings voor beide sprites
const baseSprite = {
  frameWidth: 32,
  frameHeight: 32,
  facingRight: true,
  currentAnimation: "idle",
  animations: {
    idle: { x: 230, y: 18, frames: 1 },
    charging: { x: 232, y: 66, frames: 1 },
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
    jumpUp: { x: 278, y: 58, frames: 1 },
    jumpDown: { x: 330, y: 58, frames: 1 },
    knocked: { x: 376, y: 66, frames: 1 },
    bump: { x: 232, y: 114, frames: 1 },
  },
};

// Maak sprites met eigen plaatje
const spriteSheet = {
  ...baseSprite,
  image: new Image(),
};
spriteSheet.image.src = "spritesheet.png";

const crownSprite = {
  ...baseSprite,
  image: new Image(),
};
crownSprite.image.src = "./crown-spritesheet.png";
function drawCharacter() {
  // Pak huidige animatie
  const animation = spriteSheet.animations[spriteSheet.currentAnimation];

  // Pixel art scherp maken
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;

  // Frame groottes bepalen
  const frameWidth = spriteSheet.currentAnimation === "walking" ? 40 : spriteSheet.frameWidth;
  const displayWidth = spriteSheet.currentAnimation === "walking" ? 75 : 60;

  const isJumping = spriteSheet.currentAnimation === "jumpUp" || spriteSheet.currentAnimation === "jumpDown";
  const frameHeight = isJumping ? 48 : spriteSheet.frameHeight;
  const displayHeight = isJumping ? 90 : 60;

  // Karakter in het midden zetten
  const xOffset = (blok.breedte - displayWidth) / 2;
  const yOffset = (blok.hoogte - displayHeight) / 2;

  // Links/rechts kijken fixen
  ctx.save();
  if (!spriteSheet.facingRight) {
    ctx.scale(-1, 1);
    ctx.translate(-2 * (blok.x + xOffset) - displayWidth, 0);
  }

  // Juiste frame uit spritesheet pakken
  const { sourceX, sourceY } = getFrameCoordinates(animation);

  // Karakter tekenen
  drawSprite(
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

  // Crown tekenen als je die hebt
  if (gameState.showCrownSprite) {
    drawSprite(
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

// Helper functie voor frame coordinaten
function getFrameCoordinates(animation) {
  if (animation.frames && Array.isArray(animation.frames)) {
    return {
      sourceX: animation.frames[animation.currentFrame].x,
      sourceY: animation.frames[animation.currentFrame].y,
    };
  }
  return {
    sourceX: animation.x,
    sourceY: animation.y,
  };
}

// Helper functie voor sprite tekenen
function drawSprite(image, sx, sy, sw, sh, dx, dy, dw, dh) {
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}
const blok = {
  // Positie van karakter
  x: TARGET_WIDTH / 2 - 25, // X positie in het midden op start
  y: TARGET_HEIGHT - GROUND_HEIGHT - 50, // Y positie op de grond op start
  breedte: 40, // Breedte van hitbox
  hoogte: 50, // Hoogte van hitbox

  // Stun eigenschappen
  fallDistance: 0, // Hoe ver je valt
  fallThreshold: 400, // Wanneer je stun krijgt
  isStunned: false, // Of je gestunt bent
  stunTimer: 0, // Hoelang je al gestunt bent
  stunDuration: 800, // Hoe lang stun duurt

  // Beweging
  snelheidX: 0, // Links/rechts snelheid
  snelheidY: 0, // Omhoog/omlaag snelheid
  zwaartekracht: 0.1, // Hoe snel je valt

  // Spring eigenschappen
  springKracht: 0, // Huidige spring kracht
  minJumpForce: 0.7, // Min spring hoogte
  maxJumpForce: 6.17, // Max spring hoogte
  minHorizontalForce: 2.7, // Min zijwaartse spring kracht
  maxHorizontalForce: 3.0, // Max zijwaartse spring kracht
  jumpChargeTime: 0, // Hoe lang je springt
  maxChargeTime: 1500, // Max spring laad tijd
  isChargingJump: false, // Of je aan het laden bent
  opGrond: true, // Of je op de grond staat
  bounceStrength: 0.47, // Hoe hard je stuitert
  walkSpeed: 1.2, // Loop snelheid

  // Collision checks
  hasCollided: false, // Of je net gebotst bent
};
const audioManager = {
  // Achtergrond muziek
  cricket: new Audio("sound/bg-music/cricket.wav"),
  riool: new Audio("sound/bg-music/riool.wav"),
  episch: new Audio("sound/bg-music/episch.mp3"),
  wind: new Audio("sound/bg-music/wind.wav"),
  currentTrack: null,
  isSoundEnabled: true,

  // Geluidseffecten
  sfx: {
    splat: new Audio("sound/movement/king_splat.wav"), // Als je hard valt
    land: new Audio("sound/movement/king_land.wav"), // Als je landt
    jump: new Audio("sound/movement/king_jump.wav"), // Als je springt
    bump: new Audio("sound/movement/king_bump.wav"), // Als je botst
  },
  lastBumpTime: 0, // Laatste botsing tijd
  bumpCooldown: 150, // Wachttijd tussen botsing geluiden

  // Speel een geluid effect
  playSfx(soundName) {
    if (!this.isSoundEnabled) return;

    const sound = this.sfx[soundName];
    if (soundName === "bump") {
      const now = Date.now();
      if (now - this.lastBumpTime < this.bumpCooldown) return;
      this.lastBumpTime = now;
    }
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    clone.play();
  },

  // Geluid aan/uit zetten
  toggleSound() {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (this.isSoundEnabled) {
      this.playTrackForLevel(gameState.currentScreen + 1);
    } else {
      this.stopCurrentTrack();
    }
  },

  // Bepaal welke muziek voor welk level
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

  // Stop huidige muziek
  stopCurrentTrack() {
    if (!this.currentTrack) return;

    if (Array.isArray(this.currentTrack)) {
      this.currentTrack.forEach((track) => {
        track.pause();
        track.currentTime = 0;
      });
    } else {
      this.currentTrack.pause();
      this.currentTrack.currentTime = 0;
    }
    this.currentTrack = null;
  },

  // Start muziek voor een level
  playTrackForLevel(levelNum) {
    if (!this.isSoundEnabled) return;

    const newTrack = this.getTrackForLevel(levelNum);
    if (this.currentTrack === this.episch && newTrack === this.episch) return;

    this.stopCurrentTrack();
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
};

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
    return {
      x: nextX,
      y: nextY,
    };
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
        blok.snelheidX += 0.2 * directionMultiplier;
        blok.snelheidX = Math.max(-3, Math.min(blok.snelheidX, 3));

        blok.snelheidY = 0; // Instead, just set vertical speed to 0
        blok.opGrond = true;
        return {
          x: nextX,
          y: nextY,
        };
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

        return {
          x: nextX,
          y: nextY,
        };
      }

      if (blok.y >= platform.y + platform.height && nextY < platform.y + platform.height) {
        nextY = platform.y + platform.height;
        blok.snelheidY = 0;
        blok.snelheidX *= 0.5;
        audioManager.playSfx("bump");
        blok.hasCollided = true;
        spriteSheet.currentAnimation = "bump";
        return {
          x: nextX,
          y: nextY,
        };
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

  return {
    x: nextX,
    y: nextY,
  };
}
// Update de speedrun timer
function updateTimer() {
  const timerShouldRun =
    !gameState.isPaused && !gameState.timerStopped && gameState.startTime && !showingConfirmation && !gameState.hasWon;

  const now = Date.now();

  if (timerShouldRun && gameState.lastTime) {
    gameState.elapsedTime += now - gameState.lastTime;
  }

  gameState.lastTime = now;
}

// Teken de timer op het scherm
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

// Update de spring lading
function updateJumpCharge(deltaTime) {
  if (blok.isChargingJump) {
    spriteSheet.currentAnimation = "charging";
    blok.jumpChargeTime += deltaTime * 2000;
    let chargeProgress = Math.min(blok.jumpChargeTime / blok.maxChargeTime, 1);
    blok.springKracht = blok.minJumpForce + (blok.maxJumpForce - blok.minJumpForce) * chargeProgress;

    if (chargeProgress >= 1) {
      executeJump();
    }
  } else if (blok.opGrond && Math.abs(blok.snelheidX) < 0.1) {
    spriteSheet.currentAnimation = "idle";
  }
}

// Spring uitvoeren als je de knop loslaat
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
  }
}

// Reset knoppen als tab unfocused is
window.addEventListener("blur", () => {
  keyboard.ArrowLeft = false;
  keyboard.ArrowRight = false;
  keyboard.Space = false;
});

// Muur botsing afhandelen
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

// Update de sprite animatie frames
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

// Game status opslaan als tab/window sluit
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

    // Muziek pauzeren
    if (audioManager.currentTrack) {
      if (Array.isArray(audioManager.currentTrack)) {
        audioManager.currentTrack.forEach((track) => track.pause());
      } else {
        audioManager.currentTrack.pause();
      }
    }
  } else {
    gameState.lastTime = Date.now();
  }
});
// Laad game state als je de pagina opent
window.addEventListener("load", () => {
  if (localStorage.getItem("hasCrownForever") === "true") {
    gameState.showCrownSprite = true;
  }

  const savedState = localStorage.getItem("jumpKingState");
  if (savedState) {
    const state = JSON.parse(savedState);
    gameState.currentScreen = state.screen;
    blok.x = state.position.x;
    blok.y = state.position.y;
    blok.snelheidX = state.velocity.x;
    blok.snelheidY = state.velocity.y;

    // Timer resetten bij laden
    gameState.elapsedTime = state.timer.elapsed;
    gameState.startTime = Date.now();
    gameState.lastTime = gameState.startTime;
    gameState.isPaused = true;
  }
});

// Main game loop
function spelLus() {
  const currentTime = Date.now();
  const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, FRAME_TIME);
  lastFrameTime = currentTime;

  updateTimer();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scaleX = canvas.width / TARGET_WIDTH;
  const scaleY = canvas.height / TARGET_HEIGHT;
  ctx.scale(scaleX, scaleY);

  drawScreen(gameState.currentScreen, 0);
  updateAnimation();
  drawCharacter();
  drawTimer();

  if (!gameState.isPaused) {
    updateBlok(deltaTime); // Only call updateBlok once here
  }

  if (gameState.isPaused) {
    drawMenu();
  }
  if (gameState.hasWon) {
    // Draw stats screen
    ctx.font = "48px Arial";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Congratulations! You Got the Crown!", TARGET_WIDTH / 2, TARGET_HEIGHT / 3);

    // Show time
    const totalSeconds = Math.floor(gameState.elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const timeString = `${hours}:${minutes}:${seconds}`;

    const currentBest = localStorage.getItem("bestTime");
    if (!currentBest || totalSeconds < parseInt(currentBest)) {
      localStorage.setItem("bestTime", timeString);
    }
    ctx.fillText(timeString, TARGET_WIDTH / 2, TARGET_HEIGHT / 2);

    // Draw restart button
    ctx.fillStyle = "#3D283A";
    ctx.fillRect(TARGET_WIDTH / 2 - 100, (TARGET_HEIGHT * 2) / 3 - 25, 200, 50);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Start Over", TARGET_WIDTH / 2, (TARGET_HEIGHT * 2) / 3 + 10);
  } else if (gameState.isPaused) {
    drawMenu();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  requestAnimationFrame(spelLus);
}
function updateBlok(deltaTime) {
  const scaledDelta = deltaTime * GAME_SPEED;

  if (gameState.updateStatsTimer) {
    gameState.updateStatsTimer(deltaTime);
  }

  if (!gameState.isPlayingVictoryAnimation || gameState.adminMode) {
    const currentLevel = levels[gameState.currentScreen];

    // Triangle detection
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

    // Admin mode
    if (gameState.adminMode) {
      const flySpeed = 5 * scaledDelta * 60;
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

    // Triangle movement
    if (isOnTriangle) {
      keyboard.ArrowLeft = false;
      keyboard.ArrowRight = false;
      keyboard.Space = false;
      blok.isChargingJump = false;
      blok.isWalking = false;

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
        blok.snelheidX += 0.1 * directionMultiplier * scaledDelta * 60;
        blok.snelheidX = Math.max(-3, Math.min(blok.snelheidX, 3));
        blok.snelheidY = Math.abs(slope * blok.snelheidX);
      }
    }

    // Platform edge detection
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

    updateJumpCharge(deltaTime);

    // Animation updates
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
      blok.snelheidY += 0.1 * scaledDelta * 60;
    } else {
      blok.hasCollided = false;
    }

    // Stun check
    if (blok.isStunned) {
      spriteSheet.currentAnimation = "knocked";
      blok.snelheidX = 0;
      blok.snelheidY = 0;
      if (Date.now() - blok.stunTimer >= blok.stunDuration) {
        blok.isStunned = false;
        spriteSheet.currentAnimation = "idle";
      }
      return;
    }

    // Walking movement
    // Walking movement
    if (blok.opGrond && !blok.isChargingJump && !isOnTriangle) {
      let nextPosition = blok.x;
      if (keyboard.ArrowLeft) {
        nextPosition = blok.x - 3.5 * deltaTime * 60;
        blok.jumpDirection = -1;
        spriteSheet.currentAnimation = "walking";
        spriteSheet.facingRight = false;
      } else if (keyboard.ArrowRight) {
        nextPosition = blok.x + 3.5 * deltaTime * 60;
        blok.jumpDirection = 1;
        spriteSheet.currentAnimation = "walking";
        spriteSheet.facingRight = true;
      } else {
        spriteSheet.currentAnimation = "idle";
      }

      // Check for platform collisions before updating position
      const collision = checkPlatformCollisions(nextPosition, blok.y);
      blok.x = collision.x;
    }

    // Position updates
    let nextX = blok.x + blok.snelheidX * scaledDelta * 60;
    let nextY = blok.y + blok.snelheidY * scaledDelta * 60;

    // Collision checks
    const collision = checkPlatformCollisions(nextX, nextY);
    nextX = collision.x;
    nextY = collision.y;

    // Screen boundaries
    if (nextX < 0) {
      nextX = 0;
      blok.snelheidX = 0;
    }
    if (nextX + blok.breedte > TARGET_WIDTH) {
      nextX = TARGET_WIDTH - blok.breedte;
      blok.snelheidX = 0;
    }

    // Level transitions
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

    // Ground check for first level
    if (gameState.currentScreen === 0 && nextY + blok.hoogte > TARGET_HEIGHT - GROUND_HEIGHT) {
      nextY = TARGET_HEIGHT - GROUND_HEIGHT - blok.hoogte;
      blok.snelheidY = 0;
      blok.snelheidX = 0;
      blok.opGrond = true;
    }

    // Crown collection
    if (gameState.currentScreen === 14) {
      if (nextX + blok.breedte > 740 && nextX < 780 && nextY + blok.hoogte > 240 && nextY < 260) {
        gameState.hasCrown = true;
        gameState.showCrownSprite = true;
        gameState.timerStopped = true;
        localStorage.setItem("hasCrownForever", "true");

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

              blok.springKracht = blok.maxJumpForce;
              blok.snelheidY = -blok.maxJumpForce * 1.3;
              blok.snelheidX = blok.maxHorizontalForce;
              blok.opGrond = false;
              spriteSheet.facingRight = true;
              audioManager.playSfx("jump");

              let statsTimer = 0;
              const showStatsAfter = 0.8; // seconds

              function updateStatsTimer(deltaTime) {
                statsTimer += deltaTime;
                if (statsTimer >= showStatsAfter) {
                  gameState.hasWon = true;
                  gameState.showStats = true;
                  blok.snelheidX = 0;
                  blok.snelheidY = 0;
                  gameState.isPlayingVictoryAnimation = true;

                  // Save best time
                  const currentTime = gameState.elapsedTime;
                  const savedBestTime = localStorage.getItem("bestTime");

                  if (!savedBestTime || currentTime < parseInt(savedBestTime)) {
                    localStorage.setItem("bestTime", currentTime.toString());
                  }
                }
              }

              gameState.updateStatsTimer = updateStatsTimer;
            }, 2000);
          }, 2400);
        }
      }
    }

    // Update final position
    blok.x = nextX;
    blok.y = nextY;
  } else if (gameState.isPlayingVictoryAnimation) {
    // Victory animation movement with deltaTime
    blok.x += blok.snelheidX * scaledDelta * 60;
    blok.y += blok.snelheidY * scaledDelta * 60;

    // Fade effect with deltaTime
    if (gameState.hasWon) {
      gameState.fadeAlpha += 0.02 * scaledDelta * 60;
    }
  }
}

// Load crown image
const crownImage = new Image();
crownImage.src = "crown.png";

// Teken het level
function drawScreen(screenIndex, offset) {
  const level = levels[screenIndex];

  // Teken achtergrond kleur
  if (level.backgroundColor) {
    ctx.fillStyle = level.backgroundColor;
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
  }

  // Teken achtergrond afbeelding
  if (backgroundImages[screenIndex + 1]) {
    ctx.drawImage(backgroundImages[screenIndex + 1], 0, -offset, TARGET_WIDTH, TARGET_HEIGHT);
  }

  // Teken crown in laatste level
  if (screenIndex === 14 && !gameState.hasCrown && !gameState.isPlayingVictoryAnimation) {
    ctx.drawImage(crownImage, 710, 250, 100, 100);
  }

  // Teken grond
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, level.ground.y - offset, TARGET_WIDTH, level.ground.height);

  // Teken platforms
  for (const platform of level.platforms) {
    ctx.fillStyle = platform.color || "#666666";
    ctx.fillRect(platform.x, platform.y - offset, platform.width, platform.height);

    if (level.platformOutlineColor) {
      ctx.strokeStyle = level.platformOutlineColor;
      ctx.lineWidth = level.platformOutlineWidth || 2;
      ctx.strokeRect(platform.x, platform.y - offset, platform.width, platform.height);
    }
  }

  // Teken driehoeken
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
  }

  // Teken collision detectie punten
  // ctx.fillStyle = "yellow";
  // ctx.beginPath();
  // ctx.arc(blok.x, blok.y + blok.hoogte, 3, 0, Math.PI * 2);
  // ctx.fill();

  // ctx.beginPath();
  // ctx.arc(blok.x + blok.breedte, blok.y + blok.hoogte, 3, 0, Math.PI * 2);
  // ctx.fill();

  // Teken voorgrond afbeelding
  if (foregroundImages[screenIndex + 1]) {
    ctx.drawImage(foregroundImages[screenIndex + 1], 0, -offset, TARGET_WIDTH, TARGET_HEIGHT);
  }
}

// Toetsenbord input
window.addEventListener("keydown", (e) => {
  keyboard[e.code] = true;

  // Admin mode toggle
  if (e.code === "KeyP") {
    gameState.adminMode = !gameState.adminMode;
    blok.snelheidX = 0;
    blok.snelheidY = 0;
  }

  // Pauze toggle
  if (e.code === "Escape") {
    gameState.isPaused = !gameState.isPaused;
    if (!gameState.isPaused) {
      gameState.lastTime = Date.now();
    }
  }

  // Spring laden
  if (!gameState.adminMode) {
    if (!blok.opGrond) return;
    if (e.code === "Space" && !blok.isChargingJump) {
      blok.isChargingJump = true;
      blok.jumpChargeTime = 0;
      blok.springKracht = 0;
    }
  }
});

// Variable om bij te houden of er een bevestiging wordt getoond
let showingConfirmation = false;

// Functie om het pauze menu te tekenen
function drawMenu() {
  // Canvas instellingen opslaan en resetten
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Schaal berekenen voor responsive weergave
  const scaleX = canvas.width / TARGET_WIDTH;
  const scaleY = canvas.height / TARGET_HEIGHT;
  ctx.scale(scaleX, scaleY);

  // Halftransparante zwarte achtergrond
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  // Beste tijd ophalen en weergeven

  // Menu knoppen definieren
  const buttons = [
    { text: "Return To Game", y: TARGET_HEIGHT / 2 - 80 },
    { text: audioManager.isSoundEnabled ? "Turn Off Sound" : "Turn On Sound", y: TARGET_HEIGHT / 2 },
    { text: "Reset Game", y: TARGET_HEIGHT / 2 + 80 },
  ];

  // Knoppen tekenen
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  buttons.forEach((button) => {
    ctx.fillStyle = "#3D283A";
    ctx.fillRect(TARGET_WIDTH / 2 - 150, button.y - 25, 300, 50);
    ctx.fillStyle = "white";
    ctx.fillText(button.text, TARGET_WIDTH / 2, button.y + 10);
  });

  // Besturingsinstructies onderaan
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Arrows to move Left and Right", TARGET_WIDTH / 2, (TARGET_HEIGHT * 3) / 4);
  ctx.fillText("Spacebar to Jump", TARGET_WIDTH / 2, (TARGET_HEIGHT * 3) / 4 + 40);
  ctx.fillText("Arrow + Spacebar to Jump to the side", TARGET_WIDTH / 2, (TARGET_HEIGHT * 3) / 4 + 80);

  ctx.restore();
}

// Klik handler voor menu knoppen
canvas.addEventListener("click", (e) => {
  if (!gameState.isPaused) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (TARGET_WIDTH / canvas.width);
  const y = (e.clientY - rect.top) * (TARGET_HEIGHT / canvas.height);

  if (x >= TARGET_WIDTH / 2 - 150 && x <= TARGET_WIDTH / 2 + 150) {
    // Return to game button
    if (y >= TARGET_HEIGHT / 2 - 105 && y <= TARGET_HEIGHT / 2 - 55) {
      gameState.isPaused = false;
      if (audioManager.isSoundEnabled) {
        audioManager.playTrackForLevel(gameState.currentScreen + 1);
      }
    }
    // Sound toggle button
    else if (y >= TARGET_HEIGHT / 2 - 25 && y <= TARGET_HEIGHT / 2 + 25) {
      audioManager.toggleSound();
    }
    // Reset button - update coordinates to match the button position
    else if (y >= TARGET_HEIGHT / 2 + 55 && y <= TARGET_HEIGHT / 2 + 105) {
      resetGame();
    }
  }
});
// Klik handler voor eind statistieken
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
      resetGame();
      gameState.currentScreen = 0;
      blok.x = TARGET_WIDTH / 2 - 25;
      blok.y = TARGET_HEIGHT - GROUND_HEIGHT - 50;
      blok.snelheidX = 0;
      blok.snelheidY = 0;
      gameState.isPaused = false;
      gameState.showStats = false; // This will hide the stats screen
      gameState.hasWon = false; // This ensures the victory state is reset
    }
  }
});

// Functie om het spel te resetten naar beginstand
function resetGame() {
  // Reset timer en game status
  gameState.startTime = Date.now();
  gameState.updateStatsTimer = null;
  gameState.lastTime = gameState.startTime;
  gameState.elapsedTime = 0;
  gameState.isPaused = false;
  gameState.currentScreen = 0;
  gameState.hasWon = false;
  gameState.fadeAlpha = 0;
  gameState.showStats = false;
  gameState.timerStopped = false;
  gameState.isPlayingVictoryAnimation = false;
  crownImage.src = "crown.png";
  console.log("wadwdawd");
  // Reset speler positie en beweging
  blok.x = TARGET_WIDTH / 2 - 25;
  blok.y = TARGET_HEIGHT - GROUND_HEIGHT - 50;
  blok.snelheidX = 0;
  blok.snelheidY = 0;
  blok.opGrond = true;

  // Reset animatie en muziek
  spriteSheet.currentAnimation = "idle";
  spriteSheet.facingRight = true;
  audioManager.playTrackForLevel(1);

  // Behoud crown status als die al behaald was
  if (localStorage.getItem("hasCrownForever") === "true") {
    gameState.showCrownSprite = true;
  }
}

// Handler voor toetsen loslaten
window.addEventListener("keyup", (e) => {
  keyboard[e.code] = false;
  if (e.code === "Space" && blok.isChargingJump) {
    executeJump();
  }
});

// Update canvas grootte bij window resize
window.addEventListener("resize", resizeCanvas);

// Start game loop en muziek
requestAnimationFrame(spelLus);
audioManager.playTrackForLevel(1);
