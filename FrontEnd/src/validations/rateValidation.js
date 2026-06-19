export const validateRate = (data) => {
  const errors = {};

  if (!data.desgn_id_fk) {
    errors.desgn_id_fk = "Designation is required";
  }

  if (!data.unit_rate_incl_agency_margin) {
    errors.unit_rate_incl_agency_margin = "Unit rate (incl) is required";
  }

  if (!data.unit_rate_excl_agency_margin) {
    errors.unit_rate_excl_agency_margin = "Unit rate (excl) is required";
  }

  if (!data.nicsi_margin_percent && data.nicsi_margin_percent !== 0) {
    errors.nicsi_margin_percent = "NICSI margin is required";
  }

  if (!data.total_amount) {
    errors.total_amount = "Total amount is required";
  }

  if (!data.gst_code_fk) {
    errors.gst_code_fk = "GST code is required";
  }

  if (!data.final_amount) {
    errors.final_amount = "Final amount is required";
  }

  if (!data.is_active && data.is_active !== false) {
    errors.is_active = "Status is required";
  }

  return errors;
};