const { EmployeeFamilyMember,Employee } = require("../../../models");
const AppError = require("../../../utils/appError");
const sequelize = require("../../../utils/database");

exports.getById = async (queryOptions) => {
    return await EmployeeFamilyMember.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};

exports.assignFamilyMember = async (employeeId, familyData, transaction) => {

    // Check employee exists
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

    // Only restrict these relations
    const restrictedRelations = ["FATHER", "MOTHER", "SPOUSE"];

    if (restrictedRelations.includes(familyData.relation)) {

        const existingFamilyMember = await EmployeeFamilyMember.findOne({
            where: {
                employee_id: employeeId,
                relation: familyData.relation
            },
            transaction
        });

    if (existingFamilyMember) {
        throw new AppError("Family Member already exists for this employee", 409);
    }
    }

    // Create only
    return await EmployeeFamilyMember.create(
        {
            ...familyData,
            employee_id: employeeId
        },
        { transaction }
    );
};

exports.updateFamilyMember = async (employeeId, familyMemberId, familyData, transaction) => {

    const family = await EmployeeFamilyMember.findOne({
        where: {
            id: familyMemberId,
            employee_id: employeeId
        },
        transaction
    });

    if (!family) {
        throw new AppError("family member not found", 404);
    }

    return await family.update(familyData, { transaction });
};
exports.deleteFamilyMember = async (employeeId, familyMemberId, transaction) => {

    const family = await EmployeeFamilyMember.findOne({
        where: {
            id: familyMemberId,
            employee_id: employeeId
        },
        transaction
    });

    if (!family) {
        throw new AppError("Family Member not found", 404);
    }

    return await family.update(
        {
            is_dependent: false
        },
        { transaction }
    );
};