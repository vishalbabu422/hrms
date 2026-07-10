export const validateGst = (data) => {
  const errors = {};

  if (!data.code_type) {
    errors.code_type = "Code type is required";
  }

  if (!data.transaction_type) {
    errors.transaction_type = "Transaction type is required";
  }

  if (!data.code || data.code.trim() === "") {
    errors.code = "Code is required";
  }

  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  }

  if (!data.effective_from) {
    errors.effective_from = "Effective from date is required";
  }

  // Optional logic
  if (data.effective_to && data.effective_to < data.effective_from) {
    errors.effective_to = "End date cannot be before start date";
  }

  return errors;
};