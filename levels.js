import { config } from "./config.js";

const MIN_HEIGHT = 716;
const FLOOR_HEIGHT = MIN_HEIGHT - 65;
const MAX_RIGHT = 959;
const MAX_LEFT = 0;
const MAX_HEIGHT = 0;

const LEVEL_DATA = {
  level1: {
    backgroundColor: "#456441",
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
      { x: 270, y: MIN_HEIGHT - 79, width: 144, height: 113, color: "#1B4017" },
      { x: 270, y: MIN_HEIGHT - 285, width: 140, height: 30, color: "#3b3834" },
      { x: 15, y: MIN_HEIGHT - 285, width: 110, height: 30, color: "#16271C" },
      { x: 592, y: MIN_HEIGHT - 395, width: 94, height: 140, color: "#3b3834" },
      { x: 270, y: MIN_HEIGHT - 542, width: 76, height: 157, color: "#3b3834" },
      { x: 270, y: MAX_HEIGHT, width: 31, height: 175, color: "#3b3834" },
      { x: 654, y: MIN_HEIGHT - 573, width: 32, height: 179, color: "#3b3834" },
      { x: 654, y: MIN_HEIGHT - 573, width: 142, height: 32, color: "#3b3834" },
      { x: 654, y: MAX_HEIGHT, width: 32, height: 31, color: "#3b3834" },
      { x: MAX_RIGHT - 95, y: MIN_HEIGHT - 450, width: 80, height: 32, color: "#16271C" },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT, color: "#16271C" },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT, color: "#16271C" },
    ],
  },
  level5: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: 654, y: MIN_HEIGHT - 94, width: 32, height: 94, color: "#3b3834" },
      { x: 654, y: MIN_HEIGHT - 94, width: 78, height: 32, color: "#3b3834" },

      { x: 654, y: MIN_HEIGHT - 240, width: 78, height: 32, color: "#45191B" },
      { x: 270, y: MIN_HEIGHT - 94, width: 31, height: 94, color: "#3b3834" },

      { x: 223, y: MIN_HEIGHT - 94, width: 78, height: 32, color: "#3b3834" },
      { x: MAX_LEFT + 15, y: MIN_HEIGHT - 240, width: 68, height: 32, color: "#45191B" },
      { x: MAX_RIGHT - 74, y: MIN_HEIGHT - 400, width: 60, height: 50, color: "#45191B" },

      { x: 577, y: MIN_HEIGHT - 540, width: 60, height: 31, color: "#45191B" },
      { x: 450, y: MIN_HEIGHT - 575, width: 60, height: 31, color: "#45191B" },
      { x: 323, y: MIN_HEIGHT - 605, width: 60, height: 31, color: "#45191B" },

      { x: 80, y: MIN_HEIGHT - 540, width: 60, height: 31, color: "#45191B" },

      { x: 304, y: MAX_HEIGHT, width: 350, height: 31, color: "#45191B" },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT, color: "#45191B" },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT, color: "#45191B" },
    ],
  },
  level6: {
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: MAX_LEFT + 15, y: 0, width: 955, height: 508, color: "#101515", decorative: true },
      { x: MAX_LEFT + 365, y: 0, width: 220, height: 508, color: "#222B2C", decorative: true },

      { x: 304, y: MIN_HEIGHT - 62, width: 350, height: 62, color: "#45191B" },

      { x: MAX_RIGHT - 380, y: MIN_HEIGHT - 558, width: 366, height: 350, color: "#193C3A" },
      { x: MAX_RIGHT - 305, y: MAX_HEIGHT, width: 195, height: 77, color: "#193C3A" },
      { x: MAX_RIGHT - 380, y: MAX_HEIGHT, width: 195, height: 47, color: "#193C3A" },

      { x: MAX_RIGHT - 700, y: MIN_HEIGHT - 238, width: 90, height: 30, color: "#193C3A" },
      { x: MAX_LEFT, y: MIN_HEIGHT - 350, width: 110, height: 30, color: "#193C3A" },
      { x: MAX_LEFT + 15, y: MAX_HEIGHT, width: 368, height: 30, color: "#193C3A" },
      { x: 273, y: MAX_HEIGHT, width: 110, height: 110, color: "#193C3A" },

      { x: MAX_RIGHT - 800, y: MIN_HEIGHT - 492, width: 225, height: 32, color: "#193C3A" },
      { x: MAX_RIGHT - 800, y: MIN_HEIGHT - 573, width: 30, height: 82, color: "#193C3A" },
      { x: MAX_RIGHT - 845, y: MIN_HEIGHT - 573, width: 50, height: 30, color: "#193C3A" },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
    ],
  },
  level7: {
    backgroundColor: "#101515",
    triangleColor: "#3D283A",
    triangleOutlineWidth: 0.4,
    triangleOutlineColor: "#D3AECD",
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: MAX_LEFT + 365, y: 0, width: 220, height: 808, color: "#222B2C", decorative: true },
      { x: MAX_LEFT + 565, y: MAX_HEIGHT, width: 220, height: 230, color: "#222B2C", decorative: true },
      { x: MAX_LEFT + 165, y: 510, width: 220, height: 220, color: "#222B2C", decorative: true },

      { x: MAX_RIGHT - 220, y: MIN_HEIGHT - 30, width: 110, height: 30, color: "#193C3A" },
      { x: MAX_RIGHT - 220, y: MIN_HEIGHT - 301, width: 110, height: 30, color: "#193C3A" },
      { x: MAX_RIGHT - 380, y: MIN_HEIGHT - 301, width: 161, height: 301, color: "#193C3A" },

      { x: MAX_RIGHT - 190, y: MIN_HEIGHT - 495, width: 175, height: 47, color: "#193C3A" },
      { x: MAX_RIGHT - 190, y: MAX_HEIGHT, width: 175, height: 222, color: "#193C3A" },
      { x: MAX_RIGHT - 380, y: MIN_HEIGHT - 495, width: 191, height: 96, color: "#193C3A" },

      { x: MAX_LEFT + 305, y: MAX_HEIGHT + 315, width: 77, height: 70, color: "#193C3A" },
      { x: MAX_LEFT + 305, y: MAX_HEIGHT, width: 155, height: 316, color: "#193C3A" },
      { x: MAX_LEFT + 459, y: MAX_HEIGHT, width: 130, height: 35, color: "#193C3A" },

      { x: MAX_LEFT + 253, y: MAX_HEIGHT + 110, width: 53, height: 85, color: "#193C3A" },

      { x: MAX_LEFT + 15, y: MAX_HEIGHT, width: 160, height: 33, color: "#193C3A" },
      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 477, width: 190, height: 239, color: "#193C3A" },
      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 335, width: 50, height: 150, color: "#193C3A" },

      { x: MAX_LEFT + 375, y: MAX_HEIGHT + 480, width: 40, height: 32, color: "#193C3A" },
      { x: MAX_RIGHT - 685, y: MIN_HEIGHT - 237, width: 140, height: 3, color: "#193C3A" },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
    ],
    triangles: [
      {
        x1: 770,
        y1: MIN_HEIGHT - 655, // Start point
        x2: MAX_RIGHT - 380,
        y2: MIN_HEIGHT - 494, // End point
        x3: 770,
        y3: MIN_HEIGHT - 494, // Bottom point
        direction: "left",
      },
      {
        x1: 380,
        y1: MIN_HEIGHT - 130, // Start point
        x2: MAX_RIGHT - 685,
        y2: MIN_HEIGHT - 236, // End point
        x3: 380,
        y3: MIN_HEIGHT - 236, // Bottom point
        direction: "right",
      },
      {
        x1: 204,
        y1: MIN_HEIGHT - 185, // Start point
        x2: MAX_RIGHT - 580,
        y2: MIN_HEIGHT, // End point
        x3: 204,
        y3: MIN_HEIGHT, // Bottom point
        direction: "right",
      },
      {
        x1: 65,
        y1: MIN_HEIGHT - 360, // Start point
        x2: MAX_RIGHT - 753,
        y2: MIN_HEIGHT - 238, // End point
        x3: 65,
        y3: MIN_HEIGHT - 238, // Bottom point
        direction: "right",
      },
    ],
  },

  level8: {
    backgroundColor: "#101515",
    triangleColor: "#3D283A",
    triangleOutlineWidth: 0.4,
    triangleOutlineColor: "#D3AECD",
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: MAX_LEFT + 482, y: MAX_HEIGHT, width: 393, height: 830, color: "#222B2C", decorative: true },
      { x: MAX_LEFT + 410, y: MAX_HEIGHT, width: 393, height: 100, color: "#222B2C", decorative: true },

      { x: MAX_RIGHT - 92, y: MIN_HEIGHT - 270, width: 77, height: 270, color: "#193C3A" },
      { x: MAX_RIGHT - 190, y: MIN_HEIGHT - 77, width: 100, height: 77, color: "#193C3A" },

      { x: MAX_RIGHT - 655, y: MIN_HEIGHT - 238, width: 190, height: 238, color: "#193C3A" },
      { x: MAX_RIGHT - 555, y: MIN_HEIGHT - 82, width: 185, height: 82, color: "#193C3A" },

      { x: MAX_RIGHT - 92, y: MAX_HEIGHT, width: 77, height: 174, color: "#193C3A" },

      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 128, width: 50, height: 174, color: "#193C3A" },
      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 285, width: 480, height: 80, color: "#3D283A" },
      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 364, width: 130, height: 145, color: "#193C3A" },
      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 508, width: 30, height: 179, color: "#193C3A" },

      { x: MAX_LEFT + 175, y: MAX_HEIGHT, width: 240, height: 134, color: "#193C3A" },
      { x: MAX_LEFT + 175, y: MAX_HEIGHT + 100, width: 320, height: 84, color: "#193C3A" },

      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 686, width: 160, height: 30, color: "#193C3A" },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
    ],
    triangles: [
      {
        x1: 867,
        y1: MIN_HEIGHT - 155, // Start point
        x2: 768,
        y2: MIN_HEIGHT - 77, // End point
        x3: 867,
        y3: MIN_HEIGHT - 77, // Bottom point
        direction: "left",
      },
      {
        x1: 494,
        y1: MIN_HEIGHT - 155, // Start point
        x2: 590,
        y2: MIN_HEIGHT - 82, // End point
        x3: 494,
        y3: MIN_HEIGHT - 82, // Bottom point
        direction: "right",
      },
      {
        x1: 415,
        y1: MAX_HEIGHT + 50, // Start point
        x2: 495,
        y2: MAX_HEIGHT + 100, // End point
        x3: 415,
        y3: MAX_HEIGHT + 100, // Bottom point
        direction: "right",
      },
    ],
  },

  level9: {
    backgroundColor: "#101515",
    triangleColor: "#3D283A",
    triangleOutlineWidth: 0.4,
    triangleOutlineColor: "#D3AECD",
    ground: { y: MIN_HEIGHT + 100, height: 0 }, // Ground hidden below view
    platforms: [
      { x: MAX_LEFT + 420, y: MAX_HEIGHT, width: 525, height: 750, color: "#222B2C", decorative: true },

      { x: MAX_LEFT + 205, y: MAX_HEIGHT, width: 100, height: 200, color: "#222B2C", decorative: true },
      { x: MAX_LEFT + 255, y: MAX_HEIGHT + 100, width: 100, height: 400, color: "#222B2C", decorative: true },
      { x: MAX_LEFT + 255, y: MAX_HEIGHT + 300, width: 200, height: 400, color: "#222B2C", decorative: true },

      { x: MAX_LEFT + 15, y: MAX_HEIGHT, width: 190, height: 35, color: "#193C3A" },

      { x: MAX_LEFT + 305, y: MAX_HEIGHT, width: 140, height: 35, color: "#193C3A" },
      { x: MAX_LEFT + 415, y: MAX_HEIGHT, width: 30, height: 318, color: "#193C3A" },
      { x: MAX_LEFT + 415, y: MAX_HEIGHT + 192, width: 95, height: 126, color: "#193C3A" },
      { x: MAX_LEFT + 350, y: MAX_HEIGHT + 268, width: 80, height: 50, color: "#193C3A" },

      { x: MAX_LEFT + 785, y: MAX_HEIGHT, width: 160, height: 30, color: "#193C3A" },

      { x: MAX_LEFT + 785, y: MAX_HEIGHT + 192, width: 60, height: 60, color: "#193C3A" },

      { x: MAX_LEFT + 785, y: MAX_HEIGHT + 414, width: 62, height: 130, color: "rgba(0, 0, 0, 0)" },

      { x: MAX_LEFT + 594, y: MAX_HEIGHT + 414, width: 62, height: 130, color: "rgba(0, 0, 0, 0)" },

      { x: MAX_LEFT + 403, y: MAX_HEIGHT + 414, width: 62, height: 130, color: "rgba(0, 0, 0, 0)" },

      { x: MAX_LEFT + 175, y: MAX_HEIGHT + 175, width: 33, height: 250, color: "#193C3A" },
      { x: MAX_LEFT + 175, y: MAX_HEIGHT + 414, width: 94, height: 302, color: "#193C3A" },

      { x: MAX_LEFT + 15, y: MAX_HEIGHT + 335, width: 50, height: 46, color: "#3D283A" },

      { x: MAX_LEFT + 126, y: MAX_HEIGHT + 590, width: 50, height: 46, color: "#3D283A" },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
    ],
    triangles: [
      {
        x1: 268,
        y1: MIN_HEIGHT - 175, // Start point
        x2: 445,
        y2: MIN_HEIGHT, // End point
        x3: 268,
        y3: MIN_HEIGHT, // Bottom point
        direction: "right",
      },
      {
        x1: MAX_RIGHT - 15,
        y1: MIN_HEIGHT - 85, // Start point
        x2: MAX_RIGHT - 100,
        y2: MIN_HEIGHT, // End point
        x3: MAX_RIGHT - 15,
        y3: MIN_HEIGHT, // Bottom point
        direction: "left",
      },
    ],
  },
  level10: {
    backgroundColor: "#101515",
    triangleColor: "#3D283A",
    triangleOutlineWidth: 0.4,
    triangleOutlineColor: "#D3AECD",
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: MAX_LEFT + 110, y: MAX_HEIGHT + 580, width: 200, height: 400, color: "#222B2C", decorative: true },

      { x: MAX_LEFT + 440, y: MAX_HEIGHT + 480, width: 350, height: 400, color: "#222B2C", decorative: true },

      { x: MAX_RIGHT - 175, y: MIN_HEIGHT - 65, width: 200, height: 130, color: "#193C3A" },

      { x: MAX_RIGHT - 650, y: MIN_HEIGHT - 165, width: 135, height: 170, color: "#193C3A" },

      { x: MAX_LEFT, y: MIN_HEIGHT - 230, width: 110, height: 230, color: "#193C3A" },

      { x: MAX_LEFT + 15, y: MIN_HEIGHT - 70, width: 190, height: 70, color: "#193C3A" },

      { x: MAX_RIGHT - 800, y: MIN_HEIGHT - 390, width: 175, height: 60, color: "#193C3A" },

      { x: MAX_LEFT, y: MAX_HEIGHT, width: 334, height: 226, color: "#193C3A" },

      { x: MAX_LEFT + 594, y: MAX_HEIGHT + 214, width: 50, height: 130, color: "#193C3A" },

      { x: MAX_RIGHT - 189, y: MIN_HEIGHT - 690, width: 175, height: 340, color: "#193C3A" },

      { x: MAX_RIGHT - 334, y: MAX_HEIGHT, width: 60, height: 60, color: "#193C3A" },
      { x: MAX_RIGHT - 189, y: MAX_HEIGHT, width: 200, height: 60, color: "#193C3A" },

      { x: MAX_RIGHT - 800, y: MIN_HEIGHT - 630, width: 225, height: 60, color: "#193C3A" },

      { x: MAX_LEFT, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
      { x: MAX_RIGHT - 15, y: 0, width: 15, height: MIN_HEIGHT, color: "#193C3A" },
    ],
    triangles: [
      {
        x1: 110,
        y1: MIN_HEIGHT - 125, // Start point
        x2: 206,
        y2: MIN_HEIGHT - 70, // End   point
        x3: 110,
        y3: MIN_HEIGHT - 70, // Bottom point
        direction: "right",
      },
    ],
  },
  level11: {
    backgroundColor: "#101515",
    triangleColor: "#3D283A",
    triangleOutlineWidth: 0.4,
    triangleOutlineColor: "#D3AECD",
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: MAX_LEFT + 300, y: 0, width: 515, height: MIN_HEIGHT, color: "#202020", decorative: true },
      { x: MAX_LEFT + 224, y: 0, width: 515, height: 250, color: "#202020", decorative: true },

      { x: MAX_LEFT, y: MIN_HEIGHT - 60, width: 334, height: 60, color: "#193C3A" },
      { x: MAX_RIGHT - 189, y: MIN_HEIGHT - 60, width: 200, height: 60, color: "#193C3A" },
      { x: MAX_RIGHT - 334, y: MIN_HEIGHT - 60, width: 60, height: 60, color: "#193C3A" },

      { x: MAX_LEFT + 284, y: MIN_HEIGHT - 480, width: 50, height: 300, color: "#5c5c5c" },
      { x: MAX_LEFT + 333, y: MIN_HEIGHT - 300, width: 50, height: 50, color: "#5c5c5c" },

      { x: MAX_LEFT + 633, y: MIN_HEIGHT - 500, width: 40, height: 50, color: "#5c5c5c" },
      { x: MAX_LEFT + 563, y: MIN_HEIGHT - 660, width: 50, height: 20, color: "#5c5c5c" }, // { x: MAX_LEFT + 503, y: MIN_HEIGHT - 640, width: 50, height: 20 },
      { x: MAX_LEFT + 225, y: MAX_HEIGHT, width: 60, height: 86, color: "#5c5c5c" },

      { x: MAX_RIGHT - 189, y: MIN_HEIGHT - 580, width: 50, height: 300, color: "#5c5c5c" },

      { x: MAX_RIGHT - 189, y: MIN_HEIGHT - 880, width: 50, height: 200, color: "#5c5c5c" },
      { x: MAX_RIGHT - 210, y: MIN_HEIGHT - 580, width: 50, height: 20, color: "#5c5c5c" },
    ],
    triangles: [
      {
        x1: 0,
        y1: MIN_HEIGHT - 175, // Start point
        x2: 335,
        y2: MIN_HEIGHT - 60, // End   point
        x3: 0,
        y3: MIN_HEIGHT - 60, // Bottom point
        direction: "right",
      },
      {
        x1: MAX_RIGHT,
        y1: MIN_HEIGHT - 175, // Start point
        x2: 770,
        y2: MIN_HEIGHT - 60, // End   point
        x3: MAX_RIGHT,
        y3: MIN_HEIGHT - 60, // Bottom point
        direction: "left",
      },
    ],
  },
  level12: {
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: MAX_LEFT + 224, y: 0, width: 500, height: MIN_HEIGHT, color: "#202020", decorative: true },
      { x: MAX_LEFT + 180, y: 0, width: 500, height: 310, color: "#202020", decorative: true },
      { x: MAX_LEFT + 224, y: 300, width: 600, height: MIN_HEIGHT, color: "#202020", decorative: true },

      { x: MAX_LEFT + 224, y: MIN_HEIGHT - 120, width: 60, height: 300, color: "#787878" },
      { x: MAX_LEFT + 224, y: MIN_HEIGHT - 520, width: 30, height: 90, color: "#787878" },
      { x: MAX_LEFT + 224, y: MIN_HEIGHT - 520, width: 90, height: 30, color: "#787878" },
      { x: MAX_LEFT + 224, y: MAX_HEIGHT, width: 60, height: 60, color: "#787878" },

      { x: MAX_LEFT + 370, y: MIN_HEIGHT - 230, width: 20, height: 90, color: "#787878" },

      { x: MAX_LEFT + 700, y: MIN_HEIGHT - 130, width: 75, height: 30, color: "#787878" },

      { x: MAX_LEFT + 640, y: MIN_HEIGHT - 430, width: 60, height: 30, color: "#787878" },
      { x: MAX_RIGHT - 189, y: MIN_HEIGHT - 300, width: 50, height: 300, color: "#787878" },
      { x: MAX_RIGHT - 286, y: MAX_HEIGHT, width: 70, height: 300, color: "#787878" },
      { x: MAX_RIGHT - 300, y: MAX_HEIGHT, width: 140, height: 30, color: "#787878" },
      { x: MAX_RIGHT - 286, y: MAX_HEIGHT + 299, width: 147, height: 150, color: "#787878" },
    ],
    triangles: [],
  },
  level13: {
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: MAX_LEFT + 224, y: 0, width: 500, height: MIN_HEIGHT, color: "#202020", decorative: true },
      { x: MAX_LEFT + 180, y: 0, width: 500, height: 280, color: "#202020", decorative: true },

      { x: MAX_LEFT + 224, y: MIN_HEIGHT - 460, width: 60, height: 500, color: "#898989" },
      { x: MAX_LEFT + 204, y: MIN_HEIGHT - 460, width: 60, height: 30, color: "#898989" },
      { x: MAX_LEFT + 178, y: MAX_HEIGHT, width: 94, height: 30, color: "#898989" },
      { x: MAX_LEFT + 224, y: MAX_HEIGHT, width: 50, height: 110, color: "#898989" },
      { x: MAX_LEFT + 180, y: MAX_HEIGHT, width: 90, height: 30, color: "#898989" },

      { x: MAX_RIGHT - 460, y: MAX_HEIGHT + 240, width: 60, height: 30, color: "#898989" },

      { x: MAX_RIGHT - 530, y: MAX_HEIGHT + 500, width: 60, height: 30, color: "#898989" },

      { x: MAX_RIGHT - 286, y: MAX_HEIGHT, width: 70, height: 190, color: "#898989" },
      { x: MAX_RIGHT - 251, y: MAX_HEIGHT + 189, width: 35, height: 150, color: "#898989" },
      { x: MAX_RIGHT - 286, y: MAX_HEIGHT + 338, width: 70, height: 80, color: "#898989" },
      { x: MAX_RIGHT - 305, y: MAX_HEIGHT + 338, width: 85, height: 30, color: "#898989" },
      { x: MAX_RIGHT - 300, y: MIN_HEIGHT - 30, width: 140, height: 30, color: "#898989" },
    ],
    triangles: [],
  },
  level14: {
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: MAX_LEFT + 224, y: 0, width: 500, height: MIN_HEIGHT, color: "#202020", decorative: true },
      { x: MAX_LEFT + 190, y: MIN_HEIGHT - 200, width: 500, height: MIN_HEIGHT, color: "#202020", decorative: true },
      { x: MAX_LEFT + 224, y: MAX_HEIGHT, width: 60, height: 80, color: "#a0a0a0" },
      { x: MAX_LEFT + 180, y: MIN_HEIGHT - 30, width: 90, height: 30, color: "#a0a0a0" },
      { x: MAX_LEFT + 224, y: MAX_HEIGHT, width: 110, height: 30, color: "#a0a0a0" },

      { x: MAX_RIGHT - 495, y: MAX_HEIGHT + 590, width: 60, height: 30, color: "#a0a0a0" },

      { x: MAX_RIGHT - 495, y: MAX_HEIGHT + 350, width: 20, height: 80, color: "#a0a0a0" },

      { x: MAX_LEFT + 325, y: MAX_HEIGHT + 320, width: 60, height: 30, color: "#a0a0a0" },

      { x: MAX_RIGHT - 286, y: MAX_HEIGHT, width: 70, height: 30, color: "#a0a0a0" },
      { x: MAX_RIGHT - 286, y: MAX_HEIGHT + 190, width: 70, height: 140, color: "#a0a0a0" },
      { x: MAX_RIGHT - 286, y: MAX_HEIGHT + 480, width: 70, height: 240, color: "#a0a0a0" },
    ],
    triangles: [],
  },
  level15: {
    ground: { y: MIN_HEIGHT + 100, height: 0 },
    platforms: [
      { x: MAX_LEFT + 224, y: 300, width: 500, height: MIN_HEIGHT, color: "#202020", decorative: true },

      { x: MAX_LEFT + 100, y: 336, width: 130, height: 30, color: "#202020", decorative: true },
      { x: MAX_LEFT + 200, y: 336, width: 30, height: 70, color: "#202020", decorative: true },
      { x: MAX_LEFT + 150, y: 360, width: 80, height: 30, color: "#202020", decorative: true },

      { x: MAX_LEFT + 100, y: 436, width: 130, height: 30, color: "#202020", decorative: true },
      { x: MAX_LEFT + 200, y: 436, width: 30, height: 70, color: "#202020", decorative: true },
      { x: MAX_LEFT + 150, y: 460, width: 80, height: 30, color: "#202020", decorative: true },

      { x: MAX_LEFT + 100, y: 646, width: 130, height: 30, color: "#202020", decorative: true },
      { x: MAX_LEFT + 200, y: 646, width: 30, height: 70, color: "#202020", decorative: true },
      { x: MAX_LEFT + 150, y: 670, width: 80, height: 30, color: "#202020", decorative: true },

      { x: MAX_LEFT + 224, y: MIN_HEIGHT - 30, width: 110, height: 30, color: "#c1c1c1" },
      { x: MAX_LEFT + 224, y: MAX_HEIGHT + 300, width: 450, height: 220, color: "#c1c1c1" },

      { x: MAX_LEFT + 224, y: MAX_HEIGHT + 300, width: 640, height: 20, color: "#c1c1c1" },
      { x: MAX_RIGHT - 115, y: MAX_HEIGHT + 261, width: 20, height: 40, color: "#c1c1c1" },

      { x: MAX_LEFT + 100, y: MIN_HEIGHT - 70, width: 30, height: 30, color: "#c1c1c1" },
      { x: MAX_LEFT + 100, y: MIN_HEIGHT - 280, width: 30, height: 30, color: "#c1c1c1" },
      { x: MAX_LEFT + 100, y: MIN_HEIGHT - 380, width: 30, height: 30, color: "#c1c1c1" },

      { x: MAX_RIGHT - 286, y: MAX_HEIGHT + 300, width: 70, height: 530, color: "#c1c1c1" },
    ],
    triangles: [],
  },
};
export function getLevelData() {
  return LEVEL_DATA;
}
