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

  const { data: existing } = await supabase
    .from("spins")
    .select("*")
    .eq("discord_id", discord_id)
    .single();

  const now = Date.now();

  if (existing && now - existing.last_spin < 24 * 60 * 60 * 1000) {
    return res.status(429).json({ error: "Already spun today" });
  }

  const reward = Math.floor(Math.random() * 1000);

  await supabase
    .from("spins")
    .upsert({
      discord_id,
      last_spin: now,
      reward
    });

  res.json({ reward });
}
