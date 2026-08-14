import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { CButton, CCard, CCardBody, CForm, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowRight,
  cilChart,
  cilHeadphones,
  cilLockLocked,
  cilPeople,
  cilSettings,
  cilShieldAlt,
  cilUser,
} from '@coreui/icons'

import './Login.css'

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
    <div className="login-page">
      {/* =========================
        HEADER
    ========================== */}

      <header className="login-header">
        {/* <div className="gov-brand">
          <img src="/assets/government-emblem.svg" alt="Government of India" />
          <div className="gov-text">
            <span>Government of India</span>
          </div>
        </div> */}
      </header>

      {/* =========================
        MAIN CONTENT
    ========================== */}

      <main className="login-main">
        {/* =========================
          LEFT SECTION
      ========================== */}

        <section className="login-intro">
          <div className="intro-content">
            <h1>Workforce Hub</h1>

            <h2>Unified Workforce Management Platform</h2>

            <div className="intro-line"></div>

            <p className="intro-description">
              A secure and unified platform for efficient human resource management.
            </p>

            {/* FEATURES */}

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilShieldAlt} />
                </div>

                <div className="feature-content">
                  <h3>Secure &amp; Reliable</h3>
                  <p>Enterprise-grade workforce security</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilPeople} />
                </div>

                <div className="feature-content">
                  <h3>Employee Centric</h3>
                  <p>Simplified employee management</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilSettings} />
                </div>

                <div className="feature-content">
                  <h3>Smart Workflows</h3>
                  <p>Faster approvals and processes</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilChart} />
                </div>

                <div className="feature-content">
                  <h3>Insights &amp; Reports</h3>
                  <p>Data-driven workforce decisions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
          RIGHT LOGIN SECTION
      ========================== */}

        <section className="login-auth">
          <div className="auth-background-shape shape-one"></div>

          <div className="auth-background-shape shape-two"></div>

          {/* LOGIN CARD */}

          <CCard className="login-card">
            <CCardBody>
              {/* CARD HEADER */}

              <div className="login-card-header">
                <div className="login-user-icon">
                  <CIcon icon={cilUser} />
                </div>

                <h2>Welcome Back!</h2>

                <p>Access your Workforce Hub account securely</p>
              </div>

              {/* ==========================
                LOCAL LOGIN
            =========================== */}

              {showLocalLogin && (
                <CForm onSubmit={handleSubmit}>
                  {/* USERNAME */}

                  <div className="form-group">
                    <label htmlFor="username">Username / Email ID</label>

                    <div className="input-wrapper">
                      <CIcon icon={cilUser} className="input-icon" />

                      <CFormInput
                        id="username"
                        type="email"
                        placeholder="Enter your username or email"
                        autoComplete="username"
                        value={form.email}
                        className="login-input"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div className="form-group">
                    <div className="password-label">
                      <label htmlFor="password">Password</label>

                      <CButton color="link" className="forgot-password" type="button">
                        Forgot Password?
                      </CButton>
                    </div>

                    <div className="input-wrapper">
                      <CIcon icon={cilLockLocked} className="input-icon" />

                      <CFormInput
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={form.password}
                        className="login-input"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* ERROR */}

                  {error && <div className="login-error">{error?.message || error}</div>}

                  {/* LOGIN BUTTON */}

                  {/* <CButton
                    type="submit"
                    className="sign-in-button"
                    disabled={loading || !form.email || !form.password} */}

                  <CButton type="submit" className="sign-in-button" disabled={loading}>
                    <span>{loading ? 'Logging in...' : 'Login'}</span>

                    {!loading && <CIcon icon={cilArrowRight} />}
                  </CButton>
                </CForm>
              )}

              {/* ==========================
                SSO LOGIN
            =========================== */}

              {showSsoLogin && (
                <div className="sso-section">
                  {/* DIVIDER */}

                  {showLocalLogin && (
                    <div className="sso-divider">
                      <span></span>

                      <p>OR</p>

                      <span></span>
                    </div>
                  )}

                  {/* SSO BUTTON */}

                  <CButton
                    type="button"
                    className="sso-button"
                    disabled={!ssoLoginUrl}
                    onClick={handleSsoLogin}
                  >
                    Login with {ssoProvider || 'SSO'}
                  </CButton>
                </div>
              )}

              {/* ==========================
                INVALID CONFIG
            =========================== */}

              {!showLocalLogin && !showSsoLogin && (
                <div className="invalid-auth">
                  <strong>Authentication configuration is invalid.</strong>

                  <p>Please contact the system administrator.</p>
                </div>
              )}

              {/* ==========================
                FOOTER LINKS
            =========================== */}

              <div className="auth-links">
                <button type="button">
                  <CIcon icon={cilHeadphones} />

                  <span>Help &amp; Support</span>
                </button>

                <div className="link-divider"></div>

                <button type="button">
                  <CIcon icon={cilShieldAlt} />

                  <span>Privacy Policy</span>
                </button>

                <div className="link-divider desktop-only"></div>

                <button type="button" className="terms-link">
                  <span>Terms of Use</span>
                </button>
              </div>
            </CCardBody>
          </CCard>
        </section>
      </main>
    </div>
  )
}

export default Login
