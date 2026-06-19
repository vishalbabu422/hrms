import { validateFields } from '../utils/validator'
export const validateBank = (data, type = 'Bank') => {
  const errors = {}

  const bankName = data.bank_name?.trim()
  const branch = data.branch_name?.trim()
  const address = data.bank_address?.trim()
  const account = data.account_number?.trim()
  const ifsc = data.ifsc?.trim()
  const micr = data.micr_code?.trim()

  if (!bankName) {
    errors.bank_name = `${type}: Bank name is required`
  }

  if (!branch) {
    errors.branch_name = `${type}: Branch name is required`
  }

  if (!address) {
    errors.bank_address = `${type}: Bank address is required`
  }

  if (!account) {
    errors.account_number = `${type}: Account number is required`
  } else if (!/^\d+$/.test(account)) {
    errors.account_number = `${type}: Only numbers allowed`
  }

  if (!ifsc) {
    errors.ifsc = `${type}: IFSC code is required`
  }

  if (!micr) {
    errors.micr_code = `${type}: MICR code is required`
  }

  return errors
}

