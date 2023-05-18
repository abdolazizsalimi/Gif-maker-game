export default class CircleTool {
  start_position = { x: null, y: null };
  center = { x: null, y: null };
  size = { w: null, h: null };

  startDrawing({ event }) {
    this.start_position = { x: event.offsetX, y: event.offsetY };
    this.center = { x: event.offsetX, y: event.offsetY };
    this.size = { w: 0, h: 0 };
  }

  draw({ event, dp }) {
    dp.preview_context.clearRect(0, 0, dp.width, dp.height);
    dp.preview_context.beginPath();

    // set ellipse style
    dp.preview_context.strokeStyle = dp.style.color;
    dp.preview_context.lineWidth = dp.style.thickness;

    const half_end_start = {
      x: (event.offsetX - this.start_position.x) / 2.0,
      y: (event.offsetY - this.start_position.y) / 2.0,
    };

    // Make width and height equal if shift is down
    if (event.shiftKey) {
      const max_dimension = Math.max(
        Math.abs(half_end_start.x),
        Math.abs(half_end_start.y),
      );
      half_end_start.x = max_dimension * (half_end_start.x < 0 ? -1 : 1);
      half_end_start.y = max_dimension * (half_end_start.y < 0 ? -1 : 1);
    }

    this.center = {
      x: this.start_position.x + half_end_start.x,
      y: this.start_position.y + half_end_start.y,
    };

    this.size = {
      w: Math.abs(half_end_start.x),
      h: Math.abs(half_end_start.y),
    };

    // Make center of the ellipse equal to start position
    if (event.altKey) {
      this.center = { ...this.start_position };
      this.size.w *= 2;
      this.size.h *= 2;
    }

    dp.preview_context.ellipse(
      this.center.x,
      this.center.y,
      this.size.w,
      this.size.h,
      0,
      0,
      Math.PI * 2.0,
    );
    dp.preview_context.stroke();
    dp.preview_context.closePath();
  }

  stopDrawing({ dp }) {
    dp.preview_context.clearRect(0, 0, dp.width, dp.height);

    dp.draw_context.beginPath();

    // set ellipse style
    dp.draw_context.strokeStyle = dp.style.color;
    dp.draw_context.lineWidth = dp.style.thickness;

    dp.draw_context.ellipse(
      this.center.x,
      this.center.y,
      this.size.w,
      this.size.h,
      0,
      0,
      Math.PI * 2.0,
    );
    dp.draw_context.stroke();
    dp.draw_context.closePath();
    this.start_position = { x: null, y: null };
    this.center = { x: null, y: null };
    this.size = { w: null, h: null };
  }
}
