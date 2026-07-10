export const validateEmployeeAddon = (data) => {
  const errors = {}

  /* WORKORDER */
  if (!data.workorder_id) {
    errors.workorder_id = 'Workorder is required'
  }

  /* EMPLOYEE */
  if (!data.employee_id || !data.employee_id.length) {
    errors.employee_id = 'Employee is required'
  }

  /* AMOUNT */
  if (!data.amount) {
    errors.amount = 'Amount is required'
  }

  if (data.amount && isNaN(Number(data.amount))) {
    errors.amount = 'Amount must be numeric'
  }

  /* MONTH */
  if (!data.effective_month) {
    errors.effective_month = 'Month is required'
  }

  /* YEAR */
  if (!data.effective_year) {
    errors.effective_year = 'Year is required'
  }

  return errors
}
