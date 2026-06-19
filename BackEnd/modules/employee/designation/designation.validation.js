const Joi = require("joi");

exports.createDesignationSchema = Joi.object({
    designation_name: Joi.string().max(150).required(),
    designation_code: Joi.string().max(50).optional(),
    level: Joi.number().integer().optional(),
    is_active: Joi.boolean().optional()
});

exports.updateDesignationSchema = Joi.object({
    designation_name: Joi.string().max(150).optional(),
    designation_code: Joi.string().max(50).optional(),
    level: Joi.number().integer().optional(),
    is_active: Joi.boolean().optional()
});
