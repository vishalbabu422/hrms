import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CForm, CFormInput, CFormCheck } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import './HRMLogin.css'
import {
  cilUser,
  cilLockLocked,
  cilShieldAlt,
  cilPeople,
  cilChart,
  cilSettings,
  cilArrowRight,
  cilReload,
  cilMobile,
  cilHeadphones,
} from '@coreui/icons'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [captcha, setCaptcha] = useState('7XK9B')
  const [captchaInput, setCaptchaInput] = useState('')
  const [loading, setLoading] = useState(false)

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''

    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    setCaptcha(result)
    setCaptchaInput('')
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (!captchaInput) {
      alert('Please enter captcha')
      return
    }

    if (captchaInput.toUpperCase() !== captcha) {
      alert('Invalid captcha')
      generateCaptcha()
      return
    }

    setLoading(true)

    // API login logic will come here
    console.log('Login submitted')

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="login-page">
     

      <header className="login-header">
        <div className="gov-brand">
          <img src="/assets/government-emblem.svg" alt="Government of India" />

          <div className="gov-text">
            <span>Government of India</span>
          </div>
        </div>
      </header>

      
      <main className="login-main">
        {/* =================================================
            LEFT SECTION
        ================================================== */}

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
              {/* Feature 1 */}
              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilShieldAlt} />
                </div>

                <div className="feature-content">
                  <h3>Secure & Reliable</h3>
                  <p>Enterprise-grade workforce security</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilPeople} />
                </div>

                <div className="feature-content">
                  <h3>Employee Centric</h3>
                  <p>Simplified employee management</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilSettings} />
                </div>

                <div className="feature-content">
                  <h3>Smart Workflows</h3>
                  <p>Faster approvals and processes</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="feature-item">
                <div className="feature-icon">
                  <CIcon icon={cilChart} />
                </div>

                <div className="feature-content">
                  <h3>Insights & Reports</h3>
                  <p>Data-driven workforce decisions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            RIGHT SECTION
        ================================================== */}

        <section className="login-auth">
          <div className="auth-background-shape shape-one"></div>
          <div className="auth-background-shape shape-two"></div>

          <CCard className="login-card">
            <CCardBody>
              {/* LOGIN HEADER */}

              <div className="login-card-header">
                <div className="login-user-icon">
                  <CIcon icon={cilUser} />
                </div>

                <h2>Welcome Back!</h2>

                <p>Access your Workforce Hub account securely</p>
              </div>

              {/* FORM */}

              <CForm onSubmit={handleLogin}>
                {/* USERNAME */}

                <div className="form-group">
                  <label>Username / Email ID</label>

                  <div className="input-wrapper">
                    <CIcon icon={cilUser} className="input-icon" />

                    <CFormInput
                      type="text"
                      placeholder="Enter your username or email"
                      className="login-input"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div className="form-group">
                  <div className="password-label">
                    <label>Password</label>

                    <button
                      type="button"
                      className="forgot-password"
                      onClick={() => console.log('Forgot password')}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="input-wrapper">
                    <CIcon icon={cilLockLocked} className="input-icon" />

                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="login-input password-input"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* REMEMBER ME */}

                <div className="remember-row">
                  <CFormCheck id="rememberMe" label="Remember me" />
                </div>

                {/* CAPTCHA */}

                <div className="form-group captcha-group">
                  <label>Captcha</label>

                  <div className="captcha-row">
                    <div className="captcha-input-wrapper">
                      <CIcon icon={cilShieldAlt} className="input-icon" />

                      <CFormInput
                        type="text"
                        placeholder="Enter captcha"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className="login-input"
                      />
                    </div>

                    <div className="captcha-box">
                      <span>{captcha}</span>
                    </div>

                    <button
                      type="button"
                      className="captcha-refresh"
                      onClick={generateCaptcha}
                      title="Refresh captcha"
                    >
                      <CIcon icon={cilReload} />
                    </button>
                  </div>
                </div>

                {/* SIGN IN */}

                <CButton type="submit" className="sign-in-button" disabled={loading}>
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>

                  {!loading && <CIcon icon={cilArrowRight} />}
                </CButton>
              </CForm>

              {/* FOOTER LINKS */}

              <div className="auth-links">
                <button type="button">
                  <CIcon icon={cilHeadphones} />
                  <span>Help & Support</span>
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

          {/* COPYRIGHT */}
        </section>
      </main>
    </div>
  )
}

export default Login
