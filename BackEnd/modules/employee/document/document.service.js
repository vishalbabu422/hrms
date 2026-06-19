const { Document } = require("../../../models");

exports.createDocument = (payload) => {
  return Document.create(payload);
};

exports.getEmployeeDocuments = (employeeId, doc_type) => {
  const where = {
    employee_id: employeeId,
    is_deleted: false,
  };

  // Add condition only if doc_type exists
  if (doc_type !== null && doc_type !== undefined) {
    where.doc_type = doc_type;
  }

  return Document.findAll({
    where,
    order: [["created_at", "DESC"]],
  });
};

exports.getDocumentById = (employeeId, id) => {
  return Document.findOne({
    where: {
      id,
      employee_id: employeeId,
      is_deleted: false,
    },
  });
};

exports.updateDocument = (document, payload) => {
  return document.update(payload);
};

exports.deleteDocument = (document) => {
  return document.update({
    is_deleted: true,
  });
};
