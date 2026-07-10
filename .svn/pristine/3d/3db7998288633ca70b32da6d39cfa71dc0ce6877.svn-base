export const validateVendor = (data) => {
  const errors = {}

  // ================= Vendor Name =================
  if (!data.vendor_name || data.vendor_name.trim() === '') {
    errors.vendor_name = 'Vendor name is required'
  }

  // ================= Email =================
  if (data.contact_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    if (!emailRegex.test(data.contact_email)) {
      errors.contact_email = 'Enter valid email'
    }
  }

  // ================= Contact Phone =================
  if (data.contact_phone) {
    const phoneRegex = /^[0-9]{10}$/

    if (!phoneRegex.test(data.contact_phone)) {
      errors.contact_phone = 'Phone number must be 10 digits'
    }
  }

  // ================= Pincode =================
  if (data.pincode) {
    const pinRegex = /^[0-9]{6}$/

    if (!pinRegex.test(data.pincode)) {
      errors.pincode = 'Pincode must be 6 digits'
    }
  }

  // ================= Account Number =================
  if (data.account_number) {
    const accRegex = /^[0-9]{9,18}$/

    if (!accRegex.test(data.account_number)) {
      errors.account_number = 'Enter valid account number'
    }
  }

  // ================= IFSC =================
  if (data.ifsc_code) {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/

    if (!ifscRegex.test(data.ifsc_code)) {
      errors.ifsc_code = 'Enter valid IFSC code'
    }
  }

  // ================= Status =================
  if (!data.is_active && data.is_active !== false) {
    errors.is_active = 'Status is required'
  }

  return errors
}