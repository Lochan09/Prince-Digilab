function firebaseApiKey() {
  return process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || '';
}

async function verifyOwnerToken(authHeader) {
  const token = String(authHeader || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return { ok: false, status: 401, error: 'Unauthorized.' };

  const apiKey = firebaseApiKey();
  if (!apiKey) return { ok: false, status: 500, error: 'Server auth is not configured.' };

  const fbRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    }
  );

  const fbData = await fbRes.json();
  if (!fbRes.ok || !fbData.users?.[0]) {
    return { ok: false, status: 401, error: 'Invalid token.' };
  }

  const callerEmail = String(fbData.users[0].email || '').toLowerCase();
  const ownerEmail = String(process.env.OWNER_EMAIL || '').toLowerCase();
  if (!ownerEmail || callerEmail !== ownerEmail) {
    return { ok: false, status: 403, error: 'Access denied.' };
  }

  return { ok: true, email: callerEmail };
}

module.exports = { verifyOwnerToken };
