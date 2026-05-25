const wheel = document.getElementById("spinWheel");
const ctx = wheel.getContext("2d");
const spinButton = document.getElementById("spinButton");

const segments = ["20% OFF", "30% OFF", "50% OFF", "70% OFF"];
const colors = ["#a020f0", "#ff2bd8", "#a020f0", "#ff2bd8"];

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

function showPopup(reward, code) {
  const popup = document.createElement("div");
  popup.className = "reward-popup";

  popup.innerHTML = `
    <div class="reward-box">
      <h2>🎉 You Won ${reward}!</h2>
      <p>Your Tebex Code:</p>
      <div class="code-box">${code}</div>
      <button id="closePopup">Close</button>
    </div>
  `;

  document.body.appendChild(popup);
  document.getElementById("closePopup").onclick = () => popup.remove();
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

async function spinWheel() {
  if (spinning) return;
  spinning = true;

  const cfx_id = getCookie("cfx_id");

  if (!cfx_id) {
    alert("Please login with CFX before spinning.");
    spinning = false;
    return;
  }

  // Call backend
  const res = await fetch("/api/spin", {
    method: "POST",
    headers: { "x-cfx-id": cfx_id }
  });

  const data = await res.json();

  if (data.error === "already_spun") {
    alert("You already spun today — come back tomorrow.");
    spinning = false;
    return;
  }

  // Animate wheel
  const spinAngle = Math.random() * 6 + 10;
  const duration = 3000;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;

    if (elapsed >= duration) {
      spinning = false;
      showPopup(data.reward, data.code);
      return;
    }

    const progress = elapsed / duration;
    const eased = 1 - Math.pow(1 - progress, 3);

    startAngle = eased * spinAngle * Math.PI * 2;

    drawWheel();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

drawWheel();
spinButton.addEventListener("click", spinWheel);
