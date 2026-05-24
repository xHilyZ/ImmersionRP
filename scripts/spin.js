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

const ITEM_WIDTH = 130; // must match CSS
const CENTER_OFFSET = 520 / 2 - ITEM_WIDTH / 2; // center of window

// Build long strip
function buildCaseStrip() {
  caseItemsContainer.innerHTML = "";
  const sequence = [];

  // repeat rewards to make long strip
  for (let i = 0; i < 40; i++) {
    const r = rewards[i % rewards.length];
    sequence.push(r);
  }

  sequence.forEach((r) => {
    const div = document.createElement("div");
    div.className = `case-item ${r.rarity}`;
    div.textContent = r.label;
    caseItemsContainer.appendChild(div);
  });

  return sequence;
}

let sequence = buildCaseStrip();

spinBtn.onclick = () => {
  // pick a random reward
  const winningIndex = Math.floor(Math.random() * rewards.length);
  const winningReward = rewards[winningIndex];

  // find a matching item near the end of the strip
  let stopIndex = sequence.length - 10; // safe zone near end

  // move backward until we find the matching reward
  while (sequence[stopIndex % sequence.length].label !== winningReward.label) {
    stopIndex--;
  }

  // calculate exact pixel offset so item lands in center
  const targetOffset = stopIndex * ITEM_WIDTH - CENTER_OFFSET;

  // reset instantly
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
