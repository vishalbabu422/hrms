import React from 'react'
import { CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { cilWarning, cilUser, cilLockLocked, cilBan, cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useSelector } from 'react-redux'

const errorConfig = {
  USER_NOT_REGISTERED: {
    color: 'warning',
    icon: cilUser,
    title: 'User Not Registered',
    defaultMessage: 'Your Single Sign-On account is not registered in eHRMS.',
  },

  HR_APPROVAL_PENDING: {
    color: 'info',
    icon: cilReload,
    title: 'HR Approval Pending',
    defaultMessage: 'Your account has not yet been approved by HR.',
  },

  ACCOUNT_INACTIVE: {
    color: 'danger',
    icon: cilBan,
    title: 'Account Disabled',
    defaultMessage: 'Your account has been disabled. Please contact your administrator.',
  },

  SSO_INVALID: {
    color: 'danger',
    icon: cilLockLocked,
    title: 'Session Expired',
    defaultMessage: 'Your Single Sign-On session has expired. Please login again.',
  },

  DEFAULT: {
    color: 'secondary',
    icon: cilWarning,
    title: 'Access Denied',
    defaultMessage: 'You are not authorized to access this application.',
  },
}

const SsoAccessError = ({ code, message }) => {
  const { ssoPortalUrl = '/', ssoLoginUrl = '/login' } = useSelector((state) => state.appConfig)
  const config = errorConfig[code] || errorConfig.DEFAULT

  const loginAgain = () => {
    if (ssoLoginUrl) {
      window.location.replace(ssoLoginUrl)
    }
  }

  const returnToPortal = () => {
    if (ssoPortalUrl) {
      window.location.replace(ssoPortalUrl)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={7} lg={6}>
            <CCard className="shadow border-0">
              <CCardBody className="text-center p-5">
                <CIcon icon={config.icon} size="5xl" className={`text-${config.color} mb-4`} />

                <h2>{config.title}</h2>

                <p className="text-body-secondary mt-3">{message || config.defaultMessage}</p>

                <hr />

                <p className="small text-body-secondary">
                  If you believe this is an error, please contact your HR administrator or the eHRMS
                  support team.
                </p>

                <div className="d-grid gap-2 mt-4">
                  {code === 'SSO_INVALID' && (
                    <CButton color="primary" disabled={!ssoLoginUrl} onClick={loginAgain}>
                      Login Again
                    </CButton>
                  )}

                  <CButton color="primary" disabled={!ssoPortalUrl} onClick={returnToPortal}>
                    Return to Portal
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default SsoAccessError
