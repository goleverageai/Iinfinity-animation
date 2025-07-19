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
  scale = Math.min(width, height) / 4; // Adjusted scale for better fit
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Handle glow on click
canvas.addEventListener('click', () => {
  pulse = 1;
});

function drawInfinity() {
  ctx.clearRect(0, 0, width, height);

  const lineCount = 20; // Number of lines to draw for 3D effect
  const depthFactor = 0.05; // Controls the depth of the 3D effect

  // Draw each line with varying properties for 3D effect
  for (let i = lineCount - 1; i >= 0; i--) { // Draw from back to front
    ctx.beginPath();
    const offset = i * depthFactor; // Offset for 3D effect
    const currentAlpha = 1 - (i / lineCount) * 0.7; // Fade out further lines
    const currentLineWidth = 8 + (i / lineCount) * 10; // Thicker lines in front

    for (let a = 0; a <= Math.PI * 2; a += 0.01) {
      // Parametric equations for a more traditional infinity symbol
      const x = Math.cos(a);
      const y = Math.sin(a) * Math.cos(a);

      // Apply 3D perspective and rotation
      const rotatedX = x * Math.cos(t * 0.05) - y * Math.sin(t * 0.05);
      const rotatedY = x * Math.sin(t * 0.05) + y * Math.cos(t * 0.05);

      const perspectiveScale = 1 / (1 + rotatedY * 0.5); // Simple perspective

      const fx = cx + (scale * rotatedX * perspectiveScale) + offset * scale;
      const fy = cy + (scale * rotatedY * perspectiveScale) + offset * scale;

      if (a === 0) ctx.moveTo(fx, fy);
      else ctx.lineTo(fx, fy);
    }

    // Apply gradient colors based on position
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = currentLineWidth;
    ctx.globalAlpha = currentAlpha;
    ctx.shadowColor = colors[1]; // Use the middle color for glow
    ctx.shadowBlur = 20 + pulse * 50; // Enhanced glow on click
    ctx.stroke();
  }

  // Reset alpha for sparkle
  ctx.globalAlpha = 1;

  // Draw sparkle
  const sparkleT = t % (Math.PI * 2);
  const sparkleX = Math.cos(sparkleT);
  const sparkleY = Math.sin(sparkleT) * Math.cos(sparkleT);

  const rotatedSparkleX = sparkleX * Math.cos(t * 0.05) - sparkleY * Math.sin(t * 0.05);
  const rotatedSparkleY = sparkleX * Math.sin(t * 0.05) + sparkleY * Math.cos(t * 0.05);

  const sparklePerspectiveScale = 1 / (1 + rotatedSparkleY * 0.5);

  const sx = cx + (scale * rotatedSparkleX * sparklePerspectiveScale);
  const sy = cy + (scale * rotatedSparkleY * sparklePerspectiveScale);

  ctx.beginPath();
  ctx.arc(sx, sy, 8 + pulse * 8, 0, Math.PI * 2); // Larger sparkle, enhanced pulse
  ctx.fillStyle = 'white';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 30 + pulse * 70; // Enhanced sparkle glow
  ctx.fill();

  // Animate pulse fade
  if (pulse > 0) pulse *= 0.9;

  t += 0.02; // Speed of animation
  requestAnimationFrame(drawInfinity);
}

drawInfinity();

