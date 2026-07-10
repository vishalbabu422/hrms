import { validateFields } from '../utils/validator'

export const validateLtc = (data, type = "LTC") => {
  const rules = {
    hometown: {
      required: true,
      message: `${type}: Hometown is required`,
    },

    district: {
      required: true,
      message: `${type}: District is required`,
    },

    state: {
      required: true,
      message: `${type}: State is required`,
    },
  }

  return validateFields(data, rules)
}