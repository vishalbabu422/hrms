export const validatePBG = (data) => {
  const errors = {}

  if (!data.pbg_no?.trim()) {
    errors.pbg_no = 'PBG No is required'
  }

  if (!data.start_date) {
    errors.start_date = 'Start date is required'
  }

  if (!data.end_date) {
    errors.end_date = 'End date is required'
  }

  if (data.start_date && data.end_date) {
    if (new Date(data.end_date) < new Date(data.start_date)) {
      errors.end_date = 'End date must be after start date'
    }
  }

  if (
    data.amount === '' ||
    data.amount === null ||
    data.amount === undefined
  ) {
    errors.amount = 'Amount is required'
  } else if (Number(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (
    data.bank_charges !== '' &&
    data.bank_charges !== null &&
    data.bank_charges !== undefined &&
    Number(data.bank_charges) < 0
  ) {
    errors.bank_charges = 'Bank charges cannot be negative'
  }

  return errors
}