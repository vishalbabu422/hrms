import {
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'

import { useEffect, useState } from 'react'

const IncrementModal = ({ visible, onClose, employee, onSave }) => {
  const [formData, setFormData] = useState({
    current_ctc: '',
    new_ctc: '',
    increment_amount: '',
    increment_percentage: '',
    effective_from: '',
    remarks: '',
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        current_ctc: employee?.ctc || '',
        new_ctc: employee?.ctc || '',
        increment_amount: '',
        increment_percentage: '',
        effective_from: '',
        remarks: '',
      })
    }
  }, [employee])

  const handleChange = (e) => {
    const { name, value } = e.target

    const updated = {
      ...formData,
      [name]: value,
    }

    // AUTO CALCULATE
    if (name === 'new_ctc') {
      const oldCtc = Number(formData.current_ctc || 0)
      const newCtc = Number(value || 0)

      const incrementAmount = newCtc - oldCtc

      const incrementPercentage =
        oldCtc > 0
          ? ((incrementAmount / oldCtc) * 100).toFixed(2)
          : 0

      updated.increment_amount = incrementAmount
      updated.increment_percentage = incrementPercentage
    }

    setFormData(updated)
  }

  const handleSubmit = () => {
    const payload = {
      employee_id: employee?.employee_id,
      old_ctc: formData.current_ctc,
      new_ctc: formData.new_ctc,
      increment_amount: formData.increment_amount,
      increment_percentage: formData.increment_percentage,
      effective_from: formData.effective_from,
      remarks: formData.remarks,
    }

    onSave(payload)
  }

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="lg"
      alignment="center"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Add Salary Increment</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {/* EMPLOYEE INFO */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div className="d-flex justify-content-between flex-wrap gap-3">
            <div>
              <div className="text-muted small">Employee</div>
              <div className="fw-semibold">{employee?.name || '-'}</div>
            </div>

            <div>
              <div className="text-muted small">Current CTC</div>
              <div className="fw-semibold text-primary">
                ₹ {formData.current_ctc || 0}
              </div>
            </div>

            <div>
              <div className="text-muted small">Increment %</div>
              <div className="fw-semibold text-success">
                +{formData.increment_percentage || 0}%
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <CRow className="g-3">
          <CCol md={6}>
            <CFormLabel>Current CTC</CFormLabel>
            <CFormInput
              value={formData.current_ctc}
              readOnly
            />
          </CCol>

          <CCol md={6}>
            <CFormLabel>
              New CTC <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              type="number"
              name="new_ctc"
              value={formData.new_ctc}
              onChange={handleChange}
              placeholder="Enter revised CTC"
            />
          </CCol>

          <CCol md={6}>
            <CFormLabel>Increment Amount</CFormLabel>
            <CFormInput
              value={formData.increment_amount}
              readOnly
            />
          </CCol>

          <CCol md={6}>
            <CFormLabel>Increment Percentage</CFormLabel>
            <CFormInput
              value={formData.increment_percentage}
              readOnly
            />
          </CCol>

          <CCol md={6}>
            <CFormLabel>
              Effective From <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              type="date"
              name="effective_from"
              value={formData.effective_from}
              onChange={handleChange}
            />
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton
          color="light"
          onClick={onClose}
        >
          Cancel
        </CButton>

        <CButton
          color="primary"
          onClick={handleSubmit}
        >
          Save Increment
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default IncrementModal
