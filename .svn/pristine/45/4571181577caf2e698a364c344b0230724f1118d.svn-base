export const validateEmpSalaryStructure = (data) => {
  const errors = {}

  if (!data || Object.keys(data).length === 0) {
    return {
      general: 'Please select at least one employee',
    }
  }

  Object.entries(data).forEach(([id, value]) => {
    if (!value?.checked) return

    const rowErrors = {}

    // ANNUAL CTC VALIDATION
    if (!value.annual_ctc && value.annual_ctc !== 0) {
      rowErrors.ctc = 'Annual CTC is required'
    } else if (isNaN(value.annual_ctc) || Number(value.annual_ctc) <= 0) {
      rowErrors.ctc = 'Annual CTC must be a valid positive number'
    }

    // EFFECTIVE DATE VALIDATION
    if (!value.effective_from) {
      rowErrors.effective_from = 'Effective date is required'
    }

    if (Object.keys(rowErrors).length > 0) {
      errors[id] = rowErrors
    }
  })

  return errors
}
