const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const popup = document.getElementById("resultPopup");
const rewardText = document.getElementById("rewardText");

const rewards = [
  "💰 $5,000 Cash",
  "💰 $10,000 Cash",
  "🚗 Free Vehicle Rental",
  "🔫 Weapon Crate",
  "🎟 Priority Queue Token",
  "📦 Mystery Box",
  "💎 Rare Item",
  "🏆 Exclusive Cosmetic"
];

spinBtn.onclick = () => {
  const randomSpin = Math.floor(2000 + Math.random() * 3000);
  wheel.style.transform = `rotate(${randomSpin}deg)`;

  const rewardIndex = Math.floor(Math.random() * rewards.length);

  setTimeout(() => {
    rewardText.innerHTML = rewards[rewardIndex];
    popup.classList.remove("hidden");
  }, 4000);
};

function closePopup() {
  popup.classList.add("hidden");
}
