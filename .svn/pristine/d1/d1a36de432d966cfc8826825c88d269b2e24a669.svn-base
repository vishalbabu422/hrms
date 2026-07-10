export const validateFields = (data, rules) => {

    const errors = {};

    Object.keys(rules).forEach((field) => {

        const value = data[field];
        const fieldRules = rules[field];

        if (fieldRules.required && (!value || value.toString().trim() === "")) {
            errors[field] = fieldRules.message || `${field} is required`;
            return;
        }

        if (fieldRules.minLength && value.length < fieldRules.minLength) {
            errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
        }

        if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
            errors[field] = `${field} must be less than ${fieldRules.maxLength} characters`;
        }

        if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
            errors[field] = fieldRules.message || `${field} format is invalid`;
        }

    });

    return errors;
};