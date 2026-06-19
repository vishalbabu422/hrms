import { validateFields } from "../utils/validator";

export const validateOrganisation = (data) => {
  const rules = {
    org_name: {
      required: true,
      message: "Organisation name is required",
    },
    org_code: {
      required: true,
      message: "Organisation code is required",
    },
    contact_email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      message: "Enter valid email",
    },
    contact_phone: {
      pattern: /^[0-9]{10,15}$/,
      message: "Enter valid phone number",
    },
  };

  return validateFields(data, rules);
};