import { validateFields } from '../utils/validator'

export const validateScreening = (data, type = "Screening") => {
  const rules = {
    test_given_date: {
      required: true,
      message: `${type}: Test Given Date is required`,
    },

    result: {
      required: true,
      message: `${type}: Result is required`,
    },

    // ✅ conditional validation
    marks_secured: {
      validate: (value) => {
        if (data.result === "PASS" && !value) {
          return `${type}: Marks are required when result is PASS`
        }
        return true
      },
    },
  }

  return validateFields(data, rules)
}