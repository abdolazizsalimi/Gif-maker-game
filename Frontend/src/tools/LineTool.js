export default class LineTool {
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
    dp.preview_context.moveTo(this.start_position.x, this.start_position.y);

    // set line style
    dp.preview_context.strokeStyle = dp.style.color;
    dp.preview_context.lineWidth = dp.style.thickness;
    dp.preview_context.lineCap = "round";

    let end_start = {
      x: event.offsetX - this.start_position.x,
      y: event.offsetY - this.start_position.y,
    };

    // Make line straight if shift is down
    if (event.shiftKey) {
      const max_dimension = Math.max(
        Math.abs(end_start.x),
        Math.abs(end_start.y),
      );
      if (Math.abs(end_start.y) <= 50) end_start.y = 0;
      else if (Math.abs(end_start.x) <= 50) end_start.x = 0;
      else if (Math.abs(Math.abs(end_start.x) - Math.abs(end_start.y)) <= 50)
        // Diagonal Line
        end_start = {
          x: max_dimension * (end_start.x < 0 ? -1 : 1),
          y: max_dimension * (end_start.y < 0 ? -1 : 1),
        };
    }

    this.end_position = {
      x: end_start.x + this.start_position.x,
      y: end_start.y + this.start_position.y,
    };

    dp.preview_context.lineTo(this.end_position.x, this.end_position.y);
    dp.preview_context.stroke();
    dp.preview_context.closePath();
  }

  stopDrawing({ dp }) {
    dp.preview_context.clearRect(0, 0, dp.width, dp.height);

    dp.draw_context.beginPath();
    dp.draw_context.moveTo(this.start_position.x, this.start_position.y);

    // set line style
    dp.draw_context.strokeStyle = dp.style.color;
    dp.draw_context.lineWidth = dp.style.thickness;
    dp.draw_context.lineCap = "round";

    dp.draw_context.lineTo(this.end_position.x, this.end_position.y);
    dp.draw_context.stroke();
    dp.draw_context.closePath();
    this.start_position = { x: null, y: null };
    this.end_position = { x: null, y: null };
  }
}
