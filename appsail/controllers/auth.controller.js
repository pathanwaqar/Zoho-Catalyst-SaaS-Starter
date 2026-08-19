const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getTable } = require('../services/dataStore');

async function register(req, res, next) {
  try {
    const { name, email, password, organization } = req.body;
    if (!name || !email || !password || !organization) {
      return res
        .status(400)
        .json({ success: false, error: 'name, email, password and organization are required' });
    }

    const users = getTable(req, 'Users');
    const existing = await users.find((u) => u.email === email);
    if (existing.length) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await users.insert({
      name,
      email,
      passwordHash,
      organization,
      role: 'admin',
    });

    const token = signToken(user);
    res.status(201).json({ success: true, token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const users = getTable(req, 'Users');
    const [user] = await users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = signToken(user);
    res.json({ success: true, token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

function signToken(user) {
  return jwt.sign(
    { sub: user.ROWID, email: user.email, organization: user.organization, role: user.role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
}

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { register, login };
