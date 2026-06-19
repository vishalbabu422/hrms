const validate = (schema, property = "query") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: true, // stop on first error
      stripUnknown: true, // remove keys not in schema
      convert: true, // cast strings to numbers, etc.
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    // Replace request data with validated + sanitized data
    req[property] = value;
    next();
  };
};

module.exports = validate;
