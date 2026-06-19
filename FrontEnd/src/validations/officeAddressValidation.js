export const validateOfficeAddress = (address, type = 'Address') => {
  const errors = {}

  const addressLine1 = address.address_line1?.trim()
  const city = address.city?.trim()
  const state = address.state?.trim()
  const district = address.district?.trim()
  const country = address.country?.trim()
  const landmark = address.landmark?.trim()
  const pin = address.pin_code?.toString().trim()

  const isAnyFilled = Boolean(
    addressLine1 || city || state || district || country || pin || landmark,
  )

  if (!isAnyFilled) return errors

  if (!addressLine1) {
    errors.address_line1 = `${type}: Address is required`
  }

  if (pin) {
    if (!/^\d+$/.test(pin)) {
      errors.pin_code = `${type}: Pin code must contain only numbers`
    } else if (pin.length !== 6) {
      errors.pin_code = `${type}: Pin code must be exactly 6 digits`
    }
  }

  if (city && city.length > 100) {
    errors.city = `${type}: City max 100 characters`
  }

  if (state && state.length > 100) {
    errors.state = `${type}: State max 100 characters`
  }

  if (district && district.length > 100) {
    errors.district = `${type}: District max 100 characters`
  }

  if (country && country.length > 100) {
    errors.country = `${type}: Country max 100 characters`
  }

  if (landmark && landmark.length > 150) {
    errors.landmark = `${type}: Landmark max 150 characters`
  }

  return errors
}
