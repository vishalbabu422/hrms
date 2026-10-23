import { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import { toast } from 'react-toastify'
import PreviewModal from './preview-modal'
import api from '../../api/axios'
import validateBillingSubmission from '../../validations/billingSubmissionValidation'

const defaultFormData = {
  year: '',
  month: '',
  work_order_id: '',
  work_order_no: '',
  invoice_no: '',
  invoice_date: '',
  billing_amount: '',
  gst_code_fk: '',
  gst_code: '',
  cgst_rate: 0,
  sgst_rate: 0,
  igst_rate: 0,
  cgst: 0,
  sgst: 0,
  igst: 0,
  total_amount: '',
  pbg_no: '',
  pbg_id: '',
  pbg_submission_date: '',
}

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const normalizeDate = (value) => {
  if (!value) return ''
  const date = String(value).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : ''
}

const normalizeMonth = (value) => {
  if (value === '' || value === null || value === undefined) return ''

  const numeric = Number(value)

  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 12) {
    return String(numeric)
  }

  const match = months.find(
    (item) => item.label.toLowerCase() === String(value).toLowerCase(),
  )

  return match ? String(match.value) : ''
}

const BillingSubmissionFormComponent = ({
  initialData,
  mode = 'add',
  onSubmit,
}) => {
  const mapInitialData = (data = {}) => ({
    ...defaultFormData,
    ...data,

    year: data.year != null ? String(data.year) : '',
    month: normalizeMonth(data.month),

    work_order_id: String(
      data.work_order_id ?? data.wo_id ?? data.workOrder?.id ?? '',
    ),

    work_order_no:
      data.work_order_no ?? data.workOrder?.work_order_no ?? '',

    invoice_no: data.invoice_no ?? data.invoice_number ?? '',
    invoice_date: normalizeDate(data.invoice_date),
    billing_amount: data.billing_amount ?? '',

    gst_code_fk: String(
      data.gst_code_fk ??
        data.gst_code_id ??
        data.gstCode?.id ??
        '',
    ),

    gst_code:
      data.gst_code ??
      data.gstCode?.code ??
      data.gst_code_name ??
      '',

    cgst_rate: Number(
      data.cgst_rate ??
        data.billing_cgst_rate ??
        data.gstCode?.cgst_rate ??
        0,
    ),

    sgst_rate: Number(
      data.sgst_rate ??
        data.billing_sgst_rate ??
        data.gstCode?.sgst_rate ??
        0,
    ),

    igst_rate: Number(
      data.igst_rate ??
        data.billing_igst_rate ??
        data.gstCode?.igst_rate ??
        0,
    ),

    cgst: Number(data.cgst ?? data.billing_cgst_amt ?? 0),
    sgst: Number(data.sgst ?? data.billing_sgst_amt ?? 0),
    igst: Number(data.igst ?? data.billing_igst_amt ?? 0),

    total_amount: data.total_amount ?? '',

    pbg_id: String(data.pbg_id ?? data.pbg?.id ?? ''),
    pbg_no: data.pbg_no ?? data.pbg?.pbg_no ?? '',

    pbg_submission_date: normalizeDate(data.pbg_submission_date),
  })

  const [formData, setFormData] = useState(() => mapInitialData(initialData))
  const [errors, setErrors] = useState({})
  const [workOrders, setWorkOrders] = useState([])
  const [gstCodeList, setGstCodeList] = useState([])
  const [pbgList, setPbgList] = useState([])

  const [loadingWorkOrders, setLoadingWorkOrders] = useState(false)
  const [loadingGST, setLoadingGST] = useState(false)
  const [loadingGSTDetails, setLoadingGSTDetails] = useState(false)
  const [loadingInvoice, setLoadingInvoice] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Initialize Add / Edit form
  useEffect(() => {
    if (!initialData) return

    setFormData(mapInitialData(initialData))
    setErrors({})
    setShowPreview(false)
  }, [initialData])

  // Fetch Work Orders
  useEffect(() => {
    let cancelled = false

    const fetchWorkOrders = async () => {
      try {
        setLoadingWorkOrders(true)

        const response = await api.get('/admin/workorder/index', {
          params: {
            is_active: true,
            modelFilter: JSON.stringify({}),
            page: 1,
            limit: 100,
          },
        })

        const list = response.data?.data?.workOrderList || []

        if (!cancelled) {
          setWorkOrders(Array.isArray(list) ? list : [])
        }
      } catch (error) {
        console.error('Work Order API error:', error.response?.data || error)

        if (!cancelled) {
          toast.error(
            error.response?.data?.message || 'Failed to load Work Orders',
          )
        }
      } finally {
        if (!cancelled) setLoadingWorkOrders(false)
      }
    }

    fetchWorkOrders()

    return () => {
      cancelled = true
    }
  }, [])

  // Fetch GST Codes
  useEffect(() => {
    let cancelled = false

    const fetchGSTCodes = async () => {
      try {
        setLoadingGST(true)

        const response = await api.get('/admin/gst-code/index', {
          params: {
            page: 1,
            limit: 100,
          },
        })

        const list = response.data?.data?.GstCodeList || []

        if (!cancelled) {
          setGstCodeList(Array.isArray(list) ? list : [])

          if (!Array.isArray(list) || list.length === 0) {
            console.error('GST Code list missing:', response.data)
          }
        }
      } catch (error) {
        console.error('GST list error:', error.response?.data || error)

        if (!cancelled) {
          setGstCodeList([])
          toast.error(
            error.response?.data?.message || 'Failed to load GST Codes',
          )
        }
      } finally {
        if (!cancelled) setLoadingGST(false)
      }
    }

    fetchGSTCodes()

    return () => {
      cancelled = true
    }
  }, [])

  // Restore saved GST Code in Edit mode
  useEffect(() => {
    if (mode !== 'edit' || !initialData || gstCodeList.length === 0) {
      return
    }

    const savedGstId = String(
      initialData.gst_code_fk ??
        initialData.gst_code_id ??
        initialData.gstCode?.id ??
        '',
    )

    const savedGstCode = String(
      initialData.gst_code ??
        initialData.gstCode?.code ??
        initialData.gst_code_name ??
        '',
    )

    const matchedGST = gstCodeList.find((item) => {
      const itemId = String(item.id ?? item.gst_code_id ?? '')
      const itemCode = String(
        item.code ?? item.gst_code ?? item.gst_code_name ?? '',
      )

      return (
        (savedGstId && itemId === savedGstId) ||
        (savedGstCode &&
          itemCode.toLowerCase() === savedGstCode.toLowerCase())
      )
    })

    if (!matchedGST) return

    const resolvedId = String(
      matchedGST.id ?? matchedGST.gst_code_id ?? savedGstId,
    )

    setFormData((previous) => ({
      ...previous,
      gst_code_fk: resolvedId,
      gst_code:
        savedGstCode ||
        matchedGST.code ||
        matchedGST.gst_code ||
        '',
      cgst_rate: Number(
        initialData.cgst_rate ??
          initialData.billing_cgst_rate ??
          matchedGST.cgst_rate ??
          previous.cgst_rate ??
          0,
      ),
      sgst_rate: Number(
        initialData.sgst_rate ??
          initialData.billing_sgst_rate ??
          matchedGST.sgst_rate ??
          previous.sgst_rate ??
          0,
      ),
      igst_rate: Number(
        initialData.igst_rate ??
          initialData.billing_igst_rate ??
          matchedGST.igst_rate ??
          previous.igst_rate ??
          0,
      ),
    }))
  }, [mode, initialData, gstCodeList])

  // Fetch PBG options from backend
  useEffect(() => {
    let cancelled = false

    const fetchPBGList = async () => {
      try {
        const response = await api.get('/pbg-master/index', {
          params: { page: 1, limit: 100 },
        })

        const list = response.data?.data?.pbgList || []

        if (!cancelled) {
          setPbgList(Array.isArray(list) ? list : [])
        }
      } catch (error) {
        console.error('PBG list API error:', error.response?.data || error)

        if (!cancelled) {
          setPbgList([])
          toast.error(
            error.response?.data?.message || 'Failed to load PBG list',
          )
        }
      }
    }

    fetchPBGList()

    return () => {
      cancelled = true
    }
  }, [])

  // Restore saved PBG selection in Edit mode
  useEffect(() => {
    if (mode !== 'edit' || !initialData) return

    const savedPbgId = String(initialData.pbg_id ?? '')
    const savedPbgNo = String(initialData.pbg_no ?? '')

    if (!savedPbgId && !savedPbgNo) return

    let matchedPbg = pbgList.find((item) => {
      const itemId = String(item.id ?? item.pbg_id ?? '')
      const itemNumber = String(item.pbg_no ?? item.pbg_number ?? '')

      return (
        (savedPbgId && itemId === savedPbgId) ||
        (savedPbgNo && itemNumber === savedPbgNo)
      )
    })

    if (!matchedPbg) {
      matchedPbg = {
        id: savedPbgId || savedPbgNo,
        pbg_no: savedPbgNo || `PBG ID: ${savedPbgId}`,
        start_date: '',
      }

      setPbgList((previous) => {
        const exists = previous.some(
          (item) =>
            String(item.id ?? item.pbg_id ?? '') === String(matchedPbg.id),
        )

        return exists ? previous : [matchedPbg, ...previous]
      })
    }

    const resolvedId = String(
      matchedPbg.id ?? matchedPbg.pbg_id ?? savedPbgId ?? '',
    )

    const resolvedNumber = String(
      matchedPbg.pbg_no ?? matchedPbg.pbg_number ?? savedPbgNo ?? '',
    )

    setFormData((previous) => ({
      ...previous,
      pbg_id: resolvedId,
      pbg_no: resolvedNumber,
      pbg_submission_date: normalizeDate(
        initialData.pbg_submission_date,
      ),
    }))
  }, [mode, initialData, pbgList])

  // Calculate GST amounts
  const calculateGST = (amountValue, rates) => {
    const amount = Number(amountValue || 0)
    const cgstRate = Number(rates.cgst_rate || 0)
    const sgstRate = Number(rates.sgst_rate || 0)
    const igstRate = Number(rates.igst_rate || 0)

    const cgst = Number(((amount * cgstRate) / 100).toFixed(2))
    const sgst = Number(((amount * sgstRate) / 100).toFixed(2))
    const igst = Number(((amount * igstRate) / 100).toFixed(2))

    return {
      cgst,
      sgst,
      igst,
      total_amount: Number((amount + cgst + sgst + igst).toFixed(2)),
    }
  }

  // Work Order selection and invoice number generation
  const handleWorkOrderChange = async (event) => {
    const workOrderId = event.target.value
    setShowPreview(false)

    if (!workOrderId) {
      setFormData((previous) => ({
        ...previous,
        work_order_id: '',
        work_order_no: '',
        invoice_no: '',
        billing_amount: '',
        invoice_date: mode === 'edit' ? previous.invoice_date : '',
      }))

      setErrors((previous) => ({
        ...previous,
        work_order_id: '',
        invoice_no: '',
      }))

      return
    }

    const selectedWorkOrder = workOrders.find(
      (item) => String(item.id) === String(workOrderId),
    )

    setFormData((previous) => ({
      ...previous,
      work_order_id: String(workOrderId),
      work_order_no: selectedWorkOrder?.work_order_no || '',
      invoice_no: '',
      invoice_date: mode === 'edit' ? previous.invoice_date : '',
    }))

    setErrors((previous) => ({
      ...previous,
      work_order_id: '',
      invoice_no: '',
    }))

    try {
      setLoadingInvoice(true)

      const response = await api.get(
        `/billing-submission/work-order/${workOrderId}/invoice-preview`,
      )

      const data = response.data?.data

      const invoiceNumber =
        data?.invoice_no ?? data?.invoice_number ?? data?.invoiceNumber

      if (!invoiceNumber) {
        toast.error('Invoice number was not found in the API response')
        return
      }

      setFormData((previous) => ({
        ...previous,
        work_order_id: String(data.wo_id ?? workOrderId),
        work_order_no:
          data.work_order_no || selectedWorkOrder?.work_order_no || '',
        invoice_no: String(invoiceNumber),
        year:
          data.year !== undefined && data.year !== null
            ? String(data.year)
            : previous.year,
        month:
          data.month !== undefined && data.month !== null
            ? normalizeMonth(data.month)
            : previous.month,
      }))
    } catch (error) {
      console.error('Invoice preview error:', error.response?.data || error)

      toast.error(
        error.response?.data?.message || 'Failed to generate invoice number',
      )
    } finally {
      setLoadingInvoice(false)
    }
  }

  // GST Code selection
  const handleGSTCodeChange = async (event) => {
    const gstCodeId = event.target.value
    setShowPreview(false)

    if (!gstCodeId) {
      setFormData((previous) => ({
        ...previous,
        gst_code_fk: '',
        gst_code: '',
        cgst_rate: 0,
        sgst_rate: 0,
        igst_rate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total_amount: Number(previous.billing_amount || 0),
      }))

      setErrors((previous) => ({
        ...previous,
        gst_code_fk: '',
      }))

      return
    }

    try {
      setLoadingGSTDetails(true)

      const response = await api.get(`/admin/gst-code/${gstCodeId}`)
      const gst = response.data?.data

      if (!gst) {
        toast.error('GST Code details not found')
        return
      }

      const rates = {
        cgst_rate: Number(gst.cgst_rate || 0),
        sgst_rate: Number(gst.sgst_rate || 0),
        igst_rate: Number(gst.igst_rate || 0),
      }

      setFormData((previous) => ({
        ...previous,
        gst_code_fk: String(gstCodeId),
        gst_code: gst.code || '',
        ...rates,
        ...calculateGST(previous.billing_amount, rates),
      }))

      setErrors((previous) => ({
        ...previous,
        gst_code_fk: '',
      }))
    } catch (error) {
      console.error('GST detail error:', error.response?.data || error)

      toast.error(
        error.response?.data?.message || 'Failed to load GST details',
      )
    } finally {
      setLoadingGSTDetails(false)
    }
  }

  // General form input change
  const handleChange = (event) => {
    const { name, value } = event.target
    setShowPreview(false)

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      }

      if (name === 'billing_amount') {
        Object.assign(
          updated,
          calculateGST(value, {
            cgst_rate: previous.cgst_rate,
            sgst_rate: previous.sgst_rate,
            igst_rate: previous.igst_rate,
          }),
        )
      }

      return updated
    })

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))
  }

  // Form validation
  const validateForm = () => {
    const validationErrors = {
      ...(validateBillingSubmission(formData) || {}),
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fill all required fields correctly')
      return false
    }

    return true
  }

  // Open preview popup
  const handlePreview = () => {
    if (loadingInvoice) {
      toast.info('Please wait while the invoice number is generated')
      return
    }

    if (loadingGSTDetails) {
      toast.info('Please wait while GST details are loading')
      return
    }

    if (!validateForm()) return

    setShowPreview(true)
  }

  // Save / Update submission
  const handleSubmit = (event) => {
    event?.preventDefault()

    if (!validateForm()) return

    if (typeof onSubmit !== 'function') {
      toast.error('Save handler is not configured')
      return
    }

    const payload = {
      wo_id: Number(formData.work_order_id || formData.wo_id),
      month: Number(formData.month),
      year: Number(formData.year),
      invoice_no: formData.invoice_no,
      invoice_date: formData.invoice_date,
      billing_amount: Number(formData.billing_amount || 0),
      total_amount: Number(formData.total_amount || 0),
      pbg_id: formData.pbg_id ? Number(formData.pbg_id) : null,
      pbg_submission_date: formData.pbg_submission_date || null,
      billing_igst_amt: Number(formData.igst || 0),
      billing_cgst_amt: Number(formData.cgst || 0),
      billing_sgst_amt: Number(formData.sgst || 0),
    }

    if (formData.gst_code_fk) {
      payload.gst_code_fk = Number(formData.gst_code_fk)
    }

    onSubmit(payload)
  }

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const selectedPBG = pbgList.find(
    (item) =>
      String(item.id ?? item.pbg_id ?? '') === String(formData.pbg_id) ||
      String(item.pbg_no ?? item.pbg_number ?? '') ===
        String(formData.pbg_no),
  )

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm
              className="row g-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <CCol md={4}>
                <CFormLabel>
                  Select Year <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  invalid={!!errors.year}
                >
                  <option value="">Select Year</option>

                  {Array.from({ length: 6 }, (_, index) => {
                    const year = new Date().getFullYear() - 2 + index

                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  })}
                </CFormSelect>

                {errors.year && (
                  <div className="invalid-feedback d-block">
                    {errors.year}
                  </div>
                )}
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  Select Month <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="month"
                  value={formData.month || ''}
                  onChange={handleChange}
                  invalid={!!errors.month}
                >
                  <option value="">Select Month</option>

                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </CFormSelect>

                {errors.month && (
                  <div className="invalid-feedback d-block">
                    {errors.month}
                  </div>
                )}
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  Select Work Order <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="work_order_id"
                  value={formData.work_order_id || ''}
                  onChange={handleWorkOrderChange}
                  disabled={loadingWorkOrders}
                  invalid={!!errors.work_order_id}
                >
                  <option value="">
                    {loadingWorkOrders
                      ? 'Loading Work Orders...'
                      : 'Select Work Order'}
                  </option>

                  {workOrders.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.work_order_no || `WO ID: ${item.id}`}
                    </option>
                  ))}
                </CFormSelect>

                {errors.work_order_id && (
                  <div className="invalid-feedback d-block">
                    {errors.work_order_id}
                  </div>
                )}
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Invoice No. <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="invoice_no"
                  value={formData.invoice_no || ''}
                  placeholder={
                    loadingInvoice
                      ? 'Generating invoice number...'
                      : 'Invoice number will be generated automatically'
                  }
                  readOnly
                  disabled={!formData.work_order_id || loadingInvoice}
                  invalid={!!errors.invoice_no}
                />

                {loadingInvoice && (
                  <small className="text-muted">
                    <CSpinner size="sm" className="me-2" />
                    Generating invoice number...
                  </small>
                )}

                {errors.invoice_no && (
                  <div className="invalid-feedback d-block">
                    {errors.invoice_no}
                  </div>
                )}
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Invoice Date <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="date"
                  name="invoice_date"
                  value={formData.invoice_date || ''}
                  onChange={handleChange}
                  disabled={!formData.work_order_id}
                  invalid={!!errors.invoice_date}
                />

                {errors.invoice_date && (
                  <div className="invalid-feedback d-block">
                    {errors.invoice_date}
                  </div>
                )}
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  Billing Amount <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="number"
                  name="billing_amount"
                  value={formData.billing_amount ?? ''}
                  onChange={handleChange}
                  placeholder="Enter Billing Amount"
                  min="0"
                  step="0.01"
                  disabled={!formData.work_order_id}
                  invalid={!!errors.billing_amount}
                />

                {errors.billing_amount && (
                  <div className="invalid-feedback d-block">
                    {errors.billing_amount}
                  </div>
                )}
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  GST Code <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="gst_code_fk"
                  value={formData.gst_code_fk || ''}
                  onChange={handleGSTCodeChange}
                  disabled={loadingGST || loadingGSTDetails}
                  invalid={!!errors.gst_code_fk}
                >
                  <option value="">
                    {loadingGST ? 'Loading GST Codes...' : 'Select GST Code'}
                  </option>

                  {gstCodeList.map((gst) => (
                    <option
                      key={gst.id ?? gst.gst_code_id}
                      value={String(gst.id ?? gst.gst_code_id)}
                    >
                      {gst.code ?? gst.gst_code ?? gst.gst_code_name}
                    </option>
                  ))}
                </CFormSelect>

                {loadingGSTDetails && (
                  <small className="text-muted">Loading GST rates...</small>
                )}

                {errors.gst_code_fk && (
                  <div className="invalid-feedback d-block">
                    {errors.gst_code_fk}
                  </div>
                )}
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  IGST ({Number(formData.igst_rate || 0)}%)
                </CFormLabel>
                <CFormInput value={formData.igst ?? 0} readOnly />
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  CGST ({Number(formData.cgst_rate || 0)}%)
                </CFormLabel>
                <CFormInput value={formData.cgst ?? 0} readOnly />
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  SGST ({Number(formData.sgst_rate || 0)}%)
                </CFormLabel>
                <CFormInput value={formData.sgst ?? 0} readOnly />
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  Total Amount <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput value={formData.total_amount ?? ''} readOnly />

                {errors.total_amount && (
                  <div className="invalid-feedback d-block">
                    {errors.total_amount}
                  </div>
                )}
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  PBG No. <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="pbg_id"
                  value={String(formData.pbg_id || '')}
                  onChange={(event) => {
                    const selectedId = event.target.value

                    const selected = pbgList.find(
                      (item) =>
                        String(item.id ?? item.pbg_id ?? '') === selectedId,
                    )

                    setFormData((previous) => ({
                      ...previous,
                      pbg_id: selectedId,
                      pbg_no:
                        selected?.pbg_no ?? selected?.pbg_number ?? '',
                      pbg_submission_date: selectedId
                        ? previous.pbg_submission_date
                        : '',
                    }))

                    setErrors((previous) => ({
                      ...previous,
                      pbg_id: '',
                      pbg_submission_date: '',
                    }))

                    setShowPreview(false)
                  }}
                  invalid={!!errors.pbg_id}
                >
                  <option value="">Select PBG No.</option>

                  {pbgList.map((pbg) => (
                    <option
                      key={pbg.id ?? pbg.pbg_id}
                      value={String(pbg.id ?? pbg.pbg_id)}
                    >
                      {pbg.pbg_no ??
                        pbg.pbg_number ??
                        `PBG ID: ${pbg.id ?? pbg.pbg_id}`}
                    </option>
                  ))}
                </CFormSelect>

                {errors.pbg_id && (
                  <div className="invalid-feedback d-block">
                    {errors.pbg_id}
                  </div>
                )}
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  PBG Submission Date <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="date"
                  name="pbg_submission_date"
                  value={normalizeDate(formData.pbg_submission_date)}
                  onChange={handleChange}
                  disabled={!formData.pbg_id}
                  invalid={!!errors.pbg_submission_date}
                />

                {errors.pbg_submission_date && (
                  <div className="invalid-feedback d-block">
                    {errors.pbg_submission_date}
                  </div>
                )}

                {selectedPBG?.start_date && (
                  <small className="text-muted">
                    PBG start date: {selectedPBG.start_date}
                  </small>
                )}
              </CCol>

              <CCol xs={12}>
                <CButton
                  type="button"
                  color="primary"
                  onClick={handlePreview}
                  disabled={loadingInvoice || loadingGSTDetails}
                >
                  Preview
                </CButton>
              </CCol>

              <PreviewModal
                visible={showPreview}
                onClose={() => setShowPreview(false)}
                onSave={handleSubmit}
                formData={formData}
                gstCodeList={gstCodeList}
                mode={mode}
              />
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BillingSubmissionFormComponent