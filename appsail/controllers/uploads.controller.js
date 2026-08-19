const { uploadFile } = require('../services/storage.service');

async function uploadAttachment(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'file is required' });
    const result = await uploadFile(req, req.file);
    res.status(201).json({ success: true, attachment: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadAttachment };
