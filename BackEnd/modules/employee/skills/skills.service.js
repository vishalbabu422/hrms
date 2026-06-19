const { EmployeeSkill, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


exports.getSkillById = async (queryOptions) => {
    return await EmployeeSkill.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};


exports.assignSkill = async (employeeId, skillData, transaction) => {

    // Check employee exists
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

    // Check duplicate skill
    const existingSkill = await EmployeeSkill.findOne({
        where: {
            employee_id: employeeId,
            skill_name: skillData.skill_name
        },
        transaction
    });

    if (existingSkill) {
        throw new AppError("This skill already exists for this employee", 400);
    }

    return await EmployeeSkill.create(
        {
            ...skillData,
            employee_id: employeeId
        },
        { transaction }
    );
};


exports.updateSkill = async (employeeId, skillId, skillData, transaction) => {

    const skill = await EmployeeSkill.findOne({
        where: {
            id: skillId,
            employee_id: employeeId
        },
        transaction
    });

    if (!skill) {
        throw new AppError("Skill not found", 404);
    }

    // Prevent duplicate skill name
    if (skillData.skill_name) {

        const duplicateSkill = await EmployeeSkill.findOne({
            where: {
                employee_id: employeeId,
                skill_name: skillData.skill_name
            },
            transaction
        });

        if (duplicateSkill && duplicateSkill.id !== skillId) {
            throw new AppError("This skill already exists for this employee", 400);
        }

    }

    return await skill.update(skillData, { transaction });
};