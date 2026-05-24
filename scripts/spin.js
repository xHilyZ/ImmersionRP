const caseItemsContainer = document.getElementById("caseItems");
const spinBtn = document.getElementById("spinBtn");
const popup = document.getElementById("resultPopup");
const rewardText = document.getElementById("rewardText");

const rewards = [
  { label: "Mystery Box", rarity: "epic" },
  { label: "Rare Item", rarity: "rare" },
  { label: "Exclusive Cosmetic", rarity: "epic" },
  { label: "$5,000 Cash", rarity: "common" },
  { label: "$10,000 Cash", rarity: "common" },
  { label: "Free Bronze Pass", rarity: "rare" },
  { label: "Weapon Crate", rarity: "rare" },
  { label: "Priority Queue Token", rarity: "legendary" }
];

const ITEM_WIDTH = 130; // must match CSS min-width
const VISIBLE_CENTER_INDEX = 6; // where we want the winning item to land

// Build long strip of items
function buildCaseStrip() {
  caseItemsContainer.innerHTML = "";
  const sequence = [];

  // repeat rewards to make a long strip
  for (let i = 0; i < 30; i++) {
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
  // pick a random reward index from the base rewards
  const winningRewardIndex = Math.floor(Math.random() * rewards.length);
  const winningReward = rewards[winningRewardIndex];

  // choose a position in the strip near the end to stop on
  const stopIndex = sequence.length - 1 - (rewards.length - winningRewardIndex);
  const targetOffset = (stopIndex - VISIBLE_CENTER_INDEX) * ITEM_WIDTH;

  caseItemsContainer.style.transition = "none";
  caseItemsContainer.style.transform = "translateX(0px)";

  // force reflow
  void caseItemsContainer.offsetWidth;

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
