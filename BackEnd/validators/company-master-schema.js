const Joi = require("joi");

//Validate Work Order ID in URL params

const companyIdParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "id is required",
      "number.base": "id must be a number",
      "number.integer": "id must be an integer",
      "number.positive": "id must be a positive number",
    }),
});

module.exports = {
  companyIdParamSchema,
};