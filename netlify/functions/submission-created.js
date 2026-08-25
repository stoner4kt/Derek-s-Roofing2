const { google } = require('googleapis');

exports.handler = async (event) => {
  try {
    const { name, phone, email, service, message } = JSON.parse(event.body).payload.data;
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[new Date().toLocaleString('en-ZA'), name, phone, email, service, message]],
      },
    });

    return { statusCode: 200 };
  } catch (error) {
    console.error('Failed to append Netlify form submission to Google Sheets:', error);
    return { statusCode: 500, body: 'Failed to save form submission.' };
  }
};
