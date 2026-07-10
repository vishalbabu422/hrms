export const validateDesignation = (data) => {
  const errors = {};

  if (!data.type || data.type.trim() === "") {
    errors.type = "Type is required";
  }

  if (!data.empanelment_id_fk) {
    errors.empanelment_id_fk = "Empanelment is required";
  }

  if (!data.designation || data.designation.trim() === "") {
    errors.designation = "Designation is required";
  }

  if (!data.qualification || data.qualification.trim() === "") {
    errors.qualification = "Qualification is required";
  }

  if (!data.exp_in_years && data.exp_in_years !== 0) {
    errors.exp_in_years = "Experience is required";
  }

  if (!data.is_active && data.is_active !== false) {
    errors.is_active = "Status is required";
  }

  return errors;
};