const { getTable } = require('../services/dataStore');

async function listProjects(req, res, next) {
  try {
    const projects = getTable(req, 'Projects');
    const rows = await projects.find((p) => p.organization === req.user.organization);
    res.json({ success: true, projects: rows });
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });

    const projects = getTable(req, 'Projects');
    const project = await projects.insert({
      name,
      description: description || '',
      organization: req.user.organization,
      createdBy: req.user.sub,
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProjects, createProject };
