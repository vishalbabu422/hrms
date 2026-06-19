require("dotenv").config({ path: "./config.env" });

const bcrypt = require("bcrypt");
const sequelize = require("../utils/database");
const { Employee, RoleMaster, EmployeeRole } = require("../models");

async function createSaasAdmin() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected...");

    // 1️⃣ Find SAAS_ADMIN role using role_code
    const saasRole = await RoleMaster.findOne({
      where: { role_code: "SAAS_ADMIN" }
    });

    if (!saasRole) {
      console.log("❌ SAAS_ADMIN role not found in RoleMaster table.");
      process.exit(1);
    }

    // 2️⃣ Check if admin already exists
    const existing = await Employee.findOne({
      where: { email: "admin@saas.com" }
    });

    if (existing) {
      console.log("⚠ SaaS Admin already exists.");
      process.exit();
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    // 4️⃣ Create Employee
    const admin = await Employee.create({
      employee_code: "SAAS001",
      attendance_code: "SAAS001",
      password_hash: hashedPassword,
      salutation: "Mr",
      first_name: "System",
      last_name: "Administrator",
      email: "admin@saas.com",
      contact_no: "9999999999",
      date_of_joining: new Date(),
      account_status: "ACTIVE",
      hr_verified: true,
      is_active: true,
      organization_id: null
    });

    // 5️⃣ Map Employee to SAAS_ADMIN role
    await EmployeeRole.create({
      employee_id: admin.id,
      role_id: saasRole.id
    });

    console.log("🎉 SaaS Admin created successfully!");
    console.log("Email: admin@saas.com");
    console.log("Password: Admin@123");

    process.exit();
  } catch (error) {
    console.error("❌ Error creating SaaS Admin:", error);
    process.exit(1);
  }
}

createSaasAdmin();
