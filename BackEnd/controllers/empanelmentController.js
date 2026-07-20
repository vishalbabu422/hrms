const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeature");
const path = require("path");
const fs = require("fs");

// Models
const { CompanyMaster, EmpanelmentMaster } = require("../models");
const { Op } = require("sequelize");
// Get Empanelment List (Index)

const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();
  
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  // safety: where clause ensure
  if (!features.query.where) features.query.where = {};

  if (req.query.search && req.query.search.trim().length >= 3) {
    const search = req.query.search.trim();

    features.query.where[Op.or] = [
      { empanelment_no: { [Op.iLike]: `%${search}%` } },
      { shortcode: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: EmpanelmentList, count } =
    await EmpanelmentMaster.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: "Get Empanelment List!",
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    results: EmpanelmentList.length,
    data: { EmpanelmentList },
  });
});

//  Get Empanelment By ID
const dataById = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  const { id } = req.params;
  const { is_active } = req.query;

  if (!features.query.where) features.query.where = {};
  features.query.where = { id };

  if (is_active !== undefined) {
    features.query.where.is_active = is_active === "true";
  }

  const empanelment = await EmpanelmentMaster.findOne({
    ...features.query,
    include: [
      {
        model: CompanyMaster,
        as: "CompanyMaster",
      },
    ],
  });

  if (!empanelment) {
    return res.status(404).json({
      status: "fail",
      message: "Empanelment not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: empanelment,
  });
});

const create = catchAsync(async (req, res, next) => {
  const payload = req.body;

  // prevent duplicate active empanelment
  const existing = await EmpanelmentMaster.findOne({
    where: {
      empanelment_no: payload.empanelment_no,
      is_active: true,
    },
  });

  if (existing) {
    return res.status(409).json({
      status: "fail",
      message: "Empanelment already exists",
    });
  }

  if (!req.isSuperAdmin) {
    req.body.organization_id = req.user.organization_id;
  }
    //  Upload file path save karo
  if (req.file) {
      payload.doc_path = `/uploads/empanelment/${req.file.filename}`;
  }
  const empanelment = await EmpanelmentMaster.create({
    ...payload,
    is_active: true,
    created: new Date(),
    modified: new Date(),
  });

  res.status(201).json({
    status: "success",
    data: empanelment,
  });
});

const edit = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

   // Upload file path save karo
  if (req.file) {
    updates.doc_path = `/uploads/empanelment/${req.file.filename}`;
  }
  const empanelment = await EmpanelmentMaster.findByPk(id);

  if (!empanelment) {
    return res.status(404).json({
      status: "fail",
      message: "Empanelment not found",
    });
  }

  const whereCondition = {
    empanelment_no: updates.empanelment_no,
    is_active: true,
  };

  if (!req.isSuperAdmin) {
    whereCondition.organization_id = req.user.organization_id;
  }

  //  Duplicate active check ONLY if empanelment_no is changing
  if (
    updates.empanelment_no &&
    updates.empanelment_no !== empanelment.empanelment_no
  ) {
    const duplicate = await EmpanelmentMaster.findOne({
      where: whereCondition,
    });

    if (duplicate && duplicate.id !== empanelment.id) {
      return res.status(409).json({
        status: "fail",
        message: "Empanelment already exists",
      });
    }
  }

  // Apply updates
  await empanelment.update({
    ...updates,
    modified: new Date(),
  });

  res.status(200).json({
    status: "success",
    data: empanelment,
  });
});

const deleteById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check record exists
  const empanelment = await EmpanelmentMaster.findByPk(id);

  if (!empanelment) {
    return res.status(404).json({
      status: "fail",
      message: "Empanelment not found",
    });
  }

  // Prevent double delete
  if (empanelment.is_active === false) {
    return res.status(409).json({
      status: "fail",
      message: "Empanelment is already inactive",
    });
  }

  // Soft delete
  await empanelment.update({
    is_active: false,
    modified: new Date(),
    effective_to: new Date(),
  });

  return res.status(200).json({
    status: "success",
    message: "Empanelment deleted successfully",
  });
});

const download = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const empanelment = await EmpanelmentMaster.findByPk(id, {
    attributes: ["id", "doc_path"],
  });

  if (!empanelment) {
    return res.status(404).json({
      status: "fail",
      message: "Empanelment not found",
    });
  }

  if (!empanelment.doc_path) {
    return res.status(404).json({
      status: "fail",
      message: "No document uploaded for this empanelment",
    });
  }

  // Convert "/uploads/empanelment/file.pdf"
  // to absolute server path
  const filePath = path.join(process.cwd(), empanelment.doc_path.replace(/^\/+/, ""));

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "fail",
      message: "File not found",
    });
  }

  return res.download(
    filePath,
    path.basename(filePath)
  );
});
module.exports = {
  index,
  dataById,
  create,
  edit,
  deleteById,
  download,
};
