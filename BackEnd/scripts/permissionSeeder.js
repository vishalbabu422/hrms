require("dotenv").config({ path: "./config.env" });
const sequelize = require("../utils/database");
const { Module, Permission, RoleMaster, RolePermission } = require("../models");

const seedPermissions = async () => {
    const transaction = await sequelize.transaction();

    try {
        console.log("🚀 Seeding modules and permissions...");

        /* ===============================
           1️⃣ MODULES
        =============================== */

        const modulesData = [
            { module_code: "ORGANIZATION", module_name: "Organization Management" },
            { module_code: "GST", module_name: "GST Code Management" },
            { module_code: "EMPANELMENT", module_name: "Empanelment Management" },
            { module_code: "COMPANY", module_name: "Company Management" },
            { module_code: "VENDOR", module_name: "Vendor Management" },
            { module_code: "EMPL_DES", module_name: "Empanelment Designation Management" },
            { module_code: "RESO_RATE", module_name: "Resource Rate Management" },
            { module_code: "WORKORDER", module_name: "Workorder Management" },
            { module_code: "LEAVE", module_name: "Leave Management" },
            { module_code: "MPR", module_name: "MPR Management" },
            { module_code: "EMPLOYEE", module_name: "Employee Management" },
            { module_code: "EMPLOYEE_DES", module_name: "Employee Designation Management" },
            { module_code: "EMPLOYEE_DIV", module_name: "Employee Division Management" },
            { module_code: "EMPLOYEE_EXA", module_name: "Employee Examination Management" },
            { module_code: "ROLE_PER", module_name: "Role & Permission Management" }
        ];

        await Module.bulkCreate(modulesData, {
            ignoreDuplicates: true,
            transaction
        });

        const dbModules = await Module.findAll({ transaction });

        const moduleMap = {};
        dbModules.forEach(m => {
            moduleMap[m.module_code] = m.id;
        });

        /* ===============================
           2️⃣ PERMISSIONS
        =============================== */

        const actions = ["CREATE", "READ", "UPDATE", "DELETE", "APPROVE"];

        const permissionsToInsert = [];

        for (const moduleCode in moduleMap) {
            for (const action of actions) {

                permissionsToInsert.push({
                    module_id: moduleMap[moduleCode],
                    action,
                    permission_key: `${moduleCode}.${action}`
                });
            }
        }

        await Permission.bulkCreate(permissionsToInsert, {
            ignoreDuplicates: true,
            transaction
        });

        const allPermissions = await Permission.findAll({ transaction });

        /* ===============================
           3️⃣ ASSIGN TO SAAS_ADMIN
           (organization_id = NULL for global role)
        =============================== */

        const superAdmin = await RoleMaster.findOne({
            where: { role_code: "SAAS_ADMIN" },
            transaction
        });

        if (superAdmin) {

            const orgPermissions = allPermissions.filter(p =>
                !p.permission_key.startsWith("EMPANELMENT.") &&
                !p.permission_key.startsWith("COMPANY.") &&
                !p.permission_key.startsWith("VENDOR.") &&
                !p.permission_key.startsWith("EMPL_DES.") &&
                !p.permission_key.startsWith("RESO_RATE.") &&
                !p.permission_key.startsWith("WORKORDER.") &&
                !p.permission_key.startsWith("LEAVE.") &&
                !p.permission_key.startsWith("MPR.") &&
                !p.permission_key.startsWith("EMPLOYEE_DES.") &&
                !p.permission_key.startsWith("EMPLOYEE_DIV.") &&
                !p.permission_key.startsWith("EMPLOYEE_EXA.")
            );

            const rolePerms = orgPermissions.map(p => ({
                role_id: superAdmin.id,
                permission_id: p.id,
                organization_id: null
            }));

            await RolePermission.bulkCreate(rolePerms, {
                ignoreDuplicates: true,
                transaction
            });
        }

        /* ===============================
           4️⃣ ASSIGN TO ORG_ADMIN
           (No DELETE + No PERMISSION module)
        =============================== */

        const orgAdmin = await RoleMaster.findOne({
            where: { role_code: "ORG_ADMIN" },
            transaction
        });

        if (orgAdmin) {

            const orgPermissions = allPermissions.filter(p =>
                /*!p.permission_key.endsWith(".DELETE") &&*/
                !p.permission_key.startsWith("ORGANIZATION.") &&
                !p.permission_key.startsWith("GST.")
            );

            const rolePerms = orgPermissions.map(p => ({
                role_id: orgAdmin.id,
                permission_id: p.id,
                organization_id: null
            }));

            await RolePermission.bulkCreate(rolePerms, {
                ignoreDuplicates: true,
                transaction
            });
        }

        await transaction.commit();
        console.log("✅ Permissions seeded successfully!");
        process.exit(0);

    } catch (error) {
        await transaction.rollback();
        console.error("❌ Error seeding permissions:", error);
        process.exit(1);
    }
};

seedPermissions();
