export default class PenTool {
  startDrawing({ event, dp }) {
    // draw an initial circle
    dp.draw_context.beginPath();
    dp.draw_context.fillStyle = dp.style.color;
    dp.draw_context.arc(
      event.offsetX,
      event.offsetY,
      dp.style.thickness / 2,
      0,
      2 * Math.PI,
    );
    dp.draw_context.fill();
    dp.draw_context.closePath();

    // begin new path
    dp.draw_context.beginPath();
    dp.draw_context.moveTo(event.offsetX, event.offsetY);
  }

  draw({ event, dp }) {
    // set the color and thickness
    dp.draw_context.strokeStyle = dp.style.color;
    dp.draw_context.lineWidth = dp.style.thickness;

    // make the lines look curvy
    dp.draw_context.lineCap = "round";
    dp.draw_context.lineJoin = "round";
    // draw small lines
    dp.draw_context.lineTo(event.offsetX, event.offsetY);
    dp.draw_context.stroke();
  }

  stopDrawing({ dp }) {
    // stop painting and close path
    dp.draw_context.stroke();
    dp.draw_context.closePath();
  }
}
