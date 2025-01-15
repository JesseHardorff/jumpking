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
];

const gameState = {
  currentScreen: 6,
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
  // zwaartekracht: -0.0001,
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

  if (currentLevel.triangles) {
    for (const triangle of currentLevel.triangles) {
      const playerBottom = {
        x: nextX + blok.breedte / 2,
        y: nextY + blok.hoogte,
      };

      // Calculate slope based on direction
      let slope;
      if (triangle.direction === "right") {
        slope = (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1);
      } else {
        slope = (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1);
      }

      // Calculate expected Y position
      const expectedY = triangle.y1 + slope * (playerBottom.x - triangle.x1);

      // Check if we're within the triangle's x-bounds
      const inXBounds = nextX + blok.breedte >= triangle.x1 && nextX <= triangle.x2;

      if (inXBounds && Math.abs(playerBottom.y - expectedY) < 10) {
        nextY = expectedY - blok.hoogte;
        const directionMultiplier = triangle.direction === "right" ? 1 : -1;
        blok.snelheidX += 0.1 * directionMultiplier;
        blok.snelheidX = Math.max(-3, Math.min(blok.snelheidX, 3));
        blok.snelheidY = Math.abs(slope * blok.snelheidX);
        blok.opGrond = true;
        return { x: nextX, y: nextY };
      }
    }
  }

  // If we just left the triangle, apply stored momentum
  if (blok.lastTriangleSpeedX) {
    blok.snelheidX = blok.lastTriangleSpeedX;
    blok.snelheidY = blok.lastTriangleSpeedY;
    blok.lastTriangleSpeedX = null;
    blok.lastTriangleSpeedY = null;
  }

  // Regular platform collisions
  for (const platform of currentLevel.platforms) {
    if (nextX + blok.breedte > platform.x && nextX < platform.x + platform.width) {
      if (blok.y + blok.hoogte <= platform.y && nextY + blok.hoogte > platform.y) {
        nextY = platform.y - blok.hoogte;
        blok.snelheidY = 0;
        blok.snelheidX = 0;
        blok.opGrond = true; // Only set opGrond true for actual platforms
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
    }
  }

  return { x: nextX, y: nextY };
}
function calculateTriangleY(x, triangle) {
  // Calculate Y position on triangle surface based on X position
  const slope = (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1);
  return triangle.y1 + slope * (x - triangle.x1);
}

function isPointInTriangle(p, p1, p2, p3) {
  const area = 0.5 * (-p2.y * p3.x + p1.y * (-p2.x + p3.x) + p1.x * (p2.y - p3.y) + p2.x * p3.y);
  const s = (1 / (2 * area)) * (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * p.x + (p1.x - p3.x) * p.y);
  const t = (1 / (2 * area)) * (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * p.x + (p2.x - p1.x) * p.y);
  return s > 0 && t > 0 && 1 - s - t > 0;
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
  // First check if we're on a triangle before anything else
  const isOnTriangle = checkTriangleCollision(blok.x, blok.y);

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
    blok.snelheidX = 0;
    blok.snelheidY = 0;
    blok.opGrond = true;
    return;
  }

  if (isOnTriangle) {
    keyboard.ArrowLeft = false;
    keyboard.ArrowRight = false;
    keyboard.Space = false;
    blok.isChargingJump = false;
    blok.isWalking = false;

    const currentLevel = levels[gameState.currentScreen];
    const triangle = currentLevel.triangles[0];
    const slope = (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1);
    blok.snelheidX += slope * 0.1;
    blok.snelheidX = Math.max(-3, Math.min(blok.snelheidX, 3));
  }

  updateJumpCharge();

  if (!blok.opGrond) {
    if (blok.snelheidY > 0) {
      blok.fallDistance += blok.snelheidY;
    }
  } else {
    if (blok.fallDistance > blok.fallThreshold) {
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

  if (blok.opGrond) {
    let isOnPlatform = false;
    const currentLevel = levels[gameState.currentScreen];

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

  if (!blok.opGrond) {
    blok.snelheidY += blok.zwaartekracht;
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
  }
  if (nextY > TARGET_HEIGHT && gameState.currentScreen > 0) {
    gameState.screenTransition.active = true;
    gameState.screenTransition.targetOffset = -TARGET_HEIGHT;
    nextY = nextY - TARGET_HEIGHT;
    gameState.currentScreen--;
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

function checkTriangleCollision(playerX, playerY) {
  const currentLevel = levels[gameState.currentScreen];
  if (!currentLevel.triangles) return false;

  const bottomLeft = {
    x: playerX,
    y: playerY + blok.hoogte,
  };

  const bottomRight = {
    x: playerX + blok.breedte,
    y: playerY + blok.hoogte,
  };

  for (const triangle of currentLevel.triangles) {
    // For left triangles, we need to use x2->x1 and y2->y1
    const slope =
      triangle.direction === "right"
        ? (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1)
        : (triangle.y2 - triangle.y1) / (triangle.x2 - triangle.x1);

    // Use different reference points for left triangles
    const refX = triangle.direction === "right" ? triangle.x1 : triangle.x2;
    const refY = triangle.direction === "right" ? triangle.y1 : triangle.y2;

    const expectedLeftY = refY + slope * (bottomLeft.x - refX);
    const expectedRightY = refY + slope * (bottomRight.x - refX);

    const inXBounds =
      triangle.direction === "right"
        ? bottomLeft.x >= triangle.x1 && bottomRight.x <= triangle.x2
        : bottomLeft.x >= triangle.x1 && bottomRight.x <= triangle.x2;

    const leftOnSurface = Math.abs(bottomLeft.y - expectedLeftY) < 10;
    const rightOnSurface = Math.abs(bottomRight.y - expectedRightY) < 10;

    if (inXBounds && (leftOnSurface || rightOnSurface)) {
      blok.opGrond = true;
      return true;
    }
  }
  return false;
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
