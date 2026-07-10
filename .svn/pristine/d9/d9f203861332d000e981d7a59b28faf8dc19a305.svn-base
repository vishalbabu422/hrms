import { validateFields } from '../utils/validator'

export const validateSalaryComponent = (data, type = 'Salary Component') => {
  const errors = {}

  const name = data.name?.trim()
  const code = data.code?.trim()
  const typeVal = data.type?.trim()
  const valueType = data.value_type?.trim()
  const baseType = data.base_type?.trim()

  /* ================= REQUIRED ================= */

  if (!name) {
    errors.name = `${type}: Name is required`
  }

  if (!code) {
    errors.code = `${type}: Code is required`
  }

  if (!typeVal) {
    errors.type = `${type}: Type is required`
  }

  // ❌ REMOVED VALUE TYPE REQUIRED

  if (!baseType) {
    errors.base_type = `${type}: Base type is required`
  }

  /* ================= VALUE TYPE LOGIC ================= */

  // ✔ Apply ONLY if user selected value type
  if (valueType === 'fixed') {
    if (data.amount === null || data.amount === '' || data.amount === undefined) {
      errors.amount = `${type}: Amount is required`
    } else if (isNaN(data.amount) || Number(data.amount) < 0) {
      errors.amount = `${type}: Amount must be a valid positive number`
    }
  }

  if (valueType === 'percentage') {
    if (data.percentage === null || data.percentage === '' || data.percentage === undefined) {
      errors.percentage = `${type}: Percentage is required`
    } else if (
      isNaN(data.percentage) ||
      Number(data.percentage) < 0 ||
      Number(data.percentage) > 100
    ) {
      errors.percentage = `${type}: Percentage must be between 0 and 100`
    }
  }

  /* ================= BASE TYPE LOGIC ================= */

  if (baseType === 'component') {
    if (!data.base_component_id) {
      errors.base_component_id = `${type}: Base component is required`
    }
  }

  /* ================= PRIORITY ================= */

  if (
    data.calculation_priority === null ||
    data.calculation_priority === '' ||
    data.calculation_priority === undefined
  ) {
    errors.calculation_priority = `${type}: Priority is required`
  } else if (isNaN(data.calculation_priority)) {
    errors.calculation_priority = `${type}: Priority must be a number`
  }

  return errors
}