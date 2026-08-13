const { AppSettings } = require("../models");

let cache = null;
let lastLoaded = 0;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

exports.getAppConfig = async () => {
  if (cache && Date.now() - lastLoaded < CACHE_TTL) {
    return cache;
  }

  cache = await AppSettings.findOne({
    where: { id: 1 },
    attributes: [
      "auth_mode",
      "sso_provider",
      "sso_login_url",
      "sso_portal_url",
      "enable_sso_validation",
    ],
    raw: true,
  });

  lastLoaded = Date.now();

  return cache;
};

exports.clearCache = () => {
  cache = null;
  lastLoaded = 0;
};
