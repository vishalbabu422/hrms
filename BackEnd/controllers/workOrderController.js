const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeature");
const path = require("path");
const fs = require("fs");

// Model
const WorkOrder = require("../models/workOrder");
const { Op } = require("sequelize");
const WoDesgnMapping = require("../models/woDesgnMapping");
const GstCodeMaster = require("../models/gstCodeMaster");
const Designation = require("../models/designation");

// Get Work Order List (Index)
const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query, WorkOrder)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  if (!features.query.where) features.query.where = {};

  if (req.query.search && req.query.search.trim().length >= 3) {
    const search = req.query.search.trim();

    features.query.where[Op.or] = [
      { work_order_no: { [Op.iLike]: `%${search}%` } },
      { project_name: { [Op.iLike]: `%${search}%` } },
      { issued_to_name: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: workOrderList, count } = await WorkOrder.findAndCountAll({
    ...features.query,

    include: [
      {
        association: "WoDesgnMappings",
        where: {
          is_active: true,
        },
        required: false,
        separate: true,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    message: "Get Work Order List!",
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    results: workOrderList.length,
    data: { workOrderList },
  });
});

// Get Work Order By ID
const dataById = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query).join();

  const { id } = req.params;
  const { is_active } = req.query;

  if (!features.query.where) features.query.where = {};
  features.query.where = { id };

  if (is_active !== undefined) {
    features.query.where.is_active = is_active === "true";
  }

  const workOrder = await WorkOrder.findOne({
    ...features.query,
  });

  if (!workOrder) {
    return res.status(404).json({
      status: "fail",
      message: "Work Order not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: workOrder,
  });
});

// Create Work Order
const create = catchAsync(async (req, res, next) => {
  const payload = req.body;

  //  Duplicate check (work_order_no unique)
  const existing = await WorkOrder.findOne({
    where: {
      work_order_no: payload.work_order_no,
      is_active: true,
    },
  });

  if (existing) {
    return res.status(409).json({
      status: "fail",
      message: "Work Order number already exists",
    });
  }

  if (!req.isSuperAdmin) {
    req.body.organization_id = req.user.organization_id;
  }

  if (req.file) {
    payload.doc_path = `/uploads/workorder/${req.file.filename}`;
  }

  const workOrder = await WorkOrder.create({
    ...payload,
    is_active: true,
    created: new Date(),
    modified: new Date(),
  });

  res.status(201).json({
    status: "success",
    data: workOrder,
  });
});

// Edit Work Order
const edit = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  if (req.file) {
    updates.doc_path = `/uploads/workorder/${req.file.filename}`;
  }

  const workOrder = await WorkOrder.findByPk(id);

  if (!workOrder) {
    return res.status(404).json({
      status: "fail",
      message: "Work Order not found",
    });
  }

  const whereCondition = {
    empanelment_no: updates.empanelment_no,
    is_active: true,
  };

  if (!req.isSuperAdmin) {
    whereCondition.organization_id = req.user.organization_id;
  }

  // Duplicate check only if work_order_no changing
  if (
    updates.work_order_no &&
    updates.work_order_no !== workOrder.work_order_no
  ) {
    const duplicate = await WorkOrder.findOne({
      where: {
        work_order_no: updates.work_order_no,
        is_active: true,
      },
    });

    if (duplicate && duplicate.id !== workOrder.id) {
      return res.status(409).json({
        status: "fail",
        message: "Work Order number already exists",
      });
    }
  }

  await workOrder.update({
    ...updates,
    modified: new Date(),
  });

  res.status(200).json({
    status: "success",
    data: workOrder,
  });
});

// Soft Delete Work Order
const deleteById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const workOrder = await WorkOrder.findByPk(id);

  if (!workOrder) {
    return res.status(404).json({
      status: "fail",
      message: "Work Order not found",
    });
  }

  if (workOrder.is_active === false) {
    return res.status(409).json({
      status: "fail",
      message: "Work Order already inactive",
    });
  }

  await workOrder.update({
    is_active: false,
    modified: new Date(),
  });

  return res.status(200).json({
    status: "success",
    message: "Work Order deleted successfully",
  });
});

const download = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const workorder = await WorkOrder.findByPk(id, {
    attributes: ["id", "doc_path"],
  });

  if (!workorder) {
    return res.status(404).json({
      status: "fail",
      message: "Work Order not found",
    });
  }

  if (!workorder.doc_path) {
    return res.status(404).json({
      status: "fail",
      message: "No document uploaded for this work order",
    });
  }

  // to absolute server path
  const filePath = path.join(
    process.cwd(),
    workorder.doc_path.replace(/^\/+/, ""),
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "fail",
      message: "File not found",
    });
  }

  return res.download(filePath, path.basename(filePath));
});

module.exports = {
  index,
  dataById,
  create,
  edit,
  deleteById,
  download,
};
