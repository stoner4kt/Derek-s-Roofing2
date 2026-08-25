const { createSign } = require('node:crypto');

function encodeBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function createServiceAccountJwt(email, privateKey) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = encodeBase64Url(
    JSON.stringify({
      iss: email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  );
  const unsignedToken = `${header}.${claims}`;
  const signer = createSign('RSA-SHA256');

  signer.update(unsignedToken);
  signer.end();

  return `${unsignedToken}.${signer.sign(privateKey, 'base64url')}`;
}

async function getAccessToken(email, privateKey) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createServiceAccountJwt(email, privateKey),
    }),
  });
  const result = await response.json();

  if (!response.ok || !result.access_token) {
    throw new Error(`Google authentication failed with status ${response.status}.`);
  }

  return result.access_token;
}

exports.handler = async (event) => {
  try {
    const { name, phone, email, service, message } = JSON.parse(event.body).payload.data;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const accessToken = await getAccessToken(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, privateKey);
    const spreadsheetId = encodeURIComponent(process.env.GOOGLE_SHEET_ID);
    const range = encodeURIComponent('Sheet1!A:F');
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[new Date().toLocaleString('en-ZA'), name, phone, email, service, message]],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Google Sheets append failed with status ${response.status}.`);
    }

    return {
      statusCode: 200,
      body: 'Submission saved.',
    };
  } catch (error) {
    console.error('Failed to append Netlify form submission to Google Sheets:', error);
    return { statusCode: 500, body: 'Failed to save form submission.' };
  }
};
