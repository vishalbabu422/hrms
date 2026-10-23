const { Op } = require("sequelize");
const sequelize = require("../../../utils/database");
const { WorkorderPbg,PbgMaster,WorkOrder } = require("../../../models");

// Get PBG List
exports.index = async (queryOptions) => {
  return await PbgMaster.findAndCountAll({
    ...queryOptions,

    attributes: [
      "pbg_no",
      "start_date",
      "end_date",
      "nicsi_reg_no",
      "is_active",
    ],
  });
};

// Get Workorder PBG by PBG ID
exports.dataByPbgId = async (pbg_id) => {
  return await WorkorderPbg.findAll({
    where: {
      pbg_id: pbg_id,
      is_active: true,
    },

    include: [
      {
        model: PbgMaster,
        as: "pbg",
        attributes: [
          "id",
          "pbg_no",
          "start_date",
          "end_date",
          "amount",
          "nicsi_reg_no",
          "nicsi_reg_date",
          "bank_charges",
          "pbg_upload_path",
          "is_active",
          "created",
          "updated_at",
        ],
      },
    ],

    order: [["id", "ASC"]],
  });
};

// Create PBG Master and Workorder PBG
exports.create = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    // Create PBG Master
    const pbg = await PbgMaster.create(
      {
        pbg_no: data.pbg_no,
        start_date: data.start_date,
        end_date: data.end_date,
        amount: data.amount,
        nicsi_reg_no: data.nicsi_reg_no,
        nicsi_reg_date: data.nicsi_reg_date,
        bank_charges: data.bank_charges,
        pbg_upload_path: data.pbg_upload_path,
        is_active: data.is_active,
      },
      {
        transaction,
      }
    );

    // Create Workorder PBG
    const workorderPbg = await WorkorderPbg.create(
      {
        pbg_id: pbg.id,
        wo_id: data.wo_id,
        is_active: true,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return {
      pbg,
      workorderPbg,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Update PBG Master
exports.update = async (pbg_id, data) => {
  const pbg = await PbgMaster.findByPk(pbg_id);

  if (!pbg) {
    const error = new Error("PBG not found");
    error.statusCode = 404;
    throw error;
  }

  await pbg.update({
    pbg_no: data.pbg_no,
    start_date: data.start_date,
    end_date: data.end_date,
    amount: data.amount,
    nicsi_reg_no: data.nicsi_reg_no,
    nicsi_reg_date: data.nicsi_reg_date,
    bank_charges: data.bank_charges,
    pbg_upload_path: data.pbg_upload_path,
    is_active: data.is_active,
  });

  return pbg;
};

// Soft Delete PBG
exports.deletePbg = async (pbg_id) => {
  const transaction = await sequelize.transaction();

  try {
    const pbg = await PbgMaster.findByPk(pbg_id, {
      transaction,
    });

    if (!pbg) {
      const error = new Error("PBG not found");
      error.statusCode = 404;
      throw error;
    }

    // Soft delete PBG Master
    await pbg.update(
      {
        is_active: false,
      },
      {
        transaction,
      }
    );

    // Soft delete Workorder PBG mappings
    await WorkorderPbg.update(
      {
        is_active: false,
      },
      {
        where: {
          pbg_id: pbg_id,
        },
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

// Calculate Work Order Total Amount
exports.calculateWorkOrderTotal = async (
  work_order_ids
) => {

  // Get Work Orders
  const workOrders = await WorkOrder.findAll({
    where: {
      id: {
        [Op.in]: work_order_ids,
      },
      is_active: true,
    },
    attributes: [
      "id",
      "grand_total",
    ],
  });


  // Check if all requested Work Orders exist
  const foundIds = workOrders.map(
    (workOrder) => Number(workOrder.id)
  );

  const missingIds = work_order_ids.filter(
    (id) => !foundIds.includes(Number(id))
  );


  // Stop if any Work Order ID is invalid
  if (missingIds.length > 0) {
    const error = new Error(
      `Work Order not found: ${missingIds.join(", ")}`
    );

    error.statusCode = 404;

    throw error;
  }


  // Calculate total amount
  const totalAmount = workOrders.reduce(
    (sum, workOrder) => {
      return (
        sum + Number(workOrder.grand_total || 0)
      );
    },
    0
  );


  return {
    work_order_count: workOrders.length,
    grand_total: Number(
      totalAmount.toFixed(2)
    ),
  };
};

// Upload PBG Document
exports.uploadPbgDocument = async (pbg_id, filePath) => {
  const pbg = await PbgMaster.findOne({
    where: {
      id: pbg_id,
      is_active: true,
    },
  });

  if (!pbg) {
    const error = new Error("PBG not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  await pbg.update({
    pbg_upload_path: filePath,
  });

  return pbg;
};

// Get PBG Document for Download
exports.getPbgDocument = async (pbg_id) => {
  return await PbgMaster.findOne({
    where: {
      id: pbg_id,
      is_active: true,
    },
    attributes: [
      "id",
      "pbg_no",
      "pbg_upload_path",
    ],
  });
};