const catalystSDK = require('zcatalyst-sdk-node');

/**
 * Attaches a Catalyst SDK instance to every request when the app is running
 * inside Zoho Catalyst (AppSail). Locally, initialize() throws because the
 * required Catalyst request headers/execution context aren't present, so we
 * fall back to `null` and let each service use its local-dev adapter instead.
 */
function attachCatalyst(req, res, next) {
  try {
    req.catalystApp = catalystSDK.initialize(req);
  } catch (err) {
    req.catalystApp = null;
  }
  next();
}

module.exports = { attachCatalyst };
