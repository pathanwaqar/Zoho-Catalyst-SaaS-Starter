const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const LOCAL_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });

const BUCKET_NAME = 'ticket-attachments';

/**
 * Uploads a ticket attachment. On Catalyst this goes to a Stratus bucket;
 * locally it falls back to writing the file to disk under /uploads so the
 * demo works without Zoho credentials.
 */
async function uploadFile(req, file) {
  if (req.catalystApp) {
    const bucket = req.catalystApp.stratus().bucket(BUCKET_NAME);
    const result = await bucket.putObject(file.originalname, file.buffer);
    return { key: file.originalname, url: result.weblink || result.object_url };
  }

  const key = `${randomUUID()}-${file.originalname}`;
  fs.writeFileSync(path.join(LOCAL_UPLOAD_DIR, key), file.buffer);
  return { key, url: `/uploads/${key}` };
}

module.exports = { uploadFile, LOCAL_UPLOAD_DIR };
