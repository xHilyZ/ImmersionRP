export default async function handler(req, res) {
  const redirect = encodeURIComponent(process.env.CFX_REDIRECT_URL);

  const url = `https://identifiers.fivem.net/openid/connect/authorize?` +
    `client_id=${process.env.CFX_CLIENT_ID}` +
    `&redirect_uri=${redirect}` +
    `&response_type=code` +
    `&scope=openid%20profile`;

  res.redirect(url);
}
