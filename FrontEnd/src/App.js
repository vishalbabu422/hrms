import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ssoLogin, restoreSession } from './store/slices/authSlice'
import SsoAccessError from './views/pages/sso/SsoAccessError'
import { loadAppConfig } from './store/slices/appConfigSlice'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Page600 = React.lazy(() => import('./views/pages/page500/Page500'))

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Loading = () => (
  <div className="pt-3 text-center">
    <CSpinner color="primary" variant="grow" />
  </div>
)

const SsoRedirect = () => {
  const { ssoLoginUrl } = useSelector((state) => state.appConfig)

  useEffect(() => {
    if (ssoLoginUrl) {
      window.location.replace(ssoLoginUrl)
    }
  }, [ssoLoginUrl])

  return <Loading />
}

const App = () => {
  const dispatch = useDispatch()
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const { user, error, loading, isAuthChecked } = useSelector((state) => state.auth)
  const { loaded, authMode } = useSelector((state) => state.appConfig)

  useEffect(() => {
    dispatch(loadAppConfig())
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const initAuth = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')

      try {
        if (token) {
          await dispatch(ssoLogin(token)).unwrap()

          window.history.replaceState({}, document.title, window.location.pathname)
        } else {
          await dispatch(restoreSession()).unwrap()
        }
      } catch (err) {
        console.error(err)
      }
    }

    initAuth()
  }, [loaded, dispatch])

  if (!loaded || loading || !isAuthChecked) {
    return <Loading />
  }
  if (error?.code) {
    return <SsoAccessError code={error.code} message={error.message} />
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />

          {/* Login */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : authMode === 'SSO' ? <SsoRedirect /> : <Login />
            }
          />

          {/* Home */}
          <Route
            path="/"
            element={
              user ? (
                <DefaultLayout />
              ) : authMode === 'LOCAL' ? (
                <Navigate to="/login" replace />
              ) : authMode === 'SSO' ? (
                <SsoRedirect />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* All other routes */}
          <Route
            path="/*"
            element={
              user ? (
                <DefaultLayout />
              ) : authMode === 'LOCAL' ? (
                <Navigate to="/login" replace />
              ) : authMode === 'SSO' ? (
                <SsoRedirect />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
