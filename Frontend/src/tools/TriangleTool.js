export default class TriangleTool {
  start_position = { x: null, y: null };
  end_position = { x: null, y: null };

  startDrawing({ event }) {
    this.start_position = { x: event.offsetX, y: event.offsetY };
    this.end_position = { x: event.offsetX, y: event.offsetY };
  }

  draw({ event, dp }) {
    dp.preview_context.clearRect(0, 0, dp.width, dp.height);

    // begin new path
    dp.preview_context.beginPath();

    // set triangle style
    dp.preview_context.strokeStyle = dp.style.color;
    dp.preview_context.lineWidth = dp.style.thickness;
    dp.preview_context.lineJoin = "round";
    dp.preview_context.lineCap = "round";

    const end_start = {
      x: event.offsetX - this.start_position.x,
      y: event.offsetY - this.start_position.y,
    };

    // Make an equilateral triangle if shift is down
    if (event.shiftKey) {
      if (Math.abs(end_start.x) > Math.abs(end_start.y))
        end_start.y =
          ((Math.sqrt(3) * Math.abs(end_start.x)) / 2.0) *
          (end_start.y < 0 ? -1 : 1);
      else
        end_start.x =
          ((Math.sqrt(3) * Math.abs(end_start.y) * 2.0) / 3.0) *
          (end_start.x < 0 ? -1 : 1);
    }

    this.end_position = {
      x: end_start.x + this.start_position.x,
      y: end_start.y + this.start_position.y,
    };

    // Draw triangle
    dp.preview_context.moveTo(this.start_position.x, this.start_position.y);
    dp.preview_context.lineTo(this.end_position.x, this.start_position.y);
    dp.preview_context.lineTo(
      (this.end_position.x + this.start_position.x) / 2.0,
      this.end_position.y,
    );
    dp.preview_context.lineTo(this.start_position.x, this.start_position.y);
    dp.preview_context.stroke();
    dp.preview_context.closePath();
  }

  stopDrawing({ dp }) {
    dp.preview_context.clearRect(0, 0, dp.width, dp.height);

    // begin new path
    dp.draw_context.beginPath();

    // set triangle style
    dp.draw_context.strokeStyle = dp.style.color;
    dp.draw_context.lineWidth = dp.style.thickness;
    dp.draw_context.lineJoin = "round";
    dp.draw_context.lineCap = "round";

    // Draw triangle
    dp.draw_context.moveTo(this.start_position.x, this.start_position.y);
    dp.draw_context.lineTo(this.end_position.x, this.start_position.y);
    dp.draw_context.lineTo(
      (this.end_position.x + this.start_position.x) / 2.0,
      this.end_position.y,
    );
    dp.draw_context.lineTo(this.start_position.x, this.start_position.y);
    dp.draw_context.stroke();
    dp.draw_context.closePath();
    this.start_position = { x: null, y: null };
    this.end_position = { x: null, y: null };
  }
}
