const { generateAuthUrl } = require('../lib/drive');

module.exports = function handler(_req, res) {
  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    return res
      .status(500)
      .send('OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET must be set in Vercel environment variables.');
  }

  res.writeHead(302, { Location: generateAuthUrl() });
  res.end();
};
