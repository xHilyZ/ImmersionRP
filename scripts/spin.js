const wheel = document.getElementById("spinWheel");
const ctx = wheel.getContext("2d");
const spinButton = document.getElementById("spinButton");

const segments = [
  "20% OFF",
  "30% OFF",
  "50% OFF",
  "$5 Gift Card",
  "$10 Gift Card",
  "70% OFF"
];

const colors = [
  "#a020f0",
  "#ff2bd8",
  "#a020f0",
  "#ff2bd8",
  "#a020f0",
  "#ff2bd8"
];

let startAngle = 0;
let spinning = false;

function drawWheel() {
  const arc = (2 * Math.PI) / segments.length;

  for (let i = 0; i < segments.length; i++) {
    const angle = startAngle + i * arc;

    // Slice
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(175, 175);
    ctx.arc(175, 175, 175, angle, angle + arc);
    ctx.fill();

    // Text
    ctx.save();
    ctx.translate(175, 175);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Outfit";
    ctx.fillText(segments[i], 160, 10);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  let spinTime = 0;
  const spinDuration = 3000; // 3 seconds
  const spinAngle = Math.random() * 2000 + 2000; // random spin power

  function rotate() {
    spinTime += 20;

    if (spinTime >= spinDuration) {
      spinning = false;
      return;
    }

    // Smooth easing
    startAngle += (spinAngle / spinDuration) * 20 * Math.PI / 180;

    drawWheel();
    requestAnimationFrame(rotate);
  }

  rotate();
}

// Initial draw
drawWheel();

// Button click
spinButton.addEventListener("click", spinWheel);
