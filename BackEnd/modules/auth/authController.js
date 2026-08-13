const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { signAccessToken } = require("../../utils/jwt");
const { sha256, randomToken } = require("../../utils/hash");
const { getSSOPayload, logoutSSO } = require("../../services/sso.service");
const {
  getAppConfig,
  clearCache,
} = require("../../services/appConfig.service");

const {
  Employee,
  EmployeeRefreshToken,
  RoleMaster,
  EmployeeRole,
  Permission,
} = require("../../models");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const {
  encryptCookie,
  decryptCookie,
  decodeSSOToken,
} = require("../../utils/Crypto");

exports.ssoLogin = catchAsync(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      status: "fail",
      message: "Missing SSO token",
    });
  }
  const decodedToken = decodeURIComponent(token).replace(/ /g, "+");

  const decodedSSOToken = await getSSOPayload(decodedToken);
  const encryptedPayload = decodedSSOToken.payload;
  const payload = decodeSSOToken(encryptedPayload);

  if (!payload.valid) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid SSO token",
    });
  }
  const { email, userId } = payload.data;

  const user = await Employee.findOne({
    where: {
      [Op.or]: [{ email }, { email: userId }],
    },
    include: [
      {
        model: EmployeeRole,
        as: "EmployeeRoles",
        include: [
          {
            model: RoleMaster,
            as: "RoleMaster",
            include: [
              {
                model: Permission,
                attributes: ["permission_key"],
                through: { attributes: [] },
                where: {
                  action: "Show Module",
                },
                required: false,
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) {
    return res.status(403).json({
      status: "failure",
      code: "USER_NOT_REGISTERED",
      message: "Your SSO account is not registered in eHRMS.",
    });
  }

  if (!user.hr_verified) {
    return res.status(403).json({
      status: "failure",
      code: "HR_APPROVAL_PENDING",
      message: "Your account has not yet been approved by HR.",
    });
  }

  if (user.account_status !== "ACTIVE") {
    return res.status(403).json({
      status: "failure",
      code: "ACCOUNT_INACTIVE",
      message:
        "Your account has been disabled. Please contact your administrator.",
    });
  }

  const accessToken = signAccessToken(user.id);

  const refreshToken = randomToken();
  const hash = sha256(refreshToken);

  await EmployeeRefreshToken.create({
    employee_id: user.id,
    token_hash: hash,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const permissionSet = new Set();

  user.EmployeeRoles.forEach((employeeRole) => {
    employeeRole.RoleMaster?.Permissions?.forEach((permission) => {
      permissionSet.add(permission.permission_key);
    });
  });

  const permissions = [...permissionSet];

  const expiresInMs = payload.data.exp * 1000 - Date.now();
  res.cookie("sso_token", payload.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Math.max(0, expiresInMs),
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    status: "success",
    accessToken,
    user: {
      id: user.id,
      organization_id: user.organization_id,
      salutation: user.salutation,
      name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      attendance_code: user.attendance_code,
      contact_no: user.contact_no,
      email: user.email,
      employee_code: user.employee_code,
      is_active: user.is_active,
      must_change_password: user.must_change_password,
      isSuperAdmin: user.EmployeeRoles.some(
        (er) => er.RoleMaster.is_super_admin,
      ),
      role: user.EmployeeRoles.map((er) => er.RoleMaster.role_code),
      permissions,
      payload,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Employee.findOne({
    where: { email },
    include: [
      {
        model: EmployeeRole,
        as: "EmployeeRoles",
        include: [
          {
            model: RoleMaster,
            as: "RoleMaster",
            include: [
              {
                model: Permission,
                attributes: ["permission_key"],
                through: { attributes: [] },
                where: {
                  action: "Show Module",
                },
                required: false,
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.hr_verified || user.account_status !== "ACTIVE") {
    return res.status(403).json({ message: "HR approval pending" });
  }

  const accessToken = signAccessToken(user.id);

  const refreshToken = randomToken();
  const hash = sha256(refreshToken);

  await EmployeeRefreshToken.create({
    employee_id: user.id,
    token_hash: hash,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const permissionSet = new Set();

  user.EmployeeRoles.forEach((employeeRole) => {
    employeeRole.RoleMaster?.Permissions?.forEach((permission) => {
      permissionSet.add(permission.permission_key);
    });
  });

  const permissions = [...permissionSet];

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const ait = encryptCookie(currentTimestamp.toString());
  console.log("aitVal ", ait);
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    status: "success",
    accessToken,
    user: {
      id: user.id,
      organization_id: user.organization_id,
      salutation: user.salutation,
      name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      attendance_code: user.attendance_code,
      contact_no: user.contact_no,
      email: user.email,
      employee_code: user.employee_code,
      is_active: user.is_active,
      must_change_password: user.must_change_password,
      isSuperAdmin: user.EmployeeRoles.some(
        (er) => er.RoleMaster.is_super_admin,
      ),
      role: user.EmployeeRoles.map((er) => er.RoleMaster.role_code),
      permissions,
    },
    ait: ait,
  });
  //createSendToken(user, 200, res);
});

exports.refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.sendStatus(401);

  const hash = sha256(token);

  const stored = await EmployeeRefreshToken.findOne({
    where: { token_hash: hash, revoked: false },
  });

  if (!stored || stored.expires_at < new Date()) return res.sendStatus(401);

  // ROTATE refresh token
  stored.revoked = true;
  await stored.save();

  const newRefresh = randomToken();
  await EmployeeRefreshToken.create({
    employee_id: stored.employee_id,
    token_hash: sha256(newRefresh),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refresh_token", newRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const accessToken = signAccessToken(stored.employee_id);

  res.json({ accessToken });
});

exports.ssoLogout = catchAsync(async (req, res) => {
  const ssoToken = req.cookies.sso_token;
  const refreshToken = req.cookies.refresh_token;

  if (ssoToken) {
    await logoutSSO(ssoToken);
  }

  if (refreshToken) {
    await EmployeeRefreshToken.update(
      { revoked: true },
      { where: { token_hash: sha256(refreshToken) } },
    );
  }

  res.clearCookie("refresh_token");
  res.clearCookie("sso_token");

  res.json({
    status: "success",
    message: "Logged out successfully",
    redirect: `${process.env.YUKTI_PATH}/login?sid=${process.env.YUKTI_SERVICE_NAME}`,
  });
});

exports.config = catchAsync(async (req, res) => {
  const config = await getAppConfig();
  res.status(200).json({
    status: "success",
    config,
  });
});

exports.logout = catchAsync(async (req, res) => {
  const token = req.cookies.refresh_token;

  if (token) {
    await EmployeeRefreshToken.update(
      { revoked: true },
      { where: { token_hash: sha256(token) } },
    );
  }

  res.clearCookie("refresh_token");

  res.json({ message: "Logged out" });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await Employee.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: RoleMaster,
        attributes: ["role_code", "is_super_admin"],
        include: [
          {
            model: Permission,
            attributes: ["permission_key"],
            through: { attributes: [] },
            where: {
              action: "Show Module",
            },
            required: false,
          },
        ],
      },
    ],
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const roles = user.RoleMasters || [];

  const permissionSet = new Set();

  roles.forEach((role) => {
    role.Permissions?.forEach((permission) => {
      permissionSet.add(permission.permission_key);
    });
  });

  const permissions = [...permissionSet];
  const roleCodes = roles.map((role) => role.role_code);
  const isSuperAdmin = roles.some((role) => role.is_super_admin);

  res.status(200).json({
    status: "success",
    user: {
      id: user.id,
      organization_id: user.organization_id,
      salutation: user.salutation,
      name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      attendance_code: user.attendance_code,
      contact_no: user.contact_no,
      email: user.email,
      employee_code: user.employee_code,
      is_active: user.is_active,
      must_change_password: user.must_change_password,
      isSuperAdmin,
      role: roleCodes,
      permissions,
    },
  });
});
