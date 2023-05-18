export const clamp = (x, min, max) => Math.max(Math.min(x, max), min);
export const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
