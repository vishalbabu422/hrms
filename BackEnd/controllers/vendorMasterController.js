const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeature");

// Model

const VendorMaster = require("../models/vendorMaster");
const { Op } = require("sequelize");

// Get Vendor List (Index)
const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
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
      { vendor_name: { [Op.iLike]: `%${search}%` } },
      { vendor_code: { [Op.iLike]: `%${search}%` } },
      { contact_email: { [Op.iLike]: `%${search}%` } },
      { contact_phone: { [Op.iLike]: `%${search}%` } },
      { city: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: vendorList, count } = await VendorMaster.findAndCountAll(
    features.query,
  );

  res.status(200).json({
    status: "success",
    message: "Get Vendor List!",
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    results: vendorList.length,
    data: { vendorList },
  });
});

// Get Vendor By ID
const dataById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { is_active } = req.query;

  const where = { id };

  if (is_active !== undefined) {
    where.is_active = is_active === "true";
  }

  const vendor = await VendorMaster.findOne({ where });

  if (!vendor) {
    return res.status(404).json({
      status: "fail",
      message: "Vendor not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: vendor,
  });
});

// Create Vendor
const create = catchAsync(async (req, res, next) => {
  const payload = req.body;

  // Duplicate check (vendor_code unique)
  if (payload.vendor_code) {
    const existing = await VendorMaster.findOne({
      where: {
        vendor_code: payload.vendor_code,
        is_active: true,
      },
    });

    if (existing) {
      return res.status(409).json({
        status: "fail",
        message: "Vendor code already exists",
      });
    }
  }

  if (!req.isSuperAdmin) {
    req.body.organization_id = req.user.organization_id;
  }

  const vendor = await VendorMaster.create({
    ...payload,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  res.status(201).json({
    status: "success",
    data: vendor,
  });
});

// Edit Vendor
const edit = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const vendor = await VendorMaster.findByPk(id);

  if (!vendor) {
    return res.status(404).json({
      status: "fail",
      message: "Vendor not found",
    });
  }

  const whereCondition = {
    vendor_code: updates.vendor_code,
    is_active: true,
  };

  if (!req.isSuperAdmin) {
    whereCondition.organization_id = req.user.organization_id;
  }

  // Duplicate check only if vendor_code changing
  if (updates.vendor_code && updates.vendor_code !== vendor.vendor_code) {
    const duplicate = await VendorMaster.findOne({
      where: whereCondition,
    });

    if (duplicate && duplicate.id !== vendor.id) {
      return res.status(409).json({
        status: "fail",
        message: "Vendor code already exists",
      });
    }
  }

  await vendor.update({
    ...updates,
    updated_at: new Date(),
  });

  res.status(200).json({
    status: "success",
    data: vendor,
  });
});

// Soft Delete Vendor
const deleteById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const vendor = await VendorMaster.findByPk(id);

  if (!vendor) {
    return res.status(404).json({
      status: "fail",
      message: "Vendor not found",
    });
  }

  if (vendor.is_active === false) {
    return res.status(409).json({
      status: "fail",
      message: "Vendor already inactive",
    });
  }

  await vendor.update({
    is_active: false,
    updated_at: new Date(),
  });

  return res.status(200).json({
    status: "success",
    message: "Vendor deleted successfully",
  });
});

module.exports = {
  index,
  dataById,
  create,
  edit,
  deleteById,
};
