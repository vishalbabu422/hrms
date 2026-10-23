export const validateWorkOrder = (data) => {
  const errors = {}

  if (!data.empanelment_id_fk) {
    errors.empanelment_id_fk = 'Empanelment is required'
  }

  if (!data.work_order_no || data.work_order_no.trim() === '') {
    errors.work_order_no = 'Work Order No is required'
  }

  if (!data.work_order_date) {
    errors.work_order_date = 'Date is required'
  }

  if (!data.project_no || data.project_no.trim() === '') {
    errors.project_no = 'Project No is required'
  }

  if (!data.project_name || data.project_name.trim() === '') {
    errors.project_name = 'Project Name is required'
  }

  // Type (matches form field name="type")
  if (!data.type || data.type.trim() === '') {
    errors.type = 'Work Order Type is required'
  }

  // Status
  if (data.is_active === null || data.is_active === undefined) {
    errors.is_active = 'Status is required'
  }

  if (!data.vendor_id_fk) {
    errors.vendor_id_fk = 'Vendor is required'
  }

  // Auto-filled after vendor selection
  if (!data.issued_to_name || data.issued_to_name.trim() === '') {
    errors.issued_to_name = 'Issued To Name is required'
  }

  if (!data.contact_name || data.contact_name.trim() === '') {
    errors.contact_name = 'Contact name is required'
  }

  if (!data.contact_email || data.contact_email.trim() === '') {
    errors.contact_email = 'Email is required'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    if (!emailRegex.test(data.contact_email)) {
      errors.contact_email = 'Enter a valid email'
    }
  }

  if (!data.contact_number || data.contact_number.trim() === '') {
    errors.contact_number = 'Phone number is required'
  } else {
    const phoneRegex = /^[0-9]{10,15}$/

    if (!phoneRegex.test(data.contact_number)) {
      errors.contact_number = 'Enter a valid phone number'
    }
  }

  if (data.doc_path) {
    const file = data.doc_path

    // PDF validation
    const isPDF = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')

    if (!isPDF) {
      errors.doc_path = 'Only PDF files are allowed.'
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      errors.doc_path = 'File size must not exceed 5 MB.'
    }
  }

  return errors
}
