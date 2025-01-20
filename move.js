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

import { getLevelData } from "./levels.js";
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
  currentScreen: 14,
  adminMode: false,
  screenTransition: {
    active: false,
    offset: 0,
    targetOffset: 0,
  },
};

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
  zwaartekracht: 0.1,
  //zwaartekracht: -0.0001,
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
};
const audioManager = {
  cricket: new Audio("cricket.mp3"),
  riool: new Audio("riool.mp3"),
  episch: new Audio("episch.mp3"),
  sunrise: new Audio("sunrise.mp3"),
  wind: new Audio("wind.mp3"),
  currentTrack: null,

  getTrackForLevel(levelNum) {
    if (levelNum === 15) {
      return this.sunrise;
    } else if (levelNum <= 6) {
      return this.cricket;
    } else if (levelNum <= 10) {
      return this.riool;
    } else {
      return this.episch;
    }
  },

  playTrackForLevel(levelNum) {
    const newTrack = this.getTrackForLevel(levelNum);

    if (this.currentTrack !== newTrack) {
      if (this.currentTrack) {
        this.currentTrack.pause();
        this.currentTrack.currentTime = 0;
      }

      this.currentTrack = newTrack;

      if (levelNum === 15) {
        this.currentTrack.loop = false;
        this.currentTrack.addEventListener(
          "ended",
          () => {
            this.currentTrack = this.wind;
            this.wind.loop = true;
            this.wind.play();
          },
          { once: true }
        );
      } else {
        this.currentTrack.loop = true;
      }

      this.currentTrack.play();
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
};
function checkPlatformCollisions(nextX, nextY) {
  const currentLevel = levels[gameState.currentScreen];

  // In checkPlatformCollisions function, update the triangle collision check:
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

      const expectedY = triangle.y1 + slope * (playerBottom.x - triangle.x1);

      // Increase collision threshold based on vertical speed
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
    if (nextX + blok.breedte > platform.x && nextX < platform.x + platform.width) {
      if (blok.y + blok.hoogte <= platform.y && nextY + blok.hoogte > platform.y) {
        nextY = platform.y - blok.hoogte;
        blok.snelheidY = 0;
        blok.snelheidX = 0;
        blok.opGrond = true;
        return { x: nextX, y: nextY };
      }

      if (blok.y >= platform.y + platform.height && nextY < platform.y + platform.height) {
        nextY = platform.y + platform.height;
        blok.snelheidY = 0;
        blok.snelheidX *= 0.5;
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

function updateJumpCharge() {
  if (blok.isChargingJump) {
    blok.jumpChargeTime += 16;
    let chargeProgress = Math.min(blok.jumpChargeTime / blok.maxChargeTime, 1);
    blok.springKracht = blok.minJumpForce + (blok.maxJumpForce - blok.minJumpForce) * chargeProgress;

    if (chargeProgress >= 1) {
      executeJump();
    }
  }
}

function executeJump() {
  if (blok.springKracht > 0) {
    let jumpPower = blok.springKracht * 1.3;
    let chargeProgress = blok.jumpChargeTime / blok.maxChargeTime;

    blok.snelheidY = -jumpPower;

    let horizontalPower =
      blok.minHorizontalForce + (blok.maxHorizontalForce - blok.minHorizontalForce) * chargeProgress;

    if (keyboard.ArrowLeft) {
      blok.snelheidX = -horizontalPower;
    } else if (keyboard.ArrowRight) {
      blok.snelheidX = horizontalPower;
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
  blok.snelheidX *= -blok.bounceStrength;
  blok.springKracht *= blok.bounceStrength;
  blok.snelheidY *= 0.98;
}

function spelLus() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scaleX = canvas.width / TARGET_WIDTH;
  const scaleY = canvas.height / TARGET_HEIGHT;
  ctx.scale(scaleX, scaleY);

  drawScreen(gameState.currentScreen, 0);
  ctx.fillStyle = blok.kleur;
  ctx.fillRect(blok.x, blok.y, blok.breedte, blok.hoogte);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  updateBlok();
  requestAnimationFrame(spelLus);
}
function updateBlok() {
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

  if (isOnTriangle) {
    keyboard.ArrowLeft = false;
    keyboard.ArrowRight = false;
    keyboard.Space = false;
    blok.isChargingJump = false;
    blok.isWalking = false;

    // Get the current triangle
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

  updateJumpCharge();

  if (!blok.opGrond) {
    if (blok.snelheidY > 0) {
      blok.fallDistance += blok.snelheidY;
    }
    blok.snelheidY += blok.zwaartekracht;
  } else {
    // Only stun if landing on a platform, not on triangles
    if (blok.fallDistance > blok.fallThreshold && !isOnTriangle) {
      blok.isStunned = true;
      blok.stunTimer = Date.now();
    }
    blok.fallDistance = 0;
  }

  if (blok.isStunned) {
    blok.kleur = blok.stunnedColor;
    if (Date.now() - blok.stunTimer >= blok.stunDuration) {
      blok.isStunned = false;
      blok.kleur = blok.normalColor;
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
    }
    if (keyboard.ArrowRight) {
      nextPosition = blok.x + blok.walkSpeed;
      blok.jumpDirection = 1;
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

  blok.x = nextX;
  blok.y = nextY;
}

function drawScreen(screenIndex, offset) {
  const level = levels[screenIndex];
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, level.ground.y - offset, TARGET_WIDTH, level.ground.height);

  ctx.fillStyle = "#666666";
  for (const platform of level.platforms) {
    ctx.fillRect(platform.x, platform.y - offset, platform.width, platform.height);
  }

  if (level.triangles) {
    ctx.fillStyle = "#888888";
    for (const triangle of level.triangles) {
      ctx.beginPath();
      ctx.moveTo(triangle.x1, triangle.y1);
      ctx.lineTo(triangle.x2, triangle.y2);
      ctx.lineTo(triangle.x3, triangle.y3);
      ctx.closePath();
      ctx.fill();
    }
  }
  // Draw detection points
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(blok.x, blok.y + blok.hoogte, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(blok.x + blok.breedte, blok.y + blok.hoogte, 3, 0, Math.PI * 2);
  ctx.fill();
}

window.addEventListener("keydown", (e) => {
  keyboard[e.code] = true;

  if (e.code === "KeyP") {
    gameState.adminMode = !gameState.adminMode;
    blok.snelheidX = 0;
    blok.snelheidY = 0;
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

window.addEventListener("keyup", (e) => {
  keyboard[e.code] = false;
  if (e.code === "Space" && blok.isChargingJump) {
    executeJump();
  }
});

window.addEventListener("resize", resizeCanvas);

requestAnimationFrame(spelLus);
audioManager.playTrackForLevel(1);
