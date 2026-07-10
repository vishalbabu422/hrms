import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'

const ExamFormComponent = ({ initialData, onSubmit, mode }) => {
  const defaultData = {
    exam_name: '',
    exam_type: '',
    passing_marks: '',
    is_active: true,
  }

  const [formData, setFormData] = useState(initialData || defaultData)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'is_active'
          ? value === 'true'
          : name === 'passing_marks'
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.exam_name.trim()) {
      alert('Examination Name is required')
      return
    }

    if (!formData.exam_type.trim()) {
      alert('Exam Type is required')
      return
    }

    if (!formData.passing_marks || formData.passing_marks <= 0) {
      alert('Passing Marks must be greater than 0')
      return
    }

    onSubmit(formData)
  }

  return (
    <CCard>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol md={4}>
              <CFormLabel>Examination Name</CFormLabel>
              <CFormInput
                type="text"
                name="exam_name"
                value={formData.exam_name}
                onChange={handleChange}
                placeholder="Enter examination name"
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel>Exam Type</CFormLabel>
              <CFormInput
                type="text"
                name="exam_type"
                value={formData.exam_type}
                onChange={handleChange}
                placeholder="Enter exam type"
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel>Passing Marks</CFormLabel>
              <CFormInput
                type="number"
                name="passing_marks"
                value={formData.passing_marks}
                onChange={handleChange}
                min="0"
                placeholder="Enter passing marks"
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel className="mt-2">Status</CFormLabel>
              <CFormSelect
                name="is_active"
                value={String(formData.is_active)}
                onChange={handleChange}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>

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

export default ExamFormComponent