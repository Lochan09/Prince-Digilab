const { exchangeAuthCode, oauthRedirectUri } = require('../lib/drive');

module.exports = async function handler(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing code parameter.');
  }

  try {
    const tokens = await exchangeAuthCode(code);
    const refreshToken = tokens.refresh_token || '(not returned — revoke app access and try again)';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Drive connected</title></head>
<body style="font-family:sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem">
  <h2 style="color:#6c3fc8">Google Drive connected</h2>
  <p>Copy this refresh token into Vercel → Settings → Environment Variables as <code>OAUTH_REFRESH_TOKEN</code>, then redeploy.</p>
  <textarea readonly style="width:100%;height:120px;font-family:monospace">${refreshToken}</textarea>
  <p style="color:#666;font-size:14px">Redirect URI used: <code>${oauthRedirectUri()}</code></p>
</body>
</html>`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send(`Failed to exchange code: ${err.message}`);
  }
};
