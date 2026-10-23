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
} from '@coreui/react'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import api from '../../api/axios'
import { validatePBG } from '../../validations/pbgValidation'

const PBGFormComponent = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {})
  const [errors, setErrors] = useState({})

  const [workOrders, setWorkOrders] = useState([])
  const [loadingWorkOrders, setLoadingWorkOrders] = useState(false)

  const [workOrderOpen, setWorkOrderOpen] = useState(false)
  const [selectedWorkOrders, setSelectedWorkOrders] = useState([])

  const [calculatingAmount, setCalculatingAmount] = useState(false)

  const workOrderRef = useRef(null)

  // ================= FETCH WORK ORDERS =================

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoadingWorkOrders(true)

        const response = await api.get('/admin/workorder/index', {
          params: {
            is_active: true,
            modelFilter: JSON.stringify({}),
          },
        })

        const list = response.data?.data?.workOrderList || []

        setWorkOrders(list)
      } catch (error) {
        console.error('WORK ORDER FETCH ERROR:', error)
        console.error('SERVER RESPONSE:', error.response?.data)

        toast.error(error.response?.data?.message || 'Failed to load Work Orders')
      } finally {
        setLoadingWorkOrders(false)
      }
    }

    fetchWorkOrders()
  }, [])

  // ================= INITIALIZE FORM =================

  useEffect(() => {
    if (!initialData) return

    setFormData(initialData)

    setSelectedWorkOrders(
      Array.isArray(initialData.work_order_ids)
        ? [...new Set(initialData.work_order_ids.map(String))]
        : initialData.wo_id != null
          ? [String(initialData.wo_id)]
          : [],
    )
  }, [initialData])

  // ================= CLOSE DROPDOWN ON OUTSIDE CLICK =================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workOrderRef.current && !workOrderRef.current.contains(event.target)) {
        setWorkOrderOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // ================= GENERAL INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value, files, type } = e.target

    if (type === 'file') {
      const file = files?.[0]

      if (!file) return

      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        e.target.value = ''

        setErrors((prev) => ({
          ...prev,
          pbg_upload_path: 'Only PDF files are allowed',
        }))

        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must not exceed 5 MB')
        e.target.value = ''

        setErrors((prev) => ({
          ...prev,
          pbg_upload_path: 'File size must not exceed 5 MB',
        }))

        return
      }

      // Existing implementation stores the filename only.
      setFormData((prev) => ({
        ...prev,
        pbg_upload_path: file.name,
      }))

      setErrors((prev) => ({
        ...prev,
        pbg_upload_path: '',
      }))

      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  // ================= UPDATE SELECTED WORK ORDERS =================

  const updateSelectedWorkOrders = (updated) => {
    setSelectedWorkOrders(updated)

    setFormData((prev) => ({
      ...prev,
      work_order_ids: updated.map(Number),
    }))

    setErrors((prev) => ({
      ...prev,
      work_order_ids: '',
    }))
  }

  // ================= INDIVIDUAL WORK ORDER SELECTION =================

  const handleWorkOrderSelect = (workOrder) => {
    const id = String(workOrder.id)

    const updated = selectedWorkOrders.includes(id)
      ? selectedWorkOrders.filter((item) => item !== id)
      : [...selectedWorkOrders, id]

    updateSelectedWorkOrders(updated)
  }

  // ================= SELECT ALL / UNSELECT ALL =================

  const allWorkOrdersSelected =
    workOrders.length > 0 &&
    workOrders.every((workOrder) => selectedWorkOrders.includes(String(workOrder.id)))

  const handleSelectAllWorkOrders = () => {
    if (allWorkOrdersSelected) {
      updateSelectedWorkOrders([])
    } else {
      updateSelectedWorkOrders(workOrders.map((workOrder) => String(workOrder.id)))
    }
  }

  // ================= SELECTED WORK ORDER NAMES =================

  const selectedWorkOrderData = workOrders.filter((workOrder) =>
    selectedWorkOrders.includes(String(workOrder.id)),
  )

  const selectedWorkOrderNames = selectedWorkOrderData
    .map((workOrder) => workOrder.work_order_no)
    .filter(Boolean)
    .join(', ')

  // ================= CALCULATE AMOUNT =================

  useEffect(() => {
    let cancelled = false

    const calculateAmount = async () => {
      if (selectedWorkOrders.length === 0) {
        setCalculatingAmount(false)

        // Preserve the existing amount in edit mode.
        if (mode !== 'edit') {
          setFormData((prev) => ({
            ...prev,
            amount: '',
          }))
        }

        return
      }

      try {
        setCalculatingAmount(true)

        const response = await api.post('/pbg-master/calculate-total', {
          work_order_ids: selectedWorkOrders.map(Number),
        })

        if (cancelled) return

        const total = response.data?.data?.grand_total

        if (total !== undefined && total !== null) {
          setFormData((prev) => ({
            ...prev,
            amount: total,
          }))

          setErrors((prev) => ({
            ...prev,
            amount: '',
          }))
        }
      } catch (error) {
        if (cancelled) return

        console.error('CALCULATE TOTAL ERROR:', error)
        console.error('SERVER RESPONSE:', error.response?.data)

        toast.error(error.response?.data?.message || 'Failed to calculate Work Order amount')
      } finally {
        if (!cancelled) {
          setCalculatingAmount(false)
        }
      }
    }

    calculateAmount()

    return () => {
      cancelled = true
    }
  }, [selectedWorkOrders, mode])

  // ================= STATUS CHANGE =================

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_active: e.target.value === 'true',
    }))

    setErrors((prev) => ({
      ...prev,
      is_active: '',
    }))
  }

  // ================= FORM SUBMIT =================

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validatePBG(formData)

    if (selectedWorkOrders.length === 0) {
      validationErrors.work_order_ids = 'Please select at least one Work Order'
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    const payload = {
      pbg_no: formData.pbg_no,
      start_date: formData.start_date,
      end_date: formData.end_date,

      amount: formData.amount !== '' && formData.amount != null ? Number(formData.amount) : null,

      nicsi_reg_no: formData.nicsi_reg_no || null,
      nicsi_reg_date: formData.nicsi_reg_date || null,

      bank_charges:
        formData.bank_charges !== '' && formData.bank_charges != null
          ? Number(formData.bank_charges)
          : null,

      pbg_upload_path: formData.pbg_upload_path || null,
      is_active: Boolean(formData.is_active),

      work_order_ids: selectedWorkOrders.map(Number),
    }

    console.log('PBG PAYLOAD:', payload)

    onSubmit(payload)
  }

  // ================= UI =================

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              {/* PBG NUMBER */}

              <CCol md={12}>
                <CFormLabel>
                  PBG No <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="pbg_no"
                  value={formData?.pbg_no || ''}
                  onChange={handleChange}
                  placeholder="Enter PBG number"
                  maxLength={255}
                  invalid={!!errors.pbg_no}
                  feedback={errors.pbg_no}
                />
              </CCol>

              {/* START DATE */}

              <CCol md={6}>
                <CFormLabel>
                  Start Date <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="date"
                  name="start_date"
                  value={formData?.start_date || ''}
                  onChange={handleChange}
                  invalid={!!errors.start_date}
                  feedback={errors.start_date}
                />
              </CCol>

              {/* END DATE */}

              <CCol md={6}>
                <CFormLabel>
                  End Date <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="date"
                  name="end_date"
                  value={formData?.end_date || ''}
                  onChange={handleChange}
                  invalid={!!errors.end_date}
                  feedback={errors.end_date}
                />
              </CCol>

              {/* WORK ORDER MULTISELECT */}

              <CCol md={6}>
                <CFormLabel>
                  Work Order <span className="text-danger">*</span>
                </CFormLabel>

                <div ref={workOrderRef} style={{ position: 'relative' }}>
                  <CButton
                    type="button"
                    color="light"
                    className="w-100 text-start border"
                    onClick={() => setWorkOrderOpen((previous) => !previous)}
                    disabled={loadingWorkOrders}
                    style={{
                      minHeight: '38px',
                      backgroundColor: '#fff',
                      color: selectedWorkOrders.length ? '#212529' : '#6c757d',
                      position: 'relative',
                      paddingRight: '40px',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                    }}
                  >
                    <span className="d-block text-truncate">
                      {loadingWorkOrders
                        ? 'Loading Work Orders...'
                        : selectedWorkOrderNames || 'Select Work Order'}
                    </span>

                    <span
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '12px',
                        color: '#212529',
                      }}
                    >
                      ▼
                    </span>
                  </CButton>

                  {workOrderOpen && (
                    <div
                      className="border rounded bg-white shadow-sm"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                        marginTop: '2px',
                        maxHeight: '250px',
                        overflowY: 'auto',
                      }}
                    >
                      {workOrders.length === 0 ? (
                        <div className="px-3 py-2 text-muted">
                          {loadingWorkOrders ? 'Loading Work Orders...' : 'No Work Orders found'}
                        </div>
                      ) : (
                        <>

                          {/* SELECT ALL / UNSELECT ALL */}

                          <div
                            className="px-3 py-2 border-bottom d-flex align-items-center"
                            style={{ cursor: 'pointer' }}
                            onClick={handleSelectAllWorkOrders}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input me-2 mt-0"
                              checked={allWorkOrdersSelected}
                              onChange={handleSelectAllWorkOrders}
                              onClick={(e) => e.stopPropagation()}
                            />

                            <span>{allWorkOrdersSelected ? 'Unselect All' : 'Select All'}</span>
                          </div>

                          {/* INDIVIDUAL WORK ORDERS */}

                          {workOrders.map((workOrder) => {
                            const selected = selectedWorkOrders.includes(String(workOrder.id))

                            return (
                              <div
                                key={workOrder.id}
                                className="px-3 py-2 d-flex align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleWorkOrderSelect(workOrder)}
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2 mt-0"
                                  checked={selected}
                                  onChange={() => handleWorkOrderSelect(workOrder)}
                                  onClick={(e) => e.stopPropagation()}
                                />

                                <span>{workOrder.work_order_no || `WO ID: ${workOrder.id}`}</span>
                              </div>
                            )
                          })}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <small className="text-muted">Select one or multiple Work Orders</small>

                {errors.work_order_ids && (
                  <div className="text-danger small mt-1">{errors.work_order_ids}</div>
                )}
              </CCol>

              {/* AMOUNT */}

              <CCol md={6}>
                <CFormLabel>
                  Amount <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="number"
                  name="amount"
                  value={formData?.amount ?? ''}
                  placeholder={calculatingAmount ? 'Calculating amount...' : 'Calculated Amount'}
                  disabled={selectedWorkOrders.length === 0 || calculatingAmount}
                  readOnly
                  min="0"
                  step="0.01"
                  invalid={!!errors.amount}
                  feedback={errors.amount}
                />
              </CCol>

              {/* NICSI REGISTRATION NUMBER */}

              <CCol md={6}>
                <CFormLabel>NICSI Registration No</CFormLabel>

                <CFormInput
                  name="nicsi_reg_no"
                  value={formData?.nicsi_reg_no || ''}
                  onChange={handleChange}
                  placeholder="Enter NICSI registration number"
                  maxLength={255}
                  invalid={!!errors.nicsi_reg_no}
                  feedback={errors.nicsi_reg_no}
                />
              </CCol>

              {/* NICSI REGISTRATION DATE */}

              <CCol md={6}>
                <CFormLabel>NICSI Registration Date</CFormLabel>

                <CFormInput
                  type="date"
                  name="nicsi_reg_date"
                  value={formData?.nicsi_reg_date || ''}
                  onChange={handleChange}
                  invalid={!!errors.nicsi_reg_date}
                  feedback={errors.nicsi_reg_date}
                />
              </CCol>

              {/* BANK CHARGES */}

              <CCol md={6}>
                <CFormLabel>Bank Charges</CFormLabel>

                <CFormInput
                  type="number"
                  name="bank_charges"
                  value={formData?.bank_charges ?? ''}
                  onChange={handleChange}
                  placeholder="Enter bank charges"
                  min="0"
                  step="0.01"
                  invalid={!!errors.bank_charges}
                  feedback={errors.bank_charges}
                />
              </CCol>

              {/* STATUS */}

              <CCol md={6}>
                <CFormLabel>
                  Status <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="is_active"
                  value={String(formData?.is_active ?? true)}
                  onChange={handleStatusChange}
                  invalid={!!errors.is_active}
                  feedback={errors.is_active}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </CFormSelect>
              </CCol>

              {/* PBG DOCUMENT */}

              <CCol md={12}>
                <CFormLabel>PBG Document</CFormLabel>

                <CFormInput
                  type="file"
                  name="pbg_upload_path"
                  onChange={handleChange}
                  accept=".pdf,application/pdf"
                  invalid={!!errors.pbg_upload_path}
                />

                {errors.pbg_upload_path && (
                  <div className="text-danger small mt-1">{errors.pbg_upload_path}</div>
                )}

                {formData?.pbg_upload_path && (
                  <small className="text-muted d-block mt-1">
                    Existing/Selected document: {formData.pbg_upload_path}
                  </small>
                )}
              </CCol>

              {/* SUBMIT */}

              <CCol xs={12}>
                <CButton type="submit" color="primary">
                  {mode === 'edit' ? 'Update PBG' : 'Create PBG'}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PBGFormComponent
