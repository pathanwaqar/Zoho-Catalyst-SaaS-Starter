require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { attachCatalyst } = require('./config/catalystConfig');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/projects.routes');
const ticketRoutes = require('./routes/tickets.routes');
const uploadRoutes = require('./routes/uploads.routes');
const { LOCAL_UPLOAD_DIR } = require('./services/storage.service');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(attachCatalyst);
app.use('/uploads', express.static(LOCAL_UPLOAD_DIR));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    mode: req.catalystApp ? 'catalyst' : 'local',
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', ticketRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(errorHandler);

const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;
app.listen(PORT, () => {
  console.log(`Catalyst SaaS Starter API listening on port ${PORT}`);
});
