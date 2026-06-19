const Joi = require("joi");

const gstCodeCreateSchema = Joi.object({
  code_type: Joi.string().trim().max(10).required().messages({
    "any.required": "code_type is required",
    "string.empty": "code_type cannot be empty",
  }),

  code: Joi.string().trim().max(10).required().messages({
    "any.required": "code is required",
    "string.empty": "code cannot be empty",
  }),

  description: Joi.string().trim().required().messages({
    "any.required": "description is required",
    "string.empty": "description cannot be empty",
  }),

  gst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  cgst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  sgst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  igst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  cess_rate: Joi.number().precision(2).min(0).max(100).optional(),

  other_rate: Joi.number().precision(2).min(0).max(100).optional(),

  effective_from: Joi.date().iso().required(),
  effective_to: Joi.date().iso().optional().allow(null, ""),

  is_active: Joi.boolean().default(true),
  transaction_type: Joi.string().valid("INTRA", "INTER").default("INTRA"),
})
  // Reject unknown fields like id, created, modified
  .unknown(false)
  .custom((value, helpers) => {
    const { effective_from, effective_to } = value;

    if (effective_to && effective_to <= effective_from) {
      return helpers.error("date.order");
    }

    return value;
  })
  .messages({
    "date.order": "effective_to must be after effective_from",
  });

const gstCodePatchSchema = Joi.object({
  code_type: Joi.string().trim().max(10).optional(),

  code: Joi.string().trim().max(10).optional(),

  description: Joi.string().trim().optional(),

  gst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  cgst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  sgst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  igst_rate: Joi.number().precision(2).min(0).max(100).optional(),

  cess_rate: Joi.number().precision(2).min(0).max(100).optional(),

  other_rate: Joi.number().precision(2).min(0).max(100).optional(),

  effective_from: Joi.date().iso().optional(),

  effective_to: Joi.date().iso().optional().allow(null, ""),

  is_active: Joi.boolean().optional(),
  transaction_type: Joi.string().valid("INTRA", "INTER").default("INTRA"),
})
  .unknown(false)
  .min(1)
  .custom((value, helpers) => {
    const { effective_from, effective_to } = value;
    if (effective_to && effective_to <= effective_from) {
      return helpers.error("date.order");
    }

    return value;
  })
  .messages({
    "object.min": "At least one field must be provided for update",
    "date.order": "effective_to must be after effective_from",
  });

const gstCodeIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "id is required",
    "number.base": "id must be a number",
  }),
});

const gstCodeActiveQuerySchema = Joi.object({
  is_active: Joi.boolean().default(true).messages({
    "boolean.base": "is_active must be a boolean",
  }),
});

module.exports = {
  gstCodeCreateSchema,
  gstCodeIdParamSchema,
  gstCodePatchSchema,
  gstCodeActiveQuerySchema,
};
