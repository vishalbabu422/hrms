
const validateBillingSubmission = (formData) => {
  const errors = {}

  if (!formData.year) {
    errors.year = 'Please select year'
  }

  if (!formData.month) {
    errors.month = 'Please select month'
  }

  if (!formData.work_order_id && !formData.wo_id) {
    errors.work_order_id = 'Please select Work Order'
  }

  if (!String(formData.invoice_no || '').trim()) {
    errors.invoice_no = 'Invoice number is required'
  }

  if (!formData.invoice_date) {
    errors.invoice_date = 'Invoice date is required'
  }

  if (
    formData.billing_amount === '' ||
    formData.billing_amount === null ||
    formData.billing_amount === undefined ||
    !Number.isFinite(Number(formData.billing_amount)) ||
    Number(formData.billing_amount) < 0
  ) {
    errors.billing_amount = 'Enter a valid billing amount'
  }

  if (!formData.gst_code_fk) {
    errors.gst_code_fk = 'Please select GST Code'
  }

  if (
    formData.total_amount === '' ||
    formData.total_amount === null ||
    formData.total_amount === undefined ||
    !Number.isFinite(Number(formData.total_amount)) ||
    Number(formData.total_amount) < 0
  ) {
    errors.total_amount = 'Total amount is required'
  }

  if (!formData.pbg_id && !formData.pbg_no) {
    errors.pbg_id = 'Please select PBG No.'
  }

  if (!formData.pbg_submission_date) {
    errors.pbg_submission_date = 'PBG submission date is required'
  }

  return errors
}

export default validateBillingSubmission
