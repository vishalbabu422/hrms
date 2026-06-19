export const validateEmpanelment = (data) => {
  const errors = {};

  if (!data.category || data.category.trim() === "") {
    errors.category = "Category is required";
  }

  if (!data.empanelment_no || data.empanelment_no.trim() === "") {
    errors.empanelment_no = "Empanelment no is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (!data.shortcode || data.shortcode.trim() === "") {
    errors.shortcode = "Short code is required";
  }

  if (!data.rfe || data.rfe.trim() === "") {
    errors.rfe = "RFE is required";
  }

  if (!data.leaves_per_month) {
    errors.leaves_per_month = "Leaves per month is required";
  }

  if (!data.leave_category) {
    errors.leave_category = "Leave category is required";
  }

  if (!data.effective_from) {
    errors.effective_from = "Effective from is required";
  }

  if (data.effective_to && data.effective_to < data.effective_from) {
    errors.effective_to = "End date cannot be before start date";
  }

  return errors;
};