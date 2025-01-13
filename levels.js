import { config } from "./config.js";

const MIN_HEIGHT = 716;
const FLOOR_HEIGHT = MIN_HEIGHT - 65;
const MAX_RIGHT = 959;
const MAX_LEFT = 0;
const MAX_HEIGHT = 0;

const LEVEL_DATA = {
  level1: {
    ground: { y: FLOOR_HEIGHT, height: 65 },
    platforms: [
      { x: MAX_LEFT, y: FLOOR_HEIGHT - 285, width: 255, height: 285 },
      { x: MAX_RIGHT - 255, y: FLOOR_HEIGHT - 285, width: 255, height: 285 },
      { x: MAX_RIGHT - 592, y: FLOOR_HEIGHT - 575, width: 225, height: 100 },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT - 285 },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT - 285 },
    ],
  },
  level2: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 590, y: MIN_HEIGHT - 130, width: 195, height: 70 },
      { x: 510, y: MIN_HEIGHT - 320, width: 150, height: 70 },
      { x: 814, y: MIN_HEIGHT - 320, width: 130, height: 70 },
      { x: 235, y: MIN_HEIGHT - 515, width: 150, height: 135 },
      { x: 15, y: MIN_HEIGHT - 560, width: 145, height: 185 },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT },
    ],
  },
  level3: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 415, y: MIN_HEIGHT - 112, width: 97, height: 33 },
      { x: 640, y: MIN_HEIGHT - 112, width: 113, height: 33 },
      { x: MAX_RIGHT - 112, y: MIN_HEIGHT - 207, width: 97, height: 33 },
      { x: 360, y: MIN_HEIGHT - 273, width: 315, height: 65 },
      { x: 577, y: MIN_HEIGHT - 305, width: 98, height: 80 },
      { x: 318, y: MIN_HEIGHT - 478, width: 115, height: 90 },
      { x: MAX_LEFT + 15, y: MIN_HEIGHT - 525, width: 112, height: 33 },
      { x: MAX_LEFT + 273, y: MIN_HEIGHT - 716, width: 142, height: 33 },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT },
    ],
  },
  level4: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 270, y: MIN_HEIGHT - 77, width: 144, height: 113 },
      { x: 270, y: MIN_HEIGHT - 285, width: 140, height: 30 },
      { x: 15, y: MIN_HEIGHT - 285, width: 110, height: 30 },
      { x: 592, y: MIN_HEIGHT - 395, width: 94, height: 140 },
      { x: 270, y: MIN_HEIGHT - 542, width: 76, height: 157 },
      { x: 270, y: MAX_HEIGHT, width: 31, height: 175 },
      { x: 654, y: MIN_HEIGHT - 573, width: 32, height: 179 },
      { x: 654, y: MIN_HEIGHT - 573, width: 142, height: 32 },
      { x: 654, y: MAX_HEIGHT, width: 32, height: 31 },
      { x: MAX_RIGHT - 95, y: MIN_HEIGHT - 450, width: 80, height: 32 },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT },
    ],
  },
  level5: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 654, y: MIN_HEIGHT - 94, width: 32, height: 94 },
      { x: 654, y: MIN_HEIGHT - 94, width: 78, height: 32 },

      { x: 654, y: MIN_HEIGHT - 240, width: 78, height: 32 },
      { x: 270, y: MIN_HEIGHT - 94, width: 31, height: 94 },

      { x: 223, y: MIN_HEIGHT - 94, width: 78, height: 32 },
      { x: MAX_LEFT + 15, y: MIN_HEIGHT - 240, width: 68, height: 32 },
      { x: MAX_RIGHT - 74, y: MIN_HEIGHT - 400, width: 60, height: 50 },

      { x: 577, y: MIN_HEIGHT - 540, width: 60, height: 31 },
      { x: 450, y: MIN_HEIGHT - 575, width: 60, height: 31 },
      { x: 323, y: MIN_HEIGHT - 605, width: 60, height: 31 },

      { x: 80, y: MIN_HEIGHT - 540, width: 60, height: 31 },

      { x: 304, y: MAX_HEIGHT, width: 350, height: 31 },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT },
    ],
  },
  level6: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 304, y: MIN_HEIGHT - 62, width: 350, height: 62 },

      { x: MAX_RIGHT - 380, y: MIN_HEIGHT - 558, width: 366, height: 350 },
      { x: MAX_RIGHT - 305, y: MAX_HEIGHT, width: 195, height: 77 },
      { x: MAX_RIGHT - 380, y: MAX_HEIGHT, width: 195, height: 47 },

      { x: MAX_RIGHT - 700, y: MIN_HEIGHT - 238, width: 90, height: 30 },
      { x: MAX_LEFT, y: MIN_HEIGHT - 350, width: 110, height: 30 },
      { x: MAX_LEFT + 15, y: MAX_HEIGHT, width: 368, height: 30 },
      { x: 273, y: MAX_HEIGHT, width: 110, height: 110 },

      { x: MAX_RIGHT - 800, y: MIN_HEIGHT - 492, width: 225, height: 32 },
      { x: MAX_RIGHT - 800, y: MIN_HEIGHT - 573, width: 30, height: 82 },
      { x: MAX_RIGHT - 845, y: MIN_HEIGHT - 573, width: 50, height: 30 },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT },
    ],
  },
  level7: {
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: 304, y: MIN_HEIGHT - 62, width: 350, height: 62 },
      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT },
    ],
    triangles: [
      {
        x1: 100,
        y1: 300, // Start point
        x2: 300,
        y2: 400, // End point
        x3: 100,
        y3: 400, // Bottom point
        direction: "right", // Slides right
      },
      {
        x1: 800,
        y1: 400, // Start point
        x2: 600,
        y2: 500, // End point
        x3: 800,
        y3: 500, // Bottom point
        direction: "left", // Slides left
      },
    ],
  },

  level8: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT },
    ],
  },
};
export function getLevelData() {
  return LEVEL_DATA;
}
