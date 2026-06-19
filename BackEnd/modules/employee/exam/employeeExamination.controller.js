const catchAsync = require("../../../utils/catchAsync");
const service = require("./employeeExamination.service");

exports.assignExam = catchAsync(async (req, res) => {

    await service.assignExam(req.params.employeeId, req.body);

    res.status(201).json({
        status: "success",
        message: "Examination assigned successfully"
    });
});

exports.getEmployeeExams = catchAsync(async (req, res) => {

    const records = await service.getEmployeeExams(req.params.employeeId);

    res.status(200).json({
        status: "success",
        data: records
    });
});

exports.updateEmployeeExam = catchAsync(async (req, res) => {

    await service.updateEmployeeExam(
        req.params.employeeId,
        req.params.id,
        req.body
    );

    res.status(200).json({
        status: "success",
        message: "Employee examination updated successfully"
    });
});