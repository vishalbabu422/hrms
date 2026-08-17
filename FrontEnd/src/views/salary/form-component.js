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
  CFormCheck,
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { validateSalaryComponent } from '../../validations/salaryComponentValidation'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import OrganizationSelect from '../components/organization-select'

const SalaryComponentForm = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [componentOptions, setComponentOptions] = useState([])

  /* ================= FETCH COMPONENTS ================= */

  const fetchComponentOptions = async () => {
    try {
      const res = await api.get('/salary-component?fields=id%2Ccode')

      setComponentOptions(res.data?.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchComponentOptions()
  }, [])

  useEffect(() => {
    if (initialData) setFormData(initialData)
  }, [initialData])

  if (!formData) return null

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const validationErrors = validateSalaryComponent(formData)
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

    if (name === 'base_type' && value === 'CTC') {
      setFormData((prev) => ({
        ...prev,
        base_type: value,
        base_component_id: null,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue === '' ? null : updatedValue,
    }))
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    let payload = { ...formData }

    if (payload.base_type === 'CTC') {
      payload.base_component_id = null
    }

    if (payload.value_type === 'FIXED') {
      payload.percentage = null
    }

    if (payload.value_type === 'PERCENTAGE') {
      payload.amount = null
    }

    if (!payload.value_type) {
      payload.amount = null
      payload.percentage = null
    }

    onSubmit(payload)
  }

  /* ================= UI ================= */

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            <CForm onSubmit={handleSubmit} className="row g-3">
              {/* Organization */}
              <OrganizationSelect
                name="org_id"
                value={formData?.org_id}
                onChange={handleChange}
                label="Organization"
                placeholder="Select Organization"
                colSize={12}
                invalid={!!errors.org_id}
                feedback={errors.org_id}
              />

              {/* Name */}
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
                />
              </CCol>

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
                />
              </CCol>

              {/* Type */}
              <CCol md={6}>
                <CFormLabel>
                  Type <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                  invalid={!!errors.type}
                >
                  <option value="">Select</option>
                  <option value="EARNING">Earning</option>
                  <option value="DEDUCTION">Deduction</option>
                </CFormSelect>
              </CCol>

              {/* Base Type */}
              <CCol md={6}>
                <CFormLabel>
                  Base Type <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="base_type"
                  value={formData.base_type || ''}
                  onChange={handleChange}
                  invalid={!!errors.base_type}
                >
                  <option value="">Select</option>
                  <option value="CTC">CTC</option>
                  <option value="COMPONENT">Component</option>
                </CFormSelect>
              </CCol>

              {/* Base Component */}
              {formData.base_type === 'COMPONENT' && (
                <CCol md={6}>
                  <CFormLabel>
                    Base Component <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormSelect
                    name="base_component_id"
                    value={formData.base_component_id || ''}
                    onChange={handleChange}
                    invalid={!!errors.base_component_id}
                  >
                    <option value="">Select Component</option>
                    {componentOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.code}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              )}

              {/* Value Type */}
              <CCol md={6}>
                <CFormLabel>Value Type</CFormLabel>
                <CFormSelect
                  name="value_type"
                  value={formData.value_type || ''}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="FIXED">Fixed</option>
                  <option value="PERCENTAGE">Percentage</option>
                </CFormSelect>
              </CCol>

              {/* Amount */}
              {formData.value_type === 'FIXED' && (
                <CCol md={6}>
                  <CFormLabel>
                    Amount <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    invalid={!!errors.amount}
                  />
                </CCol>
              )}

              {/* Percentage */}
              {formData.value_type === 'PERCENTAGE' && (
                <CCol md={6}>
                  <CFormLabel>
                    Percentage <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    name="percentage"
                    value={formData.percentage || ''}
                    onChange={handleChange}
                    invalid={!!errors.percentage}
                  />
                </CCol>
              )}

              {/* Priority */}
              <CCol md={6}>
                <CFormLabel>
                  Priority <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  name="calculation_priority"
                  value={formData.calculation_priority || 1}
                  onChange={handleChange}
                  invalid={!!errors.calculation_priority}
                />
              </CCol>

              {/* Status */}
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

              {/* Mandatory */}
              <CCol md={6} className="d-flex align-items-end">
                <CFormCheck
                  label="Is Mandatory"
                  name="is_mandatory"
                  checked={formData.is_mandatory || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_mandatory: e.target.checked,
                    }))
                  }
                />
              </CCol>

              <CCol md={6} className="d-flex align-items-end">
                <CFormCheck
                  label="Is PF"
                  name="is_pf"
                  checked={formData.is_pf || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_pf: e.target.checked,
                    }))
                  }
                />
              </CCol>

              {/* Submit */}
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

export default SalaryComponentForm
