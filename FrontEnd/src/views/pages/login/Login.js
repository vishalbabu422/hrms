import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../../store/slices/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const { authMode, ssoLoginUrl, ssoProvider } = useSelector((state) => state.appConfig)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))

    if (result.type === 'auth/login/fulfilled') {
      navigate('/')
    }
  }

  const handleSsoLogin = () => {
    if (!ssoLoginUrl) {
      console.error('SSO login URL is not configured')
      return
    }
    window.location.replace(ssoLoginUrl)
  }
  const showLocalLogin = authMode === 'LOCAL' || authMode === 'BOTH'
  const showSsoLogin = authMode === 'SSO' || authMode === 'BOTH'

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5} lg={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {/* ========================== LOCAL LOGIN ========================== */}
                  {showLocalLogin && (
                    <CForm onSubmit={handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-body-secondary"> Sign In to your account </p>
                      {/* USERNAME */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Username"
                          autoComplete="username"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </CInputGroup>
                      {/* PASSWORD */}
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                      </CInputGroup>
                      <CRow className="align-items-center">
                        <CCol xs={6}>
                          <CButton
                            type="submit"
                            color="primary"
                            className="px-4"
                            disabled={loading || !form.email || !form.password}
                          >
                            {loading ? 'Logging in...' : 'Login'}
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-end">
                          <CButton color="link" className="px-0" type="button">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                      {/* LOGIN ERROR */}
                      {error && <div className="text-danger mt-3"> {error?.message || error} </div>}
                    </CForm>
                  )}
                  {/* ========================== SSO LOGIN ========================== */}
                  {showSsoLogin && (
                    <>
                      {/* Divider for BOTH */}
                      {showLocalLogin && (
                        <div className="d-flex align-items-center my-4">
                          <hr className="flex-grow-1" />
                          <span className="px-3 text-body-secondary"> OR </span>
                          <hr className="flex-grow-1" />
                        </div>
                      )}
                      <CButton
                        color="primary"
                        variant="outline"
                        className="w-100"
                        disabled={!ssoLoginUrl}
                        onClick={handleSsoLogin}
                      >
                        Login with {ssoProvider || 'SSO'}
                      </CButton>
                    </>
                  )}
                  {/* ========================== INVALID AUTH CONFIG ========================== */}
                  {!showLocalLogin && !showSsoLogin && (
                    <div className="text-center text-danger">
                      <strong> Authentication configuration is invalid. </strong>
                      <p className="text-body-secondary mt-2 mb-0">
                        Please contact the system administrator.
                      </p>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
