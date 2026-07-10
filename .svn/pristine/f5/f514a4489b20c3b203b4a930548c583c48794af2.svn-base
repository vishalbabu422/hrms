const { promisify } = require("util");
const jwt = require("jsonwebtoken");
//const UserDetail = require("../models/userDetail");
const Auth = require("../models/user");
const UserRoleMapping = require("../models/userRoleMapping");
const RoleMaster = require("./../models/roleMaster");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { encryptCookie, decryptCookie } = require("../utils/Crypto");

let blacklistedTokens = [];
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
 // console.log('User token ',user);
  const token = signToken(user.employee_id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  const currentTimestamp = Math.floor(Date.now() / 1000); 
    const ait = encryptCookie(currentTimestamp.toString());
    
   // const aitVal = encryptCookie(ait);

    console.log('aitVal ',ait);

  // Remove password from output
  user.pwd = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
    ait:ait
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { login_id } = req.body.user;
  const { pwd } = req.body.user;
  //Check if login and pwd exist
  if (!login_id) {
    return next(new AppError("Please provide login id and password", 400));
  }

  //Check if user exist and pwd correct
   const user = await Auth.findOne({
     where: { login_id },
     include: [
       {
         association: "UserRoleMapping",
         include: [{ association: "RoleMaster" }],
       },
     ],
   });


  if (!user) {
    return next(new AppError("Incorrect login id or password!", 401));
  }
  //If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {

 // console.log('blacklistedTokens ',blacklistedTokens);
  // res.cookie("jwt", "loggedout", {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });

  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    // Add the token to the blacklist
    blacklistedTokens.push(token);
  
    // res.status(200).json({ message: 'Logged out successfully and token invalidated' });
    return res.redirect(303, `${process.env.REACT_SSO_PATH}sso_logout.php`);
  } else {
    res.status(400).json({ message: 'Token required for logout' });
  }

};

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check of its exist
  //console.log(req.headers.authorization);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access!", 401)
    );
  }

  // Check if the token is blacklisted
  if (blacklistedTokens.includes(token)) {
    console.log('blacklistedTokens:', blacklistedTokens);
    return next(
      new AppError("Token has been invalidated (blacklisted)", 401)
    );
  }

  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await Auth.findOne({
    where: {
      employee_id: decoded.id,
    },
     include: [
      {
        association: "UserRoleMapping",
        include: [{ association: "RoleMaster" }],
      },
    ],
  });
  console.log(currentUser.UserRoleMapping.RoleMaster.role_name);
  if (!currentUser) {
    return next(
      new AppError("The user belongs to this token does no longer exist.", 401)
    );
  }

  //Grant Access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req)
    roles ['Manager/Admin','System Admin','User/Member']
     if (!req.user.UserRoleMapping.RoleMaster || !roles.includes(req.user.UserRoleMapping.RoleMaster.role_name)) {
       return next(
         new AppError("You don't have permission to perform this action", 403)
       );
     }
    next();
  };
};
