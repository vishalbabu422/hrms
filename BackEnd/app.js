const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");
const adminRouter = require("./routes/adminRoutes");
const authRoutes = require("./modules/auth/authRoutes");
const employeeModule = require("./modules/employee/index");
const rolesRoutes = require("./modules/role/role.routes");
const moduleRoute = require("./modules/module/module.routes");
const salaryRoute = require("./modules/salary/index");
const stateMaster = require("./modules/stateMaster/stateMaster.routes");
const districtMaster = require("./modules/districtMaster/districtMaster.routes");

const path = require("path");

// DB CONNECTION
const sequelize = require("./utils/database");
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const app = express(),
  fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { RoleMaster } = require("./models");
const customCss = fs.readFileSync(process.cwd() + "/swagger.css", "utf8");

// 1. MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL "http://localhost:3000"
    credentials: true, // allow cookies
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Calcutta",
  };
  //toLocaleString('en-IN', options)
  req.requestTime = new Date().toLocaleString("en-IN", options);
  next();
});

app.use(compression()); //Compress all routes
app.use(helmet());

// 3. ROUTER
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss,
    explorer: true,
    swaggerOptions: {
      docExpansion: "none",
    },
  }),
);
app.get("/", (req, res) => {
  res.send("Welcome to PMU 1.0 API Server.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", employeeModule);
app.use("/api/v1/", rolesRoutes);
app.use("/api/v1/modules", moduleRoute);
app.use("/api/v1/", salaryRoute);
app.use("/api/v1/state", stateMaster);
app.use("/api/v1/district", districtMaster);

app.use(globalErrorHandler);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// EXPORT app to server.js
module.exports = app;
