const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middleware/authMiddleware');
const { uploadAttachment } = require('../controllers/uploads.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = express.Router();

router.post('/', requireAuth, upload.single('file'), uploadAttachment);

module.exports = router;
