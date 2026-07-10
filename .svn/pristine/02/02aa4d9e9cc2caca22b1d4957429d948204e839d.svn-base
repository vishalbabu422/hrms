import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
  CRow,
} from '@coreui/react'

const Add = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3">
              {/* Organization Name */}
              <CCol md={6}>
                <CFormLabel htmlFor="orgName">Organization Name</CFormLabel>
                <CFormInput type="text" id="orgName" placeholder="Enter organization name" />
              </CCol>

              {/* Organization Code */}
              <CCol md={6}>
                <CFormLabel htmlFor="orgCode">Organization Code</CFormLabel>
                <CFormInput type="text" id="orgCode" placeholder="Enter unique organization code" />
              </CCol>

              {/* Contact Email */}
              <CCol md={6}>
                <CFormLabel htmlFor="contactEmail">Contact Email</CFormLabel>
                <CFormInput type="email" id="contactEmail" placeholder="Enter email address" />
              </CCol>

              {/* Contact Phone */}
              <CCol md={6}>
                <CFormLabel htmlFor="contactPhone">Contact Phone</CFormLabel>
                <CFormInput type="text" id="contactPhone" placeholder="Enter phone number" />
              </CCol>

              {/* Address */}
              <CCol xs={12}>
                <CFormLabel htmlFor="address">Address</CFormLabel>
                <CFormTextarea id="address" rows={3} placeholder="Enter organization address" />
              </CCol>

              {/* Is Active */}
              <CCol xs={12}>
                <CFormCheck
                  type="checkbox"
                  id="isActive"
                  label="Active Organization"
                  defaultChecked
                />
              </CCol>

              {/* Submit Button */}
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Save
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Add
