export const validateExperience = (data, type = "Experience") => {
  const errors = {}

  if (!data.company_name?.trim()) {
    errors.company_name = `${type}: Company Name is required`
  }

  if (!data.designation?.trim()) {
    errors.designation = `${type}: Designation is required`
  }

  if (!data.start_date) {
    errors.start_date = `${type}: Start Date is required`
  }

  if (!data.end_date) {
    errors.end_date = `${type}: End Date is required`
  }

  if (data.start_date && data.end_date && data.end_date < data.start_date) {
    errors.end_date = `${type}: End Date must be after Start Date`
  }

  if (!data.total_years) {
    errors.total_years = `${type}: Total Years is required`
  }

  return errors
}