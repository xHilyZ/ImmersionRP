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

const ITEM_WIDTH = 130;       // must match CSS
const WINDOW_WIDTH = 520;     // must match .case-window width
const CENTER_OFFSET = WINDOW_WIDTH / 2 - ITEM_WIDTH / 2;

let sequence = [];

// Build long strip
function buildCaseStrip() {
  caseItemsContainer.innerHTML = "";
  sequence = [];

  const totalItems = 60; // long enough for a nice spin

  for (let i = 0; i < totalItems; i++) {
    const r = rewards[i % rewards.length];
    sequence.push(r);

    const div = document.createElement("div");
    div.className = `case-item ${r.rarity}`;
    div.textContent = r.label;
    caseItemsContainer.appendChild(div);
  }
}

buildCaseStrip();

spinBtn.onclick = () => {
  // pick a random stop index somewhere in the last half of the strip
  const minStop = 25;
  const maxStop = sequence.length - 5;
  const stopIndex = Math.floor(Math.random() * (maxStop - minStop)) + minStop;

  const winningReward = sequence[stopIndex];

  const targetOffset = stopIndex * ITEM_WIDTH - CENTER_OFFSET;

  // reset
  caseItemsContainer.style.transition = "none";
  caseItemsContainer.style.transform = "translateX(0px)";
  void caseItemsContainer.offsetWidth; // force reflow

  // animate
  caseItemsContainer.style.transition = "transform 4s cubic-bezier(.17,.67,.14,.93)";
  caseItemsContainer.style.transform = `translateX(-${targetOffset}px)`;

  setTimeout(() => {
    rewardText.textContent = winningReward.label;
    popup.classList.remove("hidden");
  }, 4000);
};

function closePopup() {
  popup.classList.add("hidden");
}
