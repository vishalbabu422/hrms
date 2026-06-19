const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

const { generateFileHash } = require("../../../utils/fileHash");
const documentService = require("./document.service");

const { Employee } = require("../../../models");

/**
 * Upload Document (file + metadata)
 */
exports.createDocument = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;

  const employee = await Employee.findByPk(employeeId);

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  if (!req.file) {
    return next(new AppError("File is required", 400));
  }

  const filePath = req.file.path;

  const fileHash = generateFileHash(filePath);

  const payload = {
    employee_id: employeeId,
    doc_type: req.body.doc_type,

    file_name: req.file.originalname,
    file_path: filePath,
    file_size: req.file.size,
    mime_type: req.file.mimetype,

    file_hash: fileHash,

    qualification_id: req.body.qualification_id || null,
    experience_id: req.body.experience_id || null,
    bank_details_id: req.body.bank_details_id || null,
    screening_test_id: req.body.screening_test_id || null,
    training_id: req.body.training_id || null,

    remarks: req.body.remarks || null,
  };

  const document = await documentService.createDocument(payload);

  res.status(201).json({
    status: "success",
    message: "Document uploaded successfully",
    data: document,
  });
});

/**
 * Get All Employee Documents
 */
exports.getEmployeeDocuments = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const { doc_type } = req.query;
  const documents = await documentService.getEmployeeDocuments(
    employeeId,
    doc_type,
  );

  res.status(200).json({
    status: "success",
    results: documents.length,
    data: documents,
  });
});

/**
 * Get Single Document
 */
exports.getDocument = catchAsync(async (req, res, next) => {
  const { employeeId, id } = req.params;

  const document = await documentService.getDocumentById(employeeId, id);

  if (!document) {
    return next(new AppError("Document not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: document,
  });
});

/**
 * Update Document
 */
exports.updateDocument = catchAsync(async (req, res, next) => {
  const { employeeId, id } = req.params;

  const document = await documentService.getDocumentById(employeeId, id);

  if (!document) {
    return next(new AppError("Document not found", 404));
  }

  // BUILD PAYLOAD

  const payload = {
    ...req.body,
  };

  if (req.file) {
    payload.file_name = req.file.originalname;
    payload.file_path = req.file.path;
    payload.file_size = req.file.size;
    payload.mime_type = req.file.mimetype;

    payload.file_hash = generateHash(req.file.buffer);
  }

  if (payload.doc_type && payload.doc_type !== document.doc_type) {
    throw new AppError("Cannot change document type", 400);
  }

  if (req.body?.doc_type) {
    payload.doc_type = req.body?.doc_type;
  }

  await documentService.updateDocument(document, req.body);

  res.status(200).json({
    status: "success",
    message: "Document updated successfully",
  });
});

/**
 * Soft Delete Document
 */
exports.deleteDocument = catchAsync(async (req, res, next) => {
  const { employeeId, id } = req.params;

  const document = await documentService.getDocumentById(employeeId, id);

  if (!document) {
    return next(new AppError("Document not found", 404));
  }

  await documentService.deleteDocument(document);

  res.status(200).json({
    status: "success",
    message: "Document deleted successfully",
  });
});

exports.downloadDocument = catchAsync(async (req, res, next) => {
  const { employeeId, id } = req.params;
  const document = await documentService.getDocumentById(employeeId, id);

  if (!document) {
    return next(new AppError("Document not found", 404));
  }
  res.download(document.file_path, document.file_name);
});
