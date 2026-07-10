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
import CompanySelect from '../components/company-select'
import OrganizationSelect from '../components/organization-select'
import { validateEmpanelment } from '../../validations/empanelmentValidation'

const EmpanelmentFormComponent = ({ initialData, mode, onSubmit }) => {
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

    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : name === 'is_active' ? value === 'true' : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validateEmpanelment(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) return

    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
    )

    const finalData = Object.fromEntries(Object.entries(cleanedData).filter(([_, v]) => v !== ''))

    onSubmit(finalData)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <OrganizationSelect
                name="organization_id"
                value={formData?.organization_id}
                onChange={handleChange}
                label="Organization"
                placeholder="Select Organisation"
                colSize={12}
              />

              <CCol md={6}>
                <CompanySelect
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                  label="Company"
                  placeholder="Select Company"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Category <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  invalid={!!errors.category}
                  feedback={errors.category}
                  placeholder="Enter category"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Empanelment No <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  name="empanelment_no"
                  value={formData.empanelment_no || ''}
                  onChange={handleChange}
                  disabled={mode === 'edit'}
                  invalid={!!errors.empanelment_no}
                  feedback={errors.empanelment_no}
                  placeholder="Enter empanelment number"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Date <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                  invalid={!!errors.date}
                  feedback={errors.date}
                  placeholder="Select date"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Short Code <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  name="shortcode"
                  value={formData.shortcode || ''}
                  onChange={handleChange}
                  invalid={!!errors.shortcode}
                  feedback={errors.shortcode}
                  placeholder="Enter short code"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  RFE <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  name="rfe"
                  value={formData.rfe || ''}
                  onChange={handleChange}
                  invalid={!!errors.rfe}
                  feedback={errors.rfe}
                  placeholder="Enter RFE"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>AMC (%)</CFormLabel>
                <CFormInput
                  name="amc"
                  value={formData.amc || ''}
                  placeholder="Enter AMC"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="99.99"
                  step="0.01"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>AGM (%)</CFormLabel>
                <CFormInput
                  name="agm"
                  value={formData.agm || ''}
                  placeholder="Enter AGM"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="99.99"
                  step="0.01"
                />
              </CCol>

              <CCol md={3}>
                <CFormLabel>
                  Leaves (Per Month) <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  name="leaves_per_month"
                  value={formData.leaves_per_month || ''}
                  onChange={handleChange}
                  invalid={!!errors.leaves_per_month}
                  feedback={errors.leaves_per_month}
                  placeholder="Enter leaves per month"
                />
              </CCol>

              <CCol md={3}>
                <CFormLabel>
                  Leave Category <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="leave_category"
                  value={String(formData.leave_category || '')}
                  onChange={handleChange}
                  invalid={!!errors.leave_category}
                  feedback={errors.leave_category}
                >
                  <option value="">Select Leave Category</option>
                  <option value="calendar_mon">Calendar Month</option>
                  <option value="calendar_yr">Calendar Year</option>
                  <option value="fin_yr">Financial Year</option>
                  <option value="wo_to_wo">Work Order Based</option>
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormLabel>Carry Forward</CFormLabel>
                <CFormSelect
                  name="carry_forward"
                  value={String(formData.carry_forward)}
                  onChange={handleChange}
                >
                  <option value="">Select Carry Forward</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormLabel>Maternity</CFormLabel>
                <CFormSelect
                  name="maternity_leaves"
                  value={String(formData.maternity_leaves)}
                  onChange={handleChange}
                >
                  <option value="">Select Maternity</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </CFormSelect>
              </CCol>

              <CCol md={6}>
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
                  placeholder="Select start date"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Effective To</CFormLabel>
                <CFormInput
                  type="date"
                  name="effective_to"
                  value={formData.effective_to || ''}
                  onChange={handleChange}
                  placeholder="Select end date"
                />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Remarks</CFormLabel>
                <CFormTextarea
                  name="remarks"
                  value={formData.remarks || ''}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="file"
                  name="doc_path"
                  label="Upload Empanelment"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    setFormData({
                      ...formData,
                      doc_file: file,
                    })
                    accept = '.pdf,.doc,.docx,.jpg,.png'
                  }}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Status <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="is_active"
                  value={String(formData.is_active ?? '')}
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

export default EmpanelmentFormComponent