// Basis spelscherm afmetingen voor perfecte ratio
const TARGET_WIDTH = 959; // Vaste breedte van het spelgebied
const TARGET_HEIGHT = 716; // Vaste hoogte van het spelgebied
const canvas = document.getElementById("gameCanvas"); // Haalt het canvas element op
const ctx = canvas.getContext("2d"); // Context nodig voor tekenen

// Functie om canvas grootte aan te passen aan schermgrootte met behoud van ratio
function resizeCanvas() {
  const container = canvas.parentElement;
  // Berekent de verhoudingen van container en gewenste spelgrootte
  const containerAspect = container.clientWidth / container.clientHeight;
  const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;

  // Past canvas aan zodat het altijd in het scherm past met juiste ratio
  if (containerAspect > targetAspect) {
    canvas.height = container.clientHeight;
    canvas.width = container.clientHeight * targetAspect;
  } else {
    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth / targetAspect;
  }
}

resizeCanvas();

// Spel constanten
const GROUND_HEIGHT = 65; // Hoogte van de grond
const GROUND_COLOR = "#4a4a4a"; // Kleur van de grond

// Importeer en setup levels
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

// Spelstatus object
const gameState = {
  currentScreen: 0,
  adminMode: false, // Add this line
  screenTransition: {
    active: false,
    offset: 0,
    targetOffset: 0,
  },
};

// Speler object met alle eigenschappen
const blok = {
  x: TARGET_WIDTH / 2 - 25, // Start positie horizontaal (midden)
  y: TARGET_HEIGHT - GROUND_HEIGHT - 50, // Start positie verticaal
  breedte: 40, // Breedte van speler
  hoogte: 50, // Hoogte van speler
  kleur: "red", // Kleur van speler
  normalColor: "red", // Add this line
  stunnedColor: "purple",
  fallDistance: 0,
  fallThreshold: 400, // You can adjust this value - lower number = shorter fall needed to stun
  isStunned: false,
  stunTimer: 0,
  stunDuration: 800,
  snelheidX: 0, // Horizontale bewegingssnelheid
  snelheidY: 0, // Verticale bewegingssnelheid
  zwaartekracht: 0.1, // Zwaartekracht
  //zwaartekracht: -0.0001, // Valsnelheid
  springKracht: 0, // Huidige springkracht
  minJumpForce: 0.7,
  maxJumpForce: 6.17,
  minHorizontalForce: 2.7, // Add this new minimum horizontal force
  maxHorizontalForce: 3.0, // Add this maximum horizontal force
  jumpChargeTime: 0, // Tijd dat spring wordt opgeladen
  maxChargeTime: 1500, // Maximale oplaadtijd voor sprong
  isChargingJump: false, // Of speler aan het opladen is
  opGrond: true, // Of speler op de grond staat
  jumpDirection: 0, // Springrichting (-1 links, 1 rechts)
  bounceStrength: 0.47, // Stuiter sterkte tegen muren
  walkSpeed: 1.2, // Loop snelheid
  isWalking: false, // Of speler loopt
  isOnSlide: false,
  slideSpeed: 0,
  maxSlideSpeed: 3,
  slideAcceleration: 0.1,
};

// Toetsenbord status
const keyboard = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
  ArrowUp: false, // Add these new controls
  ArrowDown: false,
  KeyP: false,
};

// Controleert en handelt platform botsingen af
// Update de botsing met de ramp om de snelheid te reguleren
function checkPlatformCollisions(nextX, nextY) {
  const currentLevel = levels[gameState.currentScreen];

  for (const platform of currentLevel.platforms) {
    // Verticale botsingsdetectie (landen en plafond)
    if (nextX + blok.breedte > platform.x && nextX < platform.x + platform.width) {
      // Landing op platform
      if (blok.y + blok.hoogte <= platform.y && nextY + blok.hoogte > platform.y) {
        nextY = platform.y - blok.hoogte;
        blok.snelheidY = 0;
        blok.snelheidX = 0;
        blok.opGrond = true;
        return { x: nextX, y: nextY };
      }

      // Stoten tegen plafond
      if (blok.y >= platform.y + platform.height && nextY < platform.y + platform.height) {
        nextY = platform.y + platform.height;
        blok.snelheidY = 0;
        blok.snelheidX *= 0.5;
        return { x: nextX, y: nextY };
      }
    }

    // Horizontale botsingsdetectie (muren)
    if (nextY + blok.hoogte > platform.y && nextY < platform.y + platform.height) {
      // Linker muur botsing
      if (blok.x + blok.breedte <= platform.x + 2 && nextX + blok.breedte > platform.x) {
        nextX = platform.x - blok.breedte;
        handleWallCollision(true);
      }
      // Rechter muur botsing
      if (blok.x >= platform.x + platform.width - 2 && nextX < platform.x + platform.width) {
        nextX = platform.x + platform.width;
        handleWallCollision(false);
      }
    }
  }

  if (currentLevel.slides) {
    let onAnySlide = false;
    for (const slide of currentLevel.slides) {
      const p1 = { x: slide.x, y: slide.y };
      const p2 = { x: slide.x + slide.width, y: slide.y + slide.height };
      const p3 = { x: slide.x, y: slide.y + slide.height };

      const playerBottom = { x: nextX + blok.breedte / 2, y: nextY + blok.hoogte };

      if (
        isPointInTriangle(
          playerBottom,
          { x: p1.x - 20, y: p1.y - 20 },
          { x: p2.x + 20, y: p2.y - 20 },
          { x: p3.x - 20, y: p3.y + 20 }
        )
      ) {
        onAnySlide = true;
        console.log("Collision check: On slide");
        keyboard.ArrowLeft = false;
        keyboard.ArrowRight = false;
        keyboard.Space = false;
        blok.isWalking = false;

        const slope = slide.height / slide.width;
        const angle = Math.atan(slope);

        // Enhanced momentum preservation for upward movement
        if (Math.abs(blok.snelheidY) > 2.0) {
          blok.snelheidX = Math.abs(blok.snelheidY) * Math.cos(angle) * 1.2; // Increased multiplier
          if (blok.snelheidY < 0) {
            blok.snelheidX *= -1.2; // Extra boost for upward movement
          }
        } else if (Math.abs(blok.snelheidX) < 1.0) {
          blok.snelheidX = 1.0;
        }

        const relativeX = nextX - slide.x;
        const targetY = slide.y + relativeX * slope - blok.hoogte;

        nextY += (targetY - nextY) * 0.15; // Smoother transition

        const gravityEffect = blok.zwaartekracht * Math.sin(angle) * 0.6; // Reduced gravity effect

        blok.snelheidX += gravityEffect;
        blok.snelheidX = Math.max(-3.0, Math.min(blok.snelheidX, 3.0)); // Increased speed limits
        blok.snelheidY = slope * blok.snelheidX;

        blok.opGrond = true;
        blok.isOnSlide = true;
        return { x: nextX, y: nextY };
      }
    }
    if (!onAnySlide) {
      blok.isOnSlide = false;
    }
  }

  return { x: nextX, y: nextY };
}
function isPlayerOnSlide() {
  const currentLevel = levels[gameState.currentScreen];
  if (!currentLevel.slides) return false;

  const playerBottom = { x: blok.x + blok.breedte / 2, y: blok.y + blok.hoogte };

  for (const slide of currentLevel.slides) {
    const p1 = { x: slide.x, y: slide.y };
    const p2 = { x: slide.x + slide.width, y: slide.y + slide.height };
    const p3 = { x: slide.x, y: slide.y + slide.height };

    if (isPointInTriangle(playerBottom, p1, p2, p3)) {
      console.log("Position check: ", {
        playerX: playerBottom.x,
        playerY: playerBottom.y,
        slideTop: p1.y,
        slideBottom: p3.y,
      });
      return true;
    }
  }
  return false;
}

function isPointInTriangle(p, p1, p2, p3) {
  const area = 0.5 * (-p2.y * p3.x + p1.y * (-p2.x + p3.x) + p1.x * (p2.y - p3.y) + p2.x * p3.y);
  const s = (1 / (2 * area)) * (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * p.x + (p1.x - p3.x) * p.y);
  const t = (1 / (2 * area)) * (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * p.x + (p2.x - p1.x) * p.y);
  return s > 0 && t > 0 && 1 - s - t > 0;
}

// Update de springkracht tijdens opladen
function updateJumpCharge() {
  if (blok.isChargingJump) {
    blok.jumpChargeTime += 16; // Verhoog oplaadtijd (60fps)
    // Bereken voortgang (0-1)
    let chargeProgress = Math.min(blok.jumpChargeTime / blok.maxChargeTime, 1);
    // Bereken springkracht op basis van voortgang
    blok.springKracht = blok.minJumpForce + (blok.maxJumpForce - blok.minJumpForce) * chargeProgress;

    if (chargeProgress >= 1) {
      executeJump(); // Voer sprong uit bij maximaal opladen
    }
  }
}

function executeJump() {
  if (blok.springKracht > 0) {
    let jumpPower = blok.springKracht * 1.3;
    let chargeProgress = blok.jumpChargeTime / blok.maxChargeTime;

    // Vertical jump power
    blok.snelheidY = -jumpPower;

    // Horizontal speed starts at minimum and increases with charge
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

// Handel muurbotsingen af
function handleWallCollision(isLeftWall) {
  blok.snelheidX *= -blok.bounceStrength; // Keer richting om met verminderde snelheid
  blok.springKracht *= blok.bounceStrength; // Verminder springkracht
  blok.snelheidY *= 0.98;
}
// let frameCount = 0;
// let lastTime = performance.now();
// Hoofdspellus
function spelLus() {
  // Add this inside the spelLus function, right before requestAnimationFrame:
  // frameCount++;
  // const currentTime = performance.now();
  // if (currentTime - lastTime >= 1000) {
  //   console.log(`FPS: ${frameCount}`);
  //   frameCount = 0;
  //   lastTime = currentTime;
  // }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scaleX = canvas.width / TARGET_WIDTH;
  const scaleY = canvas.height / TARGET_HEIGHT;
  ctx.scale(scaleX, scaleY);

  // Add this line to continuously check slide state
  if (isPlayerOnSlide()) {
    console.log("On slide - continuous check");
  }

  drawScreen(gameState.currentScreen, 0);
  ctx.fillStyle = blok.kleur;
  ctx.fillRect(blok.x, blok.y, blok.breedte, blok.hoogte);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  updateBlok();
  requestAnimationFrame(spelLus);
}
// Update alle beweging en physics van de speler
function updateBlok() {
  if (gameState.adminMode) {
    const flySpeed = 5;
    if (keyboard.ArrowLeft) blok.x -= flySpeed;
    if (keyboard.ArrowRight) blok.x += flySpeed;
    if (keyboard.ArrowUp) {
      blok.y -= flySpeed;
      // Level transition when flying up
      if (blok.y + blok.hoogte < 0 && gameState.currentScreen < levels.length - 1) {
        blok.y = TARGET_HEIGHT + blok.y;
        gameState.currentScreen++;
      }
    }
    if (keyboard.ArrowDown) {
      blok.y += flySpeed;
      // Level transition when flying down
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

  updateJumpCharge();

  // Track falling and handle stun
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

  // Check stun recovery
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

  // Horizontale beweging op de grond

  // Horizontale beweging op de grond
  // Horizontale beweging op de grond
  if (blok.opGrond && !blok.isChargingJump) {
    // Skip all walking logic if on slide
    if (!isPlayerOnSlide()) {
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
  }

  // Check of speler nog op platform/grond staat
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

    // Check of speler op de grond staat
    const isOnGround =
      gameState.currentScreen === 0 && Math.abs(blok.y + blok.hoogte - (TARGET_HEIGHT - GROUND_HEIGHT)) < 2;

    // Val als speler niet op platform/grond staat
    if (!isOnPlatform && !isOnGround) {
      blok.opGrond = false;
      blok.snelheidY = 0.1;
      if (keyboard.ArrowLeft) {
        blok.snelheidX = -1.33;
      } else if (keyboard.ArrowRight) {
        blok.snelheidX = 1.33;
      }
    }
  }

  // Pas zwaartekracht toe als speler in de lucht is
  if (!blok.opGrond) {
    blok.snelheidY += blok.zwaartekracht;
  }

  // Bereken nieuwe positie
  let nextX = blok.x + blok.snelheidX;
  let nextY = blok.y + blok.snelheidY;

  // Check en handel botsingen af
  const collision = checkPlatformCollisions(nextX, nextY);
  nextX = collision.x;
  nextY = collision.y;

  // Scherm grenzen
  if (nextX < 0) {
    nextX = 0;
    blok.snelheidX = 0;
  }
  if (nextX + blok.breedte > TARGET_WIDTH) {
    nextX = TARGET_WIDTH - blok.breedte;
    blok.snelheidX = 0;
  }

  // Level overgangen
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

  // Grond collision in eerste level
  if (gameState.currentScreen === 0 && nextY + blok.hoogte > TARGET_HEIGHT - GROUND_HEIGHT) {
    nextY = TARGET_HEIGHT - GROUND_HEIGHT - blok.hoogte;
    blok.snelheidY = 0;
    blok.snelheidX = 0;
    blok.opGrond = true;
  }

  // Update speler positie
  blok.x = nextX;
  blok.y = nextY;
}

// Toetsenbord event listeners
window.addEventListener("keydown", (e) => {
  keyboard[e.code] = true;

  // Toggle admin mode with P key
  if (e.code === "KeyP") {
    gameState.adminMode = !gameState.adminMode;
    blok.snelheidX = 0;
    blok.snelheidY = 0;
  }

  if (!gameState.adminMode) {
    if (!blok.opGrond || blok.isOnSlide) return;
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
function checkRampCollisions(nextX, nextY) {
  const currentLevel = levels[gameState.currentScreen];

  for (const ramp of currentLevel.ramps) {
    const p1 = { x: ramp.x, y: ramp.y };
    const p2 = { x: ramp.x + ramp.width, y: ramp.y + ramp.height };

    const angle = Math.atan(ramp.height / ramp.width);
    const speedAlongRamp = Math.sqrt(blok.snelheidX * blok.snelheidX + blok.snelheidY * blok.snelheidY);

    if (
      nextX + blok.breedte / 2 >= ramp.x &&
      nextX + blok.breedte / 2 <= ramp.x + ramp.width &&
      nextY + blok.hoogte > ramp.y &&
      nextY < ramp.y + ramp.height
    ) {
      const friction = 0.05;
      if (speedAlongRamp > 0.5) {
        blok.snelheidX -= Math.sign(blok.snelheidX) * friction;
        blok.snelheidY -= Math.sign(blok.snelheidY) * friction;
      }

      nextY = ramp.y + Math.tan(angle) * (nextX - ramp.x);

      blok.snelheidY = Math.sin(angle) * speedAlongRamp;
      blok.snelheidX = Math.cos(angle) * speedAlongRamp;

      // Zorg ervoor dat de snelheid niet te hoog wordt
      const maxRampSpeed = 1.5; // Pas deze waarde aan indien nodig
      blok.snelheidX = Math.max(-maxRampSpeed, Math.min(blok.snelheidX, maxRampSpeed));
      blok.snelheidY = Math.max(-maxRampSpeed, Math.min(blok.snelheidY, maxRampSpeed));

      if (Math.abs(blok.snelheidX) < 0.1 && Math.abs(blok.snelheidY) < 0.1) {
        blok.snelheidX = 0;
        blok.snelheidY = 0;
      }

      return { x: nextX, y: nextY };
    }
  }

  return { x: nextX, y: nextY };
}

// Teken het huidige level
function drawScreen(screenIndex, offset) {
  const level = levels[screenIndex];
  // Teken de grond
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, level.ground.y - offset, TARGET_WIDTH, level.ground.height);
  // Teken de platforms
  ctx.fillStyle = "#666666";
  for (const platform of level.platforms) {
    ctx.fillRect(platform.x, platform.y - offset, platform.width, platform.height);
  }
  if (level.slides) {
    ctx.fillStyle = "#888888";
    for (const slide of level.slides) {
      ctx.beginPath();
      ctx.moveTo(slide.x, slide.y);
      ctx.lineTo(slide.x + slide.width, slide.y + slide.height);
      ctx.lineTo(slide.x, slide.y + slide.height);
      ctx.closePath();
      ctx.fill();
    }
  }
  // Debug visualization
  // ctx.fillStyle = "yellow";
  // const playerBottom = { x: blok.x + blok.breedte / 2, y: blok.y + blok.hoogte };
  // ctx.beginPath();
  // ctx.arc(playerBottom.x, playerBottom.y, 3, 0, Math.PI * 2);
  // ctx.fill();
}

// Luister naar schermgrootte veranderingen
window.addEventListener("resize", resizeCanvas);

// Start de spellus
requestAnimationFrame(spelLus);
