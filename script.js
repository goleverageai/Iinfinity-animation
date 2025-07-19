const canvas = document.getElementById('infinityCanvas');
const ctx = canvas.getContext('2d');

let width, height, cx, cy, scale;
let t = 0;
let pulse = 0;
const colors = ['#ff0000', '#ff00ed', '#0038ff'];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  cx = width / 2;
  cy = height / 2;
  scale = Math.min(width, height) / 3;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Handle glow on click
canvas.addEventListener('click', () => {
  pulse = 1;
});

function drawInfinity() {
  ctx.clearRect(0, 0, width, height);

  const perspectiveDepth = 0.6; // adjust for more/less 3D
  const verticalSkew = 0.4;     // simulate 3D arc

  // Draw each line with slight offset
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.01) {
      const x = Math.cos(a) / (1 + Math.sin(a) ** 2);
      const y = (Math.cos(a) * Math.sin(a)) / (1 + Math.sin(a) ** 2);

      const fx = cx + (scale * x * (1 - perspectiveDepth * y)) + i * 2;
      const fy = cy + (scale * y * (1 + verticalSkew)) + i * 2;

      if (a === 0) ctx.moveTo(fx, fy);
      else ctx.lineTo(fx, fy);
    }

    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 8;
    ctx.shadowColor = colors[i];
    ctx.shadowBlur = 20 + pulse * 50;
    ctx.stroke();
  }

  // Draw sparkle
  const sparkleT = t % (Math.PI * 2);
  const sparkleX = Math.cos(sparkleT) / (1 + Math.sin(sparkleT) ** 2);
  const sparkleY = (Math.cos(sparkleT) * Math.sin(sparkleT)) / (1 + Math.sin(sparkleT) ** 2);
  const sx = cx + (scale * sparkleX * (1 - perspectiveDepth * sparkleY));
  const sy = cy + (scale * sparkleY * (1 + verticalSkew));

  ctx.beginPath();
  ctx.arc(sx, sy, 6 + pulse * 6, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 25 + pulse * 60;
  ctx.fill();

  // Animate pulse fade
  if (pulse > 0) pulse *= 0.92;

  t += 0.02;
  requestAnimationFrame(drawInfinity);
}

drawInfinity();
