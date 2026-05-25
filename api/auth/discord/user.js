export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing ID" });

  try {
    const userRes = await fetch(`https://discord.com/api/users/${id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
      }
    });

    const user = await userRes.json();
    res.json(user);

  } catch (err) {
    console.error("USER FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}
