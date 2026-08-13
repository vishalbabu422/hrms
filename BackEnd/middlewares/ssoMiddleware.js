const NodeCache = require("node-cache");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { validateSSOSession } = require("../services/sso.service");
const { getAppConfig } = require("../services/appConfig.service");

const cache = new NodeCache({
  stdTTL: 60, // 1 minute
  checkperiod: 30,
  useClones: false,
});

exports.checkSSOSession = catchAsync(async (req, res, next) => {
  const ssoToken = req.cookies.sso_token;

  // Get application authentication configuration
  const config = await getAppConfig();

  const authMode = config?.auth_mode || "LOCAL";

  // =====================================================
  // LOCAL MODE
  // =====================================================
  // SSO validation is not required.
  if (authMode === "LOCAL") {
    return next();
  }

  // =====================================================
  // SSO / BOTH MODE
  // =====================================================
  // No SSO token:
  //
  // In SSO mode -> reject
  // In BOTH mode -> allow request to continue because
  // the user may be authenticated using local login.
  // =====================================================

  if (!ssoToken) {
    if (authMode === "SSO") {
      return res.status(401).json({
        status: "failure",
        code: "SSO_INVALID",
        tokenValid: false,
        message: "SSO token missing",
      });
    }

    // BOTH mode
    return next();
  }

  // =====================================================
  // CHECK CACHE
  // =====================================================

  const cacheKey = `sso:${ssoToken}`;

  const cached = cache.get(cacheKey);

  if (cached === true) {
    console.log("SSO token validated from cache");
    return next();
  }

  // =====================================================
  // VALIDATE TOKEN WITH SSO PROVIDER
  // =====================================================

  const result = await validateSSOSession(ssoToken);

  // =====================================================
  // INVALID / EXPIRED / REVOKED
  // =====================================================

  if (!result.tokenValid) {
    res.clearCookie("refresh_token");
    res.clearCookie("sso_token");

    cache.del(cacheKey);

    return res.status(401).json({
      status: "failure",
      code: "SSO_INVALID",
      tokenValid: false,
      expired: result.expired || false,
      message: result.message,
    });
  }

  // =====================================================
  // VALID TOKEN
  // =====================================================

  cache.set(cacheKey, true);

  req.ssoAuthenticated = true;

  next();
});
