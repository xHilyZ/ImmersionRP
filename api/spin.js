import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const discord_id = req.headers["x-discord-id"];

  if (!discord_id) {
    return res.status(400).json({ error: "Missing Discord ID" });
  }

  // Check last spin
  const { data: existing } = await supabase
    .from("spins")
    .select("*")
    .eq("discord_id", discord_id)
    .single();

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  if (existing && now - existing.last_spin < day) {
    return res.status(429).json({ error: "Already spun today" });
  }

  // VALID REWARDS ONLY
  const rewards = [100, 200, 300, 400, 500, 600, 700, 800];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  // Save spin
  await supabase
    .from("spins")
    .upsert({
      discord_id,
      last_spin: now,
      reward
    });

  res.json({ reward });
}
