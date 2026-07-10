const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { Employee, Organization } = require("../../models");
const sequelize = require("../../utils/database");

exports.getEmployeeList = async (queryOptions) => {
    return Employee.findAndCountAll({
        ...queryOptions,
        distinct: true
    });
};

exports.getEmployeeById = async (queryOptions) => {
    return Employee.findOne({
        ...queryOptions
    });
};

const generateDefaultPassword = () => {
    // 8 character random password
    return crypto.randomBytes(4).toString("hex");
};
const generateEmployeeCode = async (organizationId, transaction) => {

    const organization = await Organization.findByPk(organizationId, {
        attributes: ["org_code"],
        transaction
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    const orgCode = organization.org_code;

    const lastEmployee = await Employee.findOne({
        where: { organization_id: organizationId },
        attributes: ["employee_code"],
        order: [["id", "DESC"]],
        transaction
    });

    let nextNumber = 1;

    if (lastEmployee && lastEmployee.employee_code) {
        const lastNumber = parseInt(lastEmployee.employee_code.replace(orgCode, ""), 10);
        nextNumber = lastNumber + 1;
    }

    return `${orgCode}${String(nextNumber).padStart(4, "0")}`;
};

exports.createEmployee = async (payload) => {

    return await sequelize.transaction(async (t) => {

        // 1️⃣ Check duplicate email
        const existingEmail = await Employee.findOne({
            where: { email: payload.email },
            transaction: t
        });

        if (existingEmail) {
            const error = new Error("Email already exists");
            error.statusCode = 400;
            throw error;
        }

        // 3️⃣ Generate default password
        const defaultPassword = "Welcome@123";//generateDefaultPassword();

        const hashedPassword = await bcrypt.hash(defaultPassword, 12);

        // const employeeCode = await generateEmployeeCode(payload.organization_id, t);

        // 4️⃣ Create employee
        const employee = await Employee.create({
            ...payload,
            password_hash: hashedPassword,
            account_status: "ACTIVE",
            must_change_password: true
        }, { transaction: t });

        // 5️⃣ Remove password hash from response
        employee.password_hash = undefined;

        // 6️⃣ Return employee + temp password (for HR to share or email)
        return {
            employee,
            temporaryPassword: defaultPassword
        };
    });
};

exports.deleteEmployeeById = async (id, user, isSuperAdmin) => {

    const whereCondition = {
        id,
        is_deleted: false
    };

    // Restrict org if not super admin
    if (!isSuperAdmin) {
        whereCondition.organization_id = user.organization_id;
    }

    const employee = await Employee.findOne({
        where: whereCondition
    });

    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }

    await employee.update({
        is_deleted: true,
        is_active: false,
        account_status: "EXITED",
        date_of_exit: new Date()
    });

    return true;
};

exports.updateEmployeeById = async (id, payload, user, isSuperAdmin) => {

    return await sequelize.transaction(async (t) => {

        const whereCondition = {
            id,
            is_deleted: false
        };

        if (!isSuperAdmin) {
            whereCondition.organization_id = user.organization_id;
        }

        const employee = await Employee.findOne({
            where: whereCondition,
            transaction: t
        });

        if (!employee) {
            const error = new Error("Employee not found");
            error.statusCode = 404;
            throw error;
        }

        // 🚫 Prevent restricted fields update
        delete payload.password_hash;
        delete payload.employee_code;
        delete payload.organization_id;
        delete payload.is_deleted;
        delete payload.account_status;

        // 🔁 Check duplicate email (if updating)
        if (payload.email && payload.email !== employee.email) {
            const existingEmail = await Employee.findOne({
                where: { email: payload.email },
                transaction: t
            });

            if (existingEmail) {
                const error = new Error("Email already exists");
                error.statusCode = 400;
                throw error;
            }
        }

        await employee.update(payload, { transaction: t });

        return employee;
    });
};

exports.updateEmployeeStatus = async (id, payload, user, isSuperAdmin) => {

    const whereCondition = {
        id
    };

    if (!isSuperAdmin) {
        whereCondition.organization_id = user.organization_id;
    }

    const employee = await Employee.findOne({
        where: whereCondition
    });

    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }

    // Allowed status transitions
    const allowedStatuses = ["PENDING", "ACTIVE", "REJECTED", "EXITED"];

    if (payload.account_status && !allowedStatuses.includes(payload.account_status)) {
        const error = new Error("Invalid account status");
        error.statusCode = 400;
        throw error;
    }

    const updateData = {};

    if (payload.account_status) {
        updateData.account_status = payload.account_status;
    }

    if (payload.account_status === "ACTIVE") {
        updateData.hr_verified = true;
        updateData.verified_by = user.id;
        updateData.verified_at = new Date();
        updateData.is_active = true;
        updateData.is_deleted = false;
    }

    if (payload.account_status === "EXITED") {
        updateData.is_active = false;
        updateData.date_of_exit = new Date();
    }

    await employee.update(updateData);

    return employee;
}; 


exports.generateEmployeeCodePreview = async (
  organizationId
) => {
  const organization = await Organization.findByPk(
    organizationId,
    {
      attributes: ["org_code"],
    }
  );

  if (!organization) {
    throw new Error("Organization not found");
  }

  const maxEmployeeId = await Employee.max("id");

  const nextEmployeeId = (maxEmployeeId || 0) + 1;

  const now = new Date();

  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `${organization.org_code}/${month}${year}/${nextEmployeeId}`;
};
