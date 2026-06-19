import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { validateOrganisation } from '../../validations/organisationValidation'

const OrganisationFormComponent = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    let updatedValue = value

    if (name === 'contact_phone') {
      updatedValue = value.replace(/\D/g, '')
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        updatedValue === '' ? null : name === 'is_active' ? updatedValue === 'true' : updatedValue,
    }))
  }

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  if (!formData) return null

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

  const validateForm = () => {
    const validationErrors = validateOrganisation(formData)
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
                  Organisation Name <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="org_name"
                  value={formData.org_name || ''}
                  onChange={handleChange}
                  invalid={!!errors.org_name}
                  feedback={errors.org_name}
                  placeholder="Enter organisation name"
                  maxLength={200}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Code <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="org_code"
                  value={formData.org_code || ''}
                  onChange={handleChange}
                  invalid={!!errors.org_code}
                  feedback={errors.org_code}
                  placeholder="Enter organisation code"
                  maxLength={50}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Contact Email</CFormLabel>

                <CFormInput
                  type="email"
                  name="contact_email"
                  value={formData.contact_email || ''}
                  onChange={handleChange}
                  invalid={!!errors.contact_email}
                  feedback={errors.contact_email}
                  placeholder="Enter contact email"
                  maxLength={120}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Contact Phone</CFormLabel>
                <CFormInput
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={handleChange}
                  placeholder="Enter contact phone"
                  maxLength={15}
                  pattern="[0-9]{10,15}"
                  title="Enter valid phone number (10-15 digits)"
                  invalid={!!errors.contact_phone}
                  feedback={errors.contact_phone}
                />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Address</CFormLabel>
                <CFormTextarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  rows={5}
                />
              </CCol>

              <CCol md={6}>
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

export default OrganisationFormComponent
