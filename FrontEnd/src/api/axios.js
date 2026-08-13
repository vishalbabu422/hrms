import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// ==========================
// Attach Access Token
// ==========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// ==========================
// Handle Responses
// ==========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    const status = error.response?.status
    const code = error.response?.data?.code

    // If there is no response (network error)
    if (!error.response) {
      return Promise.reject(error)
    }

    // ==========================
    // Access Token Expired
    // ==========================
    if (status === 401 && code === 'ACCESS_TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        )

        const newAccessToken = refreshResponse.data.accessToken

        localStorage.setItem('accessToken', newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        return Promise.reject(refreshError)
      }
    }

    // ==========================
    // Authentication Errors
    // Let Redux/UI handle them
    // ==========================
    if (
      status === 401 &&
      [
        'SSO_INVALID',
        'INVALID_ACCESS_TOKEN',
        'USER_NOT_REGISTERED',
        'ACCOUNT_INACTIVE',
        'HR_APPROVAL_PENDING',
      ].includes(code)
    ) {
      localStorage.removeItem('accessToken')
    }

    return Promise.reject(error)
  },
)

export default api
