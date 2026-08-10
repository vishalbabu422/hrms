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
import { validateSalaryStructure } from '../../validations/salaryStructureValidation'
import ValueTypeInput from '../components/ValueTypeInput'
import api from '../../api/axios'
import OrganizationSelect from '../components/organization-select'

const SalaryStructureForm = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [salaryComponents, setSalaryComponents] = useState([])
  const [selectedComponents, setSelectedComponents] = useState({})

  const fetchSalaryComponent = async () => {
    try {
      const res = await api.get(
        'salary-component?is_active=true&sort=id&fields=id%2Ccode%2Cvalue_type%2Camount%2Cpercentage',
      )
      setSalaryComponents(res.data?.data || [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch Salary Structure')
    }
  }

  useEffect(() => {
    fetchSalaryComponent()
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)

      // edit mode support
      if (initialData.components) {
        const mapped = {}
        initialData.components.forEach((item) => {
          mapped[item.component_id] = {
            checked: true,
            type: item.value_type,
            value: item.value,
          }
        })
        setSelectedComponents(mapped)
      }
    }
  }, [initialData])

  if (!formData) return null

  /* ================= CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target

    let updatedValue = value

    if (name === 'is_active') {
      updatedValue = value === 'true'
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue === '' ? null : updatedValue,
    }))
  }

  /* ================= COMPONENT LOGIC ================= */

  const handleComponentToggle = (item) => {
    setSelectedComponents((prev) => {
      const updated = { ...prev }

      if (updated[item.id]?.checked) {
        delete updated[item.id]
      } else {
        updated[item.id] = {
          checked: true,
          type: item.value_type,
          value: item.value_type === 'PERCENTAGE' ? item.percentage : item.amount,
        }
      }

      return updated
    })
  }

  const handleComponentChange = (id, field, value) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const componentsArray = Object.keys(selectedComponents)

    const validationErrors = validateSalaryStructure({
      ...formData,
      components: componentsArray,
    })

    if (componentsArray.length === 0) {
      validationErrors.components = 'Select at least one component'
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const componentsArray = Object.keys(selectedComponents).map((id) => {
      const component = selectedComponents[id]

      return {
        salary_component_id: Number(id),
        value_type: component.type,
        ...(component.type === 'PERCENTAGE'
          ? { percentage: component.value, amount: null }
          : { amount: component.value, percentage: null }),
      }
    })

    const payload = {
      ...formData,
      components: componentsArray,
    }

    onSubmit(payload)
  }

  /* ================= UI ================= */

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="shadow border-0 rounded-4">
          <CCardBody>
            <CForm onSubmit={handleSubmit} className="row g-4">
              <OrganizationSelect
                name="org_id"
                value={formData?.org_id}
                onChange={handleChange}
                label="Organization"
                placeholder="Select Organisation"
                colSize={12}
              />

              {/* Name */}
              <CCol md={12}>
                <CFormLabel>
                  Name <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  name="name"
                  placeholder="Name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  invalid={!!errors.name}
                  feedback={errors.name}
                />
              </CCol>
              {/* Description */}
              <CCol md={12}>
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  name="description"
                  placeholder="Description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={2}
                />
              </CCol>

              {/* COMPONENT ROW UI */}
              <CCol md={12}>
                <div className="p-3 border rounded-3 bg-light">
                  <h6 className="mb-3">
                    Components <span className="text-danger">*</span>
                  </h6>

                  {salaryComponents.map((item) => {
                    const selected = selectedComponents[item.id] || {}

                    return (
                      <div key={item.id} className="row align-items-center mb-3">
                        {/* Checkbox */}
                        <div className="col-md-3 d-flex align-items-center">
                          <input
                            type="checkbox"
                            checked={!!selected.checked}
                            onChange={() => handleComponentToggle(item)}
                            className="form-check-input me-2"
                          />
                          <label className="mb-0">{item.code}</label>
                        </div>

                        {/* ValueTypeInput */}
                        {selected.checked && (
                          <div className="col-md-6">
                            <div className="row">
                              <ValueTypeInput
                                showLabel={false}
                                colSize={6}
                                typeValue={selected.type}
                                inputValue={selected.value}
                                onTypeChange={(e) =>
                                  handleComponentChange(item.id, 'type', e.target.value)
                                }
                                onValueChange={(e) =>
                                  handleComponentChange(item.id, 'value', e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {errors.components && <div className="text-danger">{errors.components}</div>}
                </div>
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

export default SalaryStructureForm
