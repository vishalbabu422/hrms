export const validateFinancialRegister = (
  data,
  type = 'Financial Register',
) => {
  const errors = {}

  // YEAR
  if (
    data.year === null ||
    data.year === undefined ||
    data.year === ''
  ) {
    errors.year = `${type}: Year is required`
  }

  // SALARY STRUCTURE
  if (
    data.structure === null ||
    data.structure === undefined ||
    data.structure === ''
  ) {
    errors.structure = `${type}: Salary Structure is required`
  }

  return errors
}