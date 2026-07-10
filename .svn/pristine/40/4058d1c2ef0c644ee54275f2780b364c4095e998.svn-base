import { validateFields } from '../utils/validator'

export const validateSalaryStructure = (data, type = 'Salary Structure') => {
  const errors = {}

  const name = data.name?.trim()

  
  if (!name) {
    errors.name = `${type}: Name is required`
  }


  if (!data.components || data.components.length === 0) {
    errors.components = `${type}: At least one component is required`
  }

  return errors
}