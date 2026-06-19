import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { validateSalaryAddon } from '../../validations/salaryAddonValidation'
import SalaryAddonView from './SalaryAddonView'

// import { validateEmployeeAddon } from '../../validations/employeeAddonValidation'

const SalaryAddonFormComponent = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData)

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  if (!formData) return null

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const validationErrors = validateSalaryAddon(formData)

    setErrors(validationErrors)

    return Object.keys(validationErrors).length === 0
  }
  /* ================= CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target

    let updatedValue = value

    if (name === 'is_active') {
      updatedValue = value === 'true'
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }))
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isValid = validateForm()

    console.log('VALIDATION : ', isValid)

    console.log('FORM DATA : ', formData)

    if (!isValid) return

    await onSubmit(formData)
  }

  /* ================= UI ================= */

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            <CForm onSubmit={handleSubmit} className="row g-3">
              {/* NAME */}
              <CCol md={6}>
                <CFormLabel>
                  Name <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  invalid={!!errors.name}
                  feedback={errors.name}
                />
              </CCol>

              {/* CODE */}
              <CCol md={6}>
                <CFormLabel>
                  Code <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="code"
                  placeholder="Enter Code"
                  value={formData.code || ''}
                  onChange={handleChange}
                  invalid={!!errors.code}
                  feedback={errors.code}
                />
              </CCol>

              {/* DESCRIPTION */}
              <CCol md={12}>
                <CFormLabel>Description</CFormLabel>

                <CFormTextarea
                  rows={4}
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </CCol>

              {/* TYPE */}
              <CCol md={6}>
                <CFormLabel>
                  Type <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect
                  name="addon_type"
                  value={formData.addon_type || ''}
                  onChange={handleChange}
                  invalid={!!errors.addon_type}
                  feedback={errors.addon_type}
                >
                  <option value="">Select Type</option>

                  <option value="EARNING">Earning</option>

                  <option value="DEDUCTION">Deduction</option>
                </CFormSelect>
              </CCol>

              {/* STATUS */}
              <CCol md={6}>
                <CFormLabel>Status</CFormLabel>

                <CFormSelect
                  name="is_active"
                  value={String(formData.is_active)}
                  onChange={handleChange}
                >
                  <option value="true">Active</option>

                  <option value="false">Inactive</option>
                </CFormSelect>
              </CCol>

              {/* TAXABLE */}
              <CCol md={6}>
                <CFormLabel className="mb-2 d-block">Taxable</CFormLabel>

                <div className="d-flex gap-4">
                  <CFormCheck
                    type="radio"
                    id="taxableYes"
                    name="taxable"
                    label="Yes"
                    value="true"
                    checked={formData.taxable === true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        taxable: e.target.value === 'true',
                      }))
                    }
                  />

                  <CFormCheck
                    type="radio"
                    id="taxableNo"
                    name="taxable"
                    label="No"
                    value="false"
                    checked={formData.taxable === false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        taxable: e.target.value === 'true',
                      }))
                    }
                  />
                </div>
              </CCol>

              {/* RECURRING */}
              <CCol md={6}>
                <CFormLabel className="mb-2 d-block">Recurring</CFormLabel>

                <div className="d-flex gap-4">
                  <CFormCheck
                    type="radio"
                    id="recurringYes"
                    name="recurring_allowed"
                    label="Yes"
                    value="true"
                    checked={formData.recurring_allowed === true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recurring_allowed: e.target.value === 'true',
                      }))
                    }
                  />

                  <CFormCheck
                    type="radio"
                    id="recurringNo"
                    name="recurring_allowed"
                    label="No"
                    value="false"
                    checked={formData.recurring_allowed === false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recurring_allowed: e.target.value === 'true',
                      }))
                    }
                  />
                </div>
              </CCol>

              {/* SUBMIT */}
              <CCol xs={12}>
                <CButton type="submit" color="primary">
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

export default SalaryAddonFormComponent
