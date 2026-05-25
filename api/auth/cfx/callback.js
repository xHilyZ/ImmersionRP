import cookie from "cookie";

export default async function handler(req, res) {
  const code = req.query.code;

  const tokenRes = await fetch("https://identifiers.fivem.net/openid/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.CFX_REDIRECT_URL,
      client_id: process.env.CFX_CLIENT_ID,
      client_secret: process.env.CFX_CLIENT_SECRET
    })
  });

  const tokenData = await tokenRes.json();

  const userInfoRes = await fetch("https://identifiers.fivem.net/openid/connect/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  const user = await userInfoRes.json();

  // Save CFX ID in cookie
  res.setHeader("Set-Cookie", cookie.serialize("cfx_id", user.sub, {
    httpOnly: false,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }));

  res.redirect("/");
}
