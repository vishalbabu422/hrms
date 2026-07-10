const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../../utils/apiFeature");
const AppError = require("../../../utils/appError");

const DesignationService = require("./designation.service");

exports.create = catchAsync(async (req, res, next) => {
    if (req.isSuperAdmin) {
        if (!req.body.organization_id) {
            throw new AppError("organization_id is required", 400);
        }
    } else {
        req.body.organization_id = req.user.organization_id;
    }

    const result = await DesignationService.create(req.body);

    res.status(201).json({
        status: "success",
        message: "Designation created successfully",
        data: result
    });

});

exports.findAll = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(req.query, ["designation_name", "designation_code"])
        .filter()
        .search()
        .sort()
        .limitFields()
        .join()
        .paginate();

    features.query.where = features.query.where || {};

    if (!req.isSuperAdmin) {
        features.query.where = {
            ...features.query.where,
            organization_id: req.user.organization_id
        };
    }

    const result = await DesignationService.findAll(features.query);

    res.status(200).json({
        status: "success",
        message: "Get All Designation",
        total: result.count,
        data: result.rows,
    });
});

exports.findById = catchAsync(async (req, res, next) => {
    const whereCondition = {
        id: req.params.id
    };

    // If not super admin, restrict to same organization
    if (!req.isSuperAdmin) {
        whereCondition.organization_id = req.user.organization_id;
    }

    const result = await DesignationService.findById({ where: whereCondition });


    if (!result) {
        return res.status(404).json({
            status: "fail",
            message: "Designation not found"
        });
    }

    res.status(200).json({
        status: "success",
        message: "Get Designation",
        data: result
    });

});

exports.update = catchAsync(async (req, res, next) => {
    const result = await DesignationService.update(
        req.params.id,
        req.body,
        req.user,
        req.isSuperAdmin
    );
    if (!result) {
        throw new AppError("Designation not found", 404);
    }
    res.status(200).json({
        status: "success",
        message: "Designation updated successfully",
        data: result
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    const result = await DesignationService.delete(
        req.params.id,
        req.user,
        req.isSuperAdmin
    );

    if (!result) {
        throw new AppError("Designation not found", 404);
    }

    res.status(200).json({
        status: "success",
        message: "Designation deleted successfully"
    });
});
