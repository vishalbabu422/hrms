const fs = require("fs");
const path = require("path");
const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../../utils/apiFeature");
const PbgMasterService = require("./pbgMaster.service");

// Get PBG List
const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  if (!features.query.where) {
    features.query.where = {};
  }

  const { rows, count } = await PbgMasterService.index(
    features.query
  );

  res.status(200).json({
    status: "success",
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    results: rows.length,
    data: {
      pbgList: rows,
    },
  });
});

// Get Workorder PBG by PBG ID
const dataByPbgId = catchAsync(async (req, res, next) => {
  const { pbg_id } = req.params;

  const result = await PbgMasterService.dataByPbgId(pbg_id);

  if (!result || result.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "Workorder PBG not found",
    });
  }

  res.status(200).json({
    status: "success",
    results: result.length,
    data: {
      workorderPbgList: result,
    },
  });
});
// Create PBG Master and Workorder PBG 
const create = catchAsync(async (req, res, next) => { 
    const result = await PbgMasterService.create(req.body);
     res.status(201).json({
         status: "success", 
         message: "PBG created successfully", 
         data: { 
            pbg: result.pbg, 
            workorderPbg: result.workorderPbg,
         },
        });
    });

// Update PBG Master
const update = catchAsync(async (req, res, next) => {
  const { pbg_id } = req.params;

  const result = await PbgMasterService.update(
    pbg_id,
    req.body
  );

  res.status(200).json({
    status: "success",
    message: "PBG updated successfully",
    data: {
      pbg: result,
    },
  });
});

// Soft Delete PBG
const deletePbg = catchAsync(async (req, res, next) => {
  const { pbg_id } = req.params;

  await PbgMasterService.deletePbg(pbg_id);

  res.status(200).json({
    status: "success",
    message: "PBG deleted successfully",
  });
});

// Calculate Work Order Total Amount
const calculateWorkOrderTotal = catchAsync(async (req, res, next) => {
    const { work_order_ids } = req.body;

    const result =
      await PbgMasterService.calculateWorkOrderTotal(
        work_order_ids
      );

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);

// Upload PBG PDF
const uploadPbgDocument = catchAsync(async (req, res) => {
  const { pbg_id } = req.params;

  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "PBG PDF file is required",
    });
  }

  const result = await PbgMasterService.uploadPbgDocument(
    pbg_id,
    req.file.path
  );

  res.status(200).json({
    status: "success",
    message: "PBG document uploaded successfully",
    data: {
      pbg_id: result.id,
      pbg_no: result.pbg_no,
      pbg_upload_path: result.pbg_upload_path,
    },
  });
});

// Download PBG PDF
const downloadPbgDocument = catchAsync(async (req, res) => {
  const { pbg_id } = req.params;

  const pbg = await PbgMasterService.getPbgDocument(pbg_id);

  if (!pbg) {
    return res.status(404).json({
      status: "fail",
      message: "PBG not found",
    });
  }

  if (!pbg.pbg_upload_path) {
    return res.status(404).json({
      status: "fail",
      message: "PBG document not found",
    });
  }

  const uploadRoot = path.resolve(process.cwd(), "uploads");
  const filePath = path.resolve(
    process.cwd(),
    pbg.pbg_upload_path.replace(/^[/\\]+/, "")
  );

  const relativePath = path.relative(uploadRoot, filePath);

  // Ensure file path is within uploads directory
  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid document path",
    });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "fail",
      message: "PBG file not found on server",
    });
  }

  return res.download(filePath, path.basename(filePath));
});

module.exports = {
  index,
  dataByPbgId,
  create,
  update,
  deletePbg,
  calculateWorkOrderTotal,
  uploadPbgDocument,
  downloadPbgDocument,
  
};