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

    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(175, 175);
    ctx.arc(175, 175, 175, angle, angle + arc);
    ctx.fill();

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

function getReward(finalAngle) {
  const arc = (2 * Math.PI) / segments.length;
  const index = Math.floor(((2 * Math.PI - finalAngle) % (2 * Math.PI)) / arc);
  return segments[index];
}

function showPopup(reward) {
  const popup = document.createElement("div");
  popup.className = "reward-popup";

  popup.innerHTML = `
    <div class="reward-box">
      <h2>🎉 You Won!</h2>
      <p>${reward}</p>
      <button id="closePopup">Close</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("closePopup").onclick = () => {
    popup.remove();
  };
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  let spinTime = 0;
  const spinDuration = 3000;
  const spinAngle = Math.random() * 2000 + 2000;

  function rotate() {
    spinTime += 20;

    if (spinTime >= spinDuration) {
      spinning = false;

      const finalAngle = startAngle % (2 * Math.PI);
      const reward = getReward(finalAngle);

      showPopup(reward);
      return;
    }

    startAngle += (spinAngle / spinDuration) * 20 * Math.PI / 180;
    drawWheel();
    requestAnimationFrame(rotate);
  }

  rotate();
}

drawWheel();
spinButton.addEventListener("click", spinWheel);
