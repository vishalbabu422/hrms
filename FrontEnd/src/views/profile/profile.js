import React, { useEffect, useState } from 'react'
import { getEmployeeById } from '../../services/employeeProfileService'
import { CAvatar, CBadge, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'
import './profile.css'

const InfoField = ({ label, value }) => (
  <div className="info-field">
    <div className="info-label">{label}</div>
    <div className="info-value">{value || '-'}</div>
  </div>
)

const Profile = () => {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    fetchEmployee()
  }, [])

  const fetchEmployee = async () => {
    try {
      setLoading(true)

      const response = await getEmployeeById(user.id)

      setEmployee(response.data.data)
    } catch (error) {
      console.error('Employee API Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-5">Loading...</div>
  }

  const currentDesignation =
    employee?.employeeDesignations?.find((item) => item.is_current)?.designation
      ?.designation_name || '-'

  const currentDivision =
    employee?.employeeDivisions?.find((item) => item.is_current)?.division?.division_name ||
    employee?.employeeDivisions?.[employee?.employeeDivisions?.length - 1]?.division
      ?.division_name ||
    '-'

  return (
    <CContainer fluid>
      {/* Profile Header */}

      <CCard className="shadow-sm mb-4 profile-header-card">
        <CCardBody>
          <div className="d-flex align-items-center">
            <CAvatar className="profile-avatar">
              <CIcon icon={cilUser} size="xl" />
            </CAvatar>

            <div className="ms-3 flex-grow-1">
              <h4 className="mb-1 profile-name">
                {employee?.salutation} {employee?.first_name} {employee?.middle_name ?? ''}{' '}
                {employee?.last_name ?? ''}
              </h4>

              <div className="profile-subtitle">Employee Code: {employee?.employee_code}</div>

              {/* <div className="profile-stats">
                <CBadge color="success">
                  {employee?.account_status || 'Active'}
                </CBadge>

                <CBadge color="primary">
                  {currentDesignation}
                </CBadge>

                <CBadge color="info">
                  {currentDivision}
                </CBadge>

                <CBadge color="warning">
                  {employee?.employee_category || '-'}
                </CBadge>
              </div> */}
            </div>
          </div>
        </CCardBody>
      </CCard>

      <CRow>
        {/* Personal Information */}

        <CCol lg={6}>
          <CCard className="shadow-sm mb-4 profile-card">
            <div className="profile-section-title">Personal Information</div>

            <CCardBody className="p-0">
              <InfoField label="Email" value={employee?.email} />

              <InfoField label="Contact Number" value={employee?.contact_no} />

              <InfoField label="Date Of Birth" value={employee?.EmployeeDetail?.date_of_birth} />

              <InfoField label="Gender" value={employee?.EmployeeDetail?.gender} />

              <InfoField label="Marital Status" value={employee?.EmployeeDetail?.marital_status} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Employment Information */}

        <CCol lg={6}>
          <CCard className="shadow-sm mb-4 profile-card">
            <div className="profile-section-title">Employment Information</div>

            <CCardBody className="p-0">
              <InfoField label="Employee Code" value={employee?.employee_code} />

              <InfoField label="Designation" value={currentDesignation} />

              <InfoField label="Division" value={currentDivision} />

              <InfoField label="Mode Of Working" value={employee?.mode_of_working} />

              <InfoField label="State Of Working" value={employee?.state_of_working} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Service Details */}

        <CCol lg={6}>
          <CCard className="shadow-sm mb-4 profile-card">
            <div className="profile-section-title">Service Details</div>

            <CCardBody className="p-0">
              <InfoField label="Joining Date" value={employee?.date_of_joining} />

              <InfoField label="Probation End Date" value={employee?.probation_end_date} />

              <InfoField label="Confirmation Date" value={employee?.confirmation_date} />

              <InfoField label="Notice Period" value={employee?.notice_period_days} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Other Information */}

        <CCol lg={6}>
          <CCard className="shadow-sm mb-4 profile-card">
            <div className="profile-section-title">Other Information</div>

            <CCardBody className="p-0">
              <InfoField label="Employee Category" value={employee?.employee_category} />

              <InfoField label="Account Status" value={employee?.account_status} />

              <InfoField label="Gazetted" value={employee?.is_gazetted ? 'Yes' : 'No'} />

              <InfoField label="HR Verified" value={employee?.hr_verified ? 'Yes' : 'No'} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Profile
