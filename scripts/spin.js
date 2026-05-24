const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const popup = document.getElementById("resultPopup");
const rewardText = document.getElementById("rewardText");

const rewards = [
  "Mystery Box",
  "Rare Item",
  "Exclusive Cosmetic",
  "$5,000 Cash",
  "$10,000 Cash",
  "Free Bronze Pass",
  "Weapon Crate",
  "Priority Queue Token"
];

const sliceCount = rewards.length;
const sliceAngle = (2 * Math.PI) / sliceCount;
let currentRotation = 0;
let highlightIndex = -1;

// Draw wheel with optional highlight
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < sliceCount; i++) {
    const start = i * sliceAngle;
    const end = start + sliceAngle;

    // Highlight glow
    if (i === highlightIndex) {
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 35;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.moveTo(210, 210);
    ctx.arc(210, 210, 200, start, end);
    ctx.fillStyle = i % 2 === 0 ? "#a020f0" : "#ff2bd8";
    ctx.fill();

    ctx.shadowBlur = 0;

    // Text
    ctx.save();
    ctx.translate(210, 210);
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "bold 17px Outfit";
    ctx.fillText(rewards[i], 110, 5);
    ctx.restore();
  }
}

drawWheel();

// Spin logic
spinBtn.onclick = () => {
  const randomSpin = Math.floor(2000 + Math.random() * 3000);
  currentRotation += randomSpin;

  canvas.style.transition = "transform 4s cubic-bezier(.17,.67,.14,.93)";
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  const rewardIndex = Math.floor(Math.random() * rewards.length);

  setTimeout(() => {
    highlightIndex = rewardIndex;
    drawWheel();

    rewardText.innerHTML = rewards[rewardIndex];
    popup.classList.remove("hidden");
  }, 4000);
};

function closePopup() {
  popup.classList.add("hidden");
}
