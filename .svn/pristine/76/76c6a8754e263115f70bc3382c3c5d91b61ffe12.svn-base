export const validateSalaryAddon = (data) => {
  const errors = {}

  if (!data.name?.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.code?.trim()) {
    errors.code = 'Code is required'
  }

  if (!data.addon_type) {
    errors.addon_type = 'Type is required'
  }

  return errors
}