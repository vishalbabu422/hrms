export const validateEmployeeSalaryRegister = (
  data,
  type = 'Employee Salary Register',
) => {
  const errors = {}

  // EMPLOYEE
  if (
    data.employee_id === null ||
    data.employee_id === undefined ||
    data.employee_id === ''
  ) {
    errors.employee_id = `${type}: Employee is required`
  }

  // YEAR
  if (
    data.year === null ||
    data.year === undefined ||
    data.year === ''
  ) {
    errors.year = `${type}: Year is required`
  }

  // MONTH
  if (
    data.month === null ||
    data.month === undefined ||
    data.month === ''
  ) {
    errors.month = `${type}: Month is required`
  }

  return errors
}