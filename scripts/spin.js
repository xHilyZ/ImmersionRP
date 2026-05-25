document.addEventListener("DOMContentLoaded", () => {

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1];
  }

  const discord_id = getCookie("discord_id");

  const canvas = document.getElementById("spinWheel");
  const ctx = canvas.getContext("2d");

  const slices = [
    "100 Coins",
    "200 Coins",
    "300 Coins",
    "400 Coins",
    "500 Coins",
    "600 Coins",
    "700 Coins",
    "800 Coins"
  ];

  const colors = [
    "#a020f0",
    "#ff2bd8",
    "#a020f0",
    "#ff2bd8",
    "#a020f0",
    "#ff2bd8",
    "#a020f0",
    "#ff2bd8"
  ];

  let startAngle = 0;
  const arc = (2 * Math.PI) / slices.length;

  function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < slices.length; i++) {
      const angle = startAngle + i * arc;

      ctx.beginPath();
      ctx.fillStyle = colors[i];
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, 170, angle, angle + arc);
      ctx.fill();

      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "bold 16px Outfit";
      ctx.translate(
        canvas.width / 2 + Math.cos(angle + arc / 2) * 110,
        canvas.height / 2 + Math.sin(angle + arc / 2) * 110
      );
      ctx.rotate(angle + arc / 2);
      ctx.fillText(slices[i], -ctx.measureText(slices[i]).width / 2, 5);
      ctx.restore();
    }
  }

  drawWheel();

  let spinning = false;

  document.getElementById("spinButton").addEventListener("click", spinWheel);

  async function spinWheel() {
    if (spinning) return;

    if (!discord_id) {
      showRewardPopup("Please log in with Discord first.");
      return;
    }

    spinning = true;

    let res;
    try {
      res = await fetch("/api/spin", {
        method: "POST",
        headers: { "x-discord-id": discord_id }
      });
    } catch {
      showRewardPopup("Server error. Try again later.");
      spinning = false;
      return;
    }

    if (!res.ok) {
      showRewardPopup("Server error. Try again later.");
      spinning = false;
      return;
    }

    const data = await res.json();

    if (data.error) {
      showRewardPopup(data.error);
      spinning = false;
      return;
    }

    const rewardText = `${data.reward} Coins`;
    const index = slices.indexOf(rewardText);

    if (index === -1) {
      showRewardPopup("Invalid reward received.");
      spinning = false;
      return;
    }

    const sliceAngle = index * arc;
    const finalAngle = (Math.PI * 8) + (2 * Math.PI - sliceAngle);

    let angle = startAngle;
    const duration = 3500;
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;

      if (elapsed < duration) {
        angle = easeOut(elapsed, startAngle, finalAngle, duration);
        startAngle = angle;
        drawWheel();
        requestAnimationFrame(animate);
      } else {
        startAngle = finalAngle;
        drawWheel();
        spinning = false;
        showRewardPopup(rewardText);
      }
    }

    requestAnimationFrame(animate);
  }

  function easeOut(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
  }

  function showRewardPopup(text) {
    const popup = document.createElement("div");
    popup.className = "reward-popup";

    popup.innerHTML = `
      <div class="reward-box">
        <h2>🎉 Reward Unlocked!</h2>
        <p>${text}</p>
        <button id="closePopup">Close</button>
      </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("closePopup").onclick = () => popup.remove();
  }

});
