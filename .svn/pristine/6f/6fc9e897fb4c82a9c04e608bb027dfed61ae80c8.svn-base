const catchAsync = require("../../../utils/catchAsync");
const FamilyService = require("./family.service");
const sequelize = require("../../../utils/database");

// Get Address By ID
const getFamilyById = catchAsync(async (req, res, next) => {
      const whereCondition = {
         employee_id: req.params.employeeId 
     };

    const result = await FamilyService.getById({where: whereCondition});
    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No family details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });
});

const assignFamilyMember = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    await sequelize.transaction(async (t) => {
        await FamilyService.assignFamilyMember(employeeId, req.body, t);
    });

    res.status(201).json({
        status: "success",
        message: "Family Member assigned successfully"
    });
});

const updateFamilyMember = catchAsync(async (req, res, next) => {
    const { employeeId ,familyMemberId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await FamilyService.updateFamilyMember(
            employeeId,
            familyMemberId,
            req.body,
            t
        );
    });

    res.status(200).json({
        status: "success",
        data: result
    });
});
const deleteFamilyMember = catchAsync(async (req, res, next) => {

    const { employeeId ,familyMemberId } = req.params;

     const result = await sequelize.transaction(async (t) => {

        return await FamilyService.deleteFamilyMember(
            employeeId,
            familyMemberId,
            req.body,
            t
        );
    });

    res.status(200).json({
        status: "success",
        message: "Family Member removed from primary successfully",
        data: result
    });
});

module.exports = {
 getFamilyById,
 assignFamilyMember,
 updateFamilyMember,
 deleteFamilyMember
};