const Joi = require("joi");

const dashboardCountQuerySchema = Joi.object({
  filter: Joi.string().valid("Today", "Monthly", "Yearly").default("Today"),
});

const dashYearlyReportQuerySchema = Joi.object({
  year: Joi.number()
    .min(1900)
    .max(2100)
    .default(() => new Date().getFullYear()),
});

module.exports = {
  dashboardCountQuerySchema,
  dashYearlyReportQuerySchema,
};
