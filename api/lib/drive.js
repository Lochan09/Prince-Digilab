const fs = require('fs');
const { google } = require('googleapis');

function oauthRedirectUri() {
  if (process.env.OAUTH_REDIRECT_URI) return process.env.OAUTH_REDIRECT_URI;

  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'www.princedigilab.com';

  return `https://${host.replace(/^www\./, 'www.')}/auth/callback`;
}

function makeOAuthClient() {
  return new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    oauthRedirectUri()
  );
}

function loadRefreshToken() {
  return process.env.OAUTH_REFRESH_TOKEN || null;
}

function getDriveClient() {
  const refreshToken = loadRefreshToken();
  if (!refreshToken) return null;
  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) return null;

  const oauth2Client = makeOAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: 'v3', auth: oauth2Client });
}

async function uploadFilesToDrive(files, folderName) {
  const drive = getDriveClient();
  if (!drive) throw new Error('Google Drive not authorised.');

  const parentId = process.env.DRIVE_PARENT_FOLDER_ID;
  if (!parentId) throw new Error('DRIVE_PARENT_FOLDER_ID is not set.');

  const { data: folder } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id,webViewLink',
  });

  await drive.permissions.create({
    fileId: folder.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  await Promise.all(
    files.map((f) =>
      drive.files.create({
        requestBody: { name: f.originalname, parents: [folder.id] },
        media: { mimeType: f.mimetype, body: fs.createReadStream(f.path) },
      })
    )
  );

  return folder.webViewLink;
}

function generateAuthUrl() {
  return makeOAuthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive'],
  });
}

async function exchangeAuthCode(code) {
  const { tokens } = await makeOAuthClient().getToken(code);
  return tokens;
}

module.exports = {
  getDriveClient,
  loadRefreshToken,
  uploadFilesToDrive,
  generateAuthUrl,
  exchangeAuthCode,
  oauthRedirectUri,
};
