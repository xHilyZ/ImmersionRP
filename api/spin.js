import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    const discord_id = req.headers["x-discord-id"];

    if (!discord_id) {
      return res.status(400).json({ error: "Missing Discord ID" });
    }

    // Check last spin
    const { data: existing, error: fetchError } = await supabase
      .from("spins")
      .select("*")
      .eq("discord_id", discord_id)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return res.status(500).json({ error: "Database fetch error" });
    }

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    if (existing && now - existing.last_spin < day) {
      return res.status(429).json({ error: "Already spun today" });
    }

    // Valid rewards only
    const rewards = [100,200,300,400,500,600,700,800];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    const { error: upsertError } = await supabase
      .from("spins")
      .upsert({
        discord_id,
        last_spin: now,
        reward
      });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      return res.status(500).json({ error: "Database save error" });
    }

    return res.json({ reward });

  } catch (err) {
    console.error("Server crash:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
