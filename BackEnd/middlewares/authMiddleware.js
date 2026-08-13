const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { verifyToken } = require("../utils/jwt");
const { Employee, RoleMaster, Permission } = require("../models");

// ================= PROTECT =================
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "failure",
      code: "ACCESS_TOKEN_MISSING",
      message: "You are not logged in!",
    });
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "failure",
        code: "ACCESS_TOKEN_EXPIRED",
        message: "Access token expired",
      });
    }

    return res.status(401).json({
      status: "failure",
      code: "INVALID_ACCESS_TOKEN",
      message: "Invalid access token",
    });
  }

  // 🔥 Minimal attributes → performance boost
  const currentUser = await Employee.findByPk(decoded.id, {
    attributes: ["id", "organization_id"],
    include: [
      {
        model: RoleMaster,
        attributes: ["role_code", "is_super_admin"],
        include: [
          {
            model: Permission,
            attributes: ["permission_key"],
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

  if (!currentUser) {
    return res.status(401).json({
      status: "failure",
      code: "USER_NOT_FOUND",
      message: "User no longer exists",
    });
  }

  const roles = currentUser.RoleMasters || [];

  // ✅ Use Set (optimized)
  const permissionSet = new Set();

  roles.forEach((role) => {
    role.Permissions?.forEach((p) => {
      permissionSet.add(p.permission_key);
    });
  });

  const isSuperAdmin = roles.some((r) => r.is_super_admin);

  req.user = currentUser;
  res.locals.user = currentUser;

  req.userRoles = roles.map((r) => r.role_code);
  req.userPermissions = [...permissionSet];
  req.isSuperAdmin = isSuperAdmin;
  next();
});

// ================= ROLE CHECK =================
exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.isSuperAdmin) return next();

    const hasRole = req.userRoles?.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return next(new AppError("Access denied (role)", 403));
    }

    next();
  };
};

// ================= PERMISSION CHECK =================
exports.checkPermission = (permissionKey) => {
  return (req, res, next) => {
    if (req.isSuperAdmin) return next();

    if (!req.userPermissions?.includes(permissionKey)) {
      return next(new AppError("Permission denied", 403));
    }

    next();
  };
};

// ================= ORG SCOPE =================
exports.checkOrgScope = (getOrgIdFromRequest) => {
  return (req, res, next) => {
    if (req.isSuperAdmin) return next();

    if (typeof getOrgIdFromRequest !== "function") {
      return next(new AppError("Org resolver missing", 500));
    }

    const targetOrgId = getOrgIdFromRequest(req);

    if (!targetOrgId) {
      return next(new AppError("Organization ID required", 400));
    }

    if (Number(req.user.organization_id) !== Number(targetOrgId)) {
      return next(new AppError("Org access denied", 403));
    }

    next();
  };
};

// ================= EMPLOYEE ORG CHECK =================
exports.checkEmployeeOrgScope = catchAsync(async (req, res, next) => {
  if (req.isSuperAdmin) return next();

  const { employeeId } = req.params;

  const employee = await Employee.findByPk(employeeId, {
    attributes: ["id", "organization_id"],
  });

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  if (Number(employee.organization_id) !== Number(req.user.organization_id)) {
    return next(new AppError("Access denied", 403));
  }

  req.employee = employee;

  next();
});

// ================= AUTO ORG FILTER =================
exports.injectOrgScope = () => {
  return (req, res, next) => {
    if (!req.isSuperAdmin) {
      req.orgScopeFilter = {
        organization_id: req.user.organization_id,
      };
    }

    next();
  };
};
