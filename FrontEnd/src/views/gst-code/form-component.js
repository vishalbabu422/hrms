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
  CFormTextarea,
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { validateGst } from '../../validations/gstValidation'

const GstFormComponent = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  if (!formData) return null

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: value === '' ? null : name === 'is_active' ? value === 'true' : value,
      }

      if (name === 'transaction_type') {
        if (value === 'INTER') {
          updated.cgst_rate = 0
          updated.sgst_rate = 0
          updated.gst_rate = 0
        }

        if (value === 'INTRA') {
          updated.igst_rate = 0
          updated.gst_rate = 0
        }
      }

      if (name === 'cgst_rate' || name === 'sgst_rate') {
        updated.gst_rate = Number(updated.cgst_rate) + Number(updated.sgst_rate)
      }

      if (name === 'igst_rate') {
        updated.gst_rate = Number(updated.igst_rate)
      }

      return updated
    })
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   onSubmit(formData)
  // }

  const handleSubmit = (e) => {
    e.preventDefault()

    const isValid = validateForm()

    if (!isValid) return

    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
    )

    const finalData = Object.fromEntries(Object.entries(cleanedData).filter(([_, v]) => v !== ''))

    onSubmit(finalData)
  }

  const isIntra = formData.transaction_type === 'INTRA'
  const isInter = formData.transaction_type === 'INTER'

  const validateForm = () => {
    const validationErrors = validateGst(formData)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel>
                  Code Type <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="code_type"
                  value={String(formData.code_type || '')}
                  onChange={handleChange}
                  invalid={!!errors.code_type}
                  feedback={errors.code_type}
                >
                  <option value="">Select Code Type</option>
                  <option value="hsn">HSN</option>
                  <option value="sac">SAC</option>
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Transaction <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="transaction_type"
                  value={String(formData.transaction_type || '')}
                  onChange={handleChange}
                >
                  <option value="INTER">Inter</option>
                  <option value="INTRA">Intra</option>
                </CFormSelect>
              </CCol>

              <CCol md={12}>
                <CFormLabel>
                  Code <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="code"
                  value={formData.code || ''}
                  onChange={handleChange}
                  disabled={mode === 'edit'}
                  invalid={!!errors.code}
                  feedback={errors.code}
                  placeholder="Enter code"
                  maxLength={10}
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>
                  Description <span className="text-danger">*</span>
                </CFormLabel>

                <CFormTextarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  invalid={!!errors.description}
                  feedback={errors.description}
                  placeholder="Enter description"
                  rows={4}
                />
              </CCol>

              {['cgst', 'sgst', 'igst', 'cess', 'other'].map((f) => {
                const isDisabled =
                  (isInter && (f === 'cgst' || f === 'sgst')) || (isIntra && f === 'igst')

                return (
                  <CCol md={4} key={f}>
                    <CFormLabel>{f.toUpperCase()} Rate (%)</CFormLabel>
                    <CFormInput
                      type="number"
                      name={f + '_rate'}
                      value={formData[f + '_rate'] ?? ''}
                      onChange={handleChange}
                      placeholder="0.00"
                      disabled={isDisabled}
                      min="0"
                      max="99.99"
                      step="0.01"
                    />
                  </CCol>
                )
              })}

              <CCol md={4}>
                <CFormLabel>GST</CFormLabel>
                <CFormInput
                  type="number"
                  name="gst_rate"
                  value={formData.gst_rate || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled
                  min="0"
                  max="99.99"
                  step="0.01"
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel>
                  Effective From <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="date"
                  name="effective_from"
                  value={formData.effective_from || ''}
                  onChange={handleChange}
                  invalid={!!errors.effective_from}
                  feedback={errors.effective_from}
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Effective To</CFormLabel>

                <CFormInput
                  type="date"
                  name="effective_to"
                  value={formData.effective_to || ''}
                  onChange={handleChange}
                  invalid={!!errors.effective_to}
                  feedback={errors.effective_to}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>
                  Status <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="is_active"
                  value={String(formData.is_active)}
                  onChange={handleChange}
                  invalid={!!errors.is_active}
                  feedback={errors.is_active}
                >
                  <option value="">Select Status</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </CFormSelect>
              </CCol>

              <CCol xs={12}>
                <CButton type="submit" className="btn btn-primary">
                  {mode === 'edit' ? 'Update' : 'Create'}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default GstFormComponent
