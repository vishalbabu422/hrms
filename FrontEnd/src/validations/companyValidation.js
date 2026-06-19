export const validateCompany = (data) => {
  const errors = {};

  if (!data.company_name || data.company_name.trim() === "") {
    errors.company_name = "Company name is required";
  }

  if (!data.company_type) {
    errors.company_type = "Company type is required";
  }

  if (data.official_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(data.official_email)) {
      errors.official_email = "Enter valid email";
    }
  }

  if (data.official_phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(data.official_phone)) {
      errors.official_phone = "Enter valid phone number";
    }
  }

  if (data.pincode) {
    const pinRegex = /^[0-9]{4,10}$/;
    if (!pinRegex.test(data.pincode)) {
      errors.pincode = "Enter valid pincode";
    }
  }

  if (!data.is_active && data.is_active !== false) {
    errors.is_active = "Status is required";
  }

  return errors;
};