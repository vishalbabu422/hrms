export const validateEmpanelment = (data) => {
  const errors = {}

  if (!data.category || data.category.trim() === '') {
    errors.category = 'Category is required'
  }

  if (!data.empanelment_no || data.empanelment_no.trim() === '') {
    errors.empanelment_no = 'Empanelment no is required'
  }

  if (!data.date) {
    errors.date = 'Date is required'
  }

  if (!data.shortcode || data.shortcode.trim() === '') {
    errors.shortcode = 'Short code is required'
  }

  if (!data.rfe || data.rfe.trim() === '') {
    errors.rfe = 'RFE is required'
  }

  if (!data.leaves_per_month) {
    errors.leaves_per_month = 'Leaves per month is required'
  }

  if (!data.leave_category) {
    errors.leave_category = 'Leave category is required'
  }

  if (!data.effective_from) {
    errors.effective_from = 'Effective from is required'
  }

  if (data.effective_to && data.effective_to < data.effective_from) {
    errors.effective_to = 'End date cannot be before start date'
  }

  // Validate Empanelment document
  
  if (data.doc_path) {
    const file = data.doc_path

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
