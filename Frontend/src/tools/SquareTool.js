export default class SquareTool {
  start_position = { x: null, y: null };
  size = { w: 0, h: 0 };

  startDrawing({ event }) {
    this.start_position = { x: event.offsetX, y: event.offsetY };
  }

  draw({ event, dp }) {
    dp.preview_context.clearRect(0, 0, dp.width, dp.height);

    // begin new path
    dp.preview_context.beginPath();

    // set line style
    dp.preview_context.strokeStyle = dp.style.color;
    dp.preview_context.lineWidth = dp.style.thickness;
    dp.preview_context.lineJoin = "round";

    this.size = {
      w: event.offsetX - this.start_position.x,
      h: event.offsetY - this.start_position.y,
    };
    if (event.shiftKey) {
      const max_dimension = Math.max(
        Math.abs(this.size.w),
        Math.abs(this.size.h),
      );
      this.size.w = max_dimension * (this.size.w < 0 ? -1 : 1);
      this.size.h = max_dimension * (this.size.h < 0 ? -1 : 1);
    }

    dp.preview_context.rect(
      this.start_position.x,
      this.start_position.y,
      this.size.w,
      this.size.h,
    );
    dp.preview_context.stroke();
    dp.preview_context.closePath();
  }

  stopDrawing({ dp }) {
    dp.preview_context.clearRect(0, 0, dp.width, dp.height);

    dp.draw_context.beginPath();

    // set line style
    dp.draw_context.strokeStyle = dp.style.color;
    dp.draw_context.lineWidth = dp.style.thickness;
    dp.draw_context.lineJoin = "round";

    dp.draw_context.rect(
      this.start_position.x,
      this.start_position.y,
      this.size.w,
      this.size.h,
    );
    dp.draw_context.stroke();
    dp.draw_context.closePath();

    this.start_position = { x: null, y: null };
    this.size = { w: 0, h: 0 };
  }
}
