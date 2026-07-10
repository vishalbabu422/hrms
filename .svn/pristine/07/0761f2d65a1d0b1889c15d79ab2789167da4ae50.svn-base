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

const ModuleFormComponent = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? value === 'true' : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.module_name.trim()) {
      alert('Module Name is required')
      return
    }

    if (!formData.module_code.trim()) {
      alert('Module Code is required')
      return
    }

    onSubmit(formData)
  }

  return (
    <CCard>
      <CCardBody>
        <CForm className="row g-3" onSubmit={handleSubmit}>
          <CCol md={6}>
            <CFormLabel>Module Name</CFormLabel>
            <CFormInput name="module_name" value={formData.module_name} onChange={handleChange} />
          </CCol>

          <CCol md={6}>
            <CFormLabel>Module Code</CFormLabel>
            <CFormInput name="module_code" value={formData.module_code} onChange={handleChange} />
          </CCol>

          <CCol md={12}>
            <CFormLabel>Description</CFormLabel>
            <CFormTextarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </CCol>

          <CCol md={12}>
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

          <div className="mt-3">
            <CButton type="submit" color="primary">
              {mode === 'create' ? 'Save' : 'Update'}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ModuleFormComponent
