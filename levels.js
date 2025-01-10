import { config } from "./config.js";

const TARGET_HEIGHT = 716;
const FLOOR_HEIGHT = TARGET_HEIGHT - 65;
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

      { x: MAX_LEFT, y: 0, width: 15, height: TARGET_HEIGHT - 285 },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: TARGET_HEIGHT - 285 },
    ],
  },
  level2: {
    ground: { y: TARGET_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 590, y: TARGET_HEIGHT - 130, width: 195, height: 70 },
      { x: 510, y: TARGET_HEIGHT - 320, width: 150, height: 70 },
      { x: 814, y: TARGET_HEIGHT - 320, width: 130, height: 70 },
      { x: 235, y: TARGET_HEIGHT - 515, width: 150, height: 135 },
      { x: 15, y: TARGET_HEIGHT - 560, width: 145, height: 185 },

      { x: MAX_LEFT, y: 0, width: 15, height: TARGET_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: TARGET_HEIGHT },
    ],
  },
  level3: {
    ground: { y: TARGET_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 415, y: TARGET_HEIGHT - 112, width: 97, height: 33 },
      { x: 640, y: TARGET_HEIGHT - 112, width: 113, height: 33 },
      { x: MAX_RIGHT - 112, y: TARGET_HEIGHT - 207, width: 97, height: 33 },
      { x: 360, y: TARGET_HEIGHT - 273, width: 315, height: 65 },
      { x: 577, y: TARGET_HEIGHT - 305, width: 98, height: 80 },
      { x: 318, y: TARGET_HEIGHT - 478, width: 115, height: 90 },
      { x: MAX_LEFT + 15, y: TARGET_HEIGHT - 525, width: 112, height: 33 },
      { x: MAX_LEFT + 273, y: TARGET_HEIGHT - 716, width: 142, height: 33 },

      { x: MAX_LEFT, y: 0, width: 15, height: TARGET_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: TARGET_HEIGHT },
    ],
  },
  level4: {
    ground: { y: TARGET_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 270, y: TARGET_HEIGHT - 77, width: 144, height: 113 },
      { x: 270, y: TARGET_HEIGHT - 285, width: 140, height: 30 },
      { x: 15, y: TARGET_HEIGHT - 285, width: 110, height: 30 },
      { x: 592, y: TARGET_HEIGHT - 395, width: 94, height: 140 },
      { x: 270, y: TARGET_HEIGHT - 542, width: 76, height: 157 },
      { x: 270, y: MAX_HEIGHT, width: 31, height: 175 },
      { x: 654, y: TARGET_HEIGHT - 573, width: 32, height: 179 },
      { x: 654, y: TARGET_HEIGHT - 573, width: 142, height: 32 },
      { x: 654, y: MAX_HEIGHT, width: 32, height: 31 },
      { x: MAX_RIGHT - 95, y: TARGET_HEIGHT - 450, width: 80, height: 32 },

      { x: MAX_LEFT, y: 0, width: 15, height: TARGET_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: TARGET_HEIGHT },
    ],
  },
  level5: {
    ground: { y: TARGET_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 654, y: TARGET_HEIGHT - 573, width: 32, height: 179 },
      { x: 270, y: MAX_HEIGHT, width: 31, height: 175 },

      { x: MAX_LEFT, y: 0, width: 15, height: TARGET_HEIGHT },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: TARGET_HEIGHT },
    ],
  },
};
export function getLevelData() {
  return LEVEL_DATA;
}
