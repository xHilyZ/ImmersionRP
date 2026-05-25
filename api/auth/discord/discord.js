export default function handler(req, res) {
  const redirect = encodeURIComponent(process.env.DISCORD_REDIRECT_URL);

  const url =
    `https://discord.com/oauth2/authorize?` +
    `client_id=${process.env.DISCORD_CLIENT_ID}` +
    `&redirect_uri=${redirect}` +
    `&response_type=code` +
    `&scope=identify`;

  res.redirect(url);
}
