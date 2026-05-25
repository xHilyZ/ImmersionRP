import cookie from "cookie";

export default async function handler(req, res) {
  const code = req.query.code;

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URL
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("TOKEN ERROR:", tokenData);
      return res.status(500).json({ error: "OAuth token exchange failed" });
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const user = await userRes.json();

    if (!user.id) {
      console.error("USER ERROR:", user);
      return res.status(500).json({ error: "Failed to fetch Discord user" });
    }

    res.setHeader("Set-Cookie", cookie.serialize("discord_id", user.id, {
      httpOnly: false,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    }));

    res.redirect("/index.html");

  } catch (err) {
    console.error("CALLBACK CRASH:", err);
    res.status(500).json({ error: "Callback crashed" });
  }
}