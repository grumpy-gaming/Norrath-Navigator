const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

function drawLine(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1 + 400, y1 + 300);  // Centering map
    ctx.lineTo(x2 + 400, y2 + 300);
    ctx.stroke();
}