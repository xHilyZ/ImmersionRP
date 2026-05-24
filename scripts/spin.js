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
  "Free Vehicle Reskin",
  "Weapon Crate",
  "Priority Queue Token"
];

const sliceCount = rewards.length;
const sliceAngle = (2 * Math.PI) / sliceCount;
let currentRotation = 0;

// Draw wheel with centered labels
function drawWheel() {
  for (let i = 0; i < sliceCount; i++) {
    const start = i * sliceAngle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(210, 210);
    ctx.arc(210, 210, 200, start, end);
    ctx.fillStyle = i % 2 === 0 ? "#a020f0" : "#ff2bd8";
    ctx.fill();

    ctx.save();
    ctx.translate(210, 210);
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "18px Outfit";
    ctx.fillText(rewards[i], 120, 5);
    ctx.restore();
  }
}

drawWheel();

// Daily spin lock
function canSpinToday() {
  const lastSpin = localStorage.getItem("lastSpinDate");
  const today = new Date().toDateString();
  return lastSpin !== today;
}

function lockSpin() {
  const today = new Date().toDateString();
  localStorage.setItem("lastSpinDate", today);
  spinBtn.disabled = true;
  spinBtn.innerText = "COME BACK TOMORROW";
}

// Spin logic
spinBtn.onclick = () => {
  if (!canSpinToday()) return;

  const randomSpin = Math.floor(2000 + Math.random() * 3000);
  currentRotation += randomSpin;

  canvas.style.transition = "transform 4s cubic-bezier(.17,.67,.14,.93)";
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  const rewardIndex = Math.floor(Math.random() * rewards.length);

  setTimeout(() => {
    rewardText.innerHTML = rewards[rewardIndex];
    popup.classList.remove("hidden");
    lockSpin();
  }, 4000);
};

function closePopup() {
  popup.classList.add("hidden");
}

// Disable button if already spun today
if (!canSpinToday()) {
  lockSpin();
}
