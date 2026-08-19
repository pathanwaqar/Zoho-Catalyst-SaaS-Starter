const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { listProjects, createProject } = require('../controllers/projects.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/', listProjects);
router.post('/', createProject);

module.exports = router;
