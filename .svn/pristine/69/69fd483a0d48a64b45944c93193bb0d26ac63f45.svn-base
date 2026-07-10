import { validateFields } from '../utils/validator'

export const validateInsurance = (data, type = 'Insurance') => {
  const rules = {
    insurance_company: {
      required: true,
      message: `${type}: Insurance Company is required`,
    },

    policy_number: {
      required: true,
      message: `${type}: Policy Number is required`,
    },

    from_date: {
      required: true,
      message: `${type}: From Date is required`,
    },

    sum_insured: {
      required: true,
      message: `${type}: Sum Insured is required`,
    },

    policy_premium: {
      required: true,
      message: `${type}: Policy Premium is required`,
    },

    to_date: {
      required: true,
      message: `${type}: To Date is required`,
      validate: () => {
        if (data.from_date && data.to_date < data.from_date) {
          return `${type}: To Date must be after From Date`
        }
        return true
      },
    },
  }

  return validateFields(data, rules)
}
