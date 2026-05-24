const caseItemsContainer = document.getElementById("caseItems");
const spinBtn = document.getElementById("spinBtn");
const popup = document.getElementById("resultPopup");
const rewardText = document.getElementById("rewardText");

// Rewards WITH emojis
const rewards = [
  { label: "🎁 Mystery Box", rarity: "epic" },
  { label: "💎 Rare Item", rarity: "rare" },
  { label: "✨ Exclusive Cosmetic", rarity: "epic" },
  { label: "💵 $5,000 Cash", rarity: "common" },
  { label: "💰 $10,000 Cash", rarity: "common" },
  { label: "🥉 Free Bronze Pass", rarity: "rare" },
  { label: "🔫 Weapon Crate", rarity: "rare" },
  { label: "⚡ Priority Queue Token", rarity: "legendary" }
];

function buildCaseStrip() {
  caseItemsContainer.innerHTML = "";

  // long strip
  for (let i = 0; i < 60; i++) {
    const r = rewards[i % rewards.length];
    const div = document.createElement("div");
    div.className = `case-item ${r.rarity}`;
    div.textContent = r.label;
    caseItemsContainer.appendChild(div);
  }
}

buildCaseStrip();

spinBtn.onclick = () => {
  // random distance to move (in px)
  const maxShift = 130 * 40; // 40 items worth
  const targetShift = Math.floor(Math.random() * maxShift) + 130 * 10;

  caseItemsContainer.style.transition = "none";
  caseItemsContainer.style.transform = "translateX(0px)";
  void caseItemsContainer.offsetWidth;

  caseItemsContainer.style.transition = "transform 4s cubic-bezier(.17,.67,.14,.93)";
  caseItemsContainer.style.transform = `translateX(-${targetShift}px)`;

  setTimeout(() => {
    const windowRect = document
      .querySelector(".case-window")
      .getBoundingClientRect();
    const centerX = windowRect.left + windowRect.width / 2;

    const items = Array.from(
      document.querySelectorAll(".case-item")
    );

    let closestItem = null;
    let closestDist = Infinity;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(itemCenter - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestItem = item;
      }
    });

    if (closestItem) {
      rewardText.textContent = closestItem.textContent;
      popup.classList.remove("hidden");
    }
  }, 4000);
};

function closePopup() {
  popup.classList.add("hidden");
}
