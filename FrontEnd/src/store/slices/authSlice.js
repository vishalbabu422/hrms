import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

// 🔐SSO LOGIN
export const ssoLogin = createAsyncThunk('auth/ssoLogin', async (token, { rejectWithValue }) => {
  try {
    const res = await API.post(
      `/auth/ssoLogin?token=${encodeURIComponent(token)}`,
      {},
      {
        withCredentials: true,
      },
    )

    localStorage.setItem('accessToken', res.data.accessToken)

    return res.data.user
  } catch (err) {
    localStorage.removeItem('accessToken')
    return rejectWithValue(err.response?.data || 'SSO Login failed')
  }
})
// 🔐 SSO LOGOUT (API call)
export const ssoLogout = createAsyncThunk('auth/ssoLogout', async (_, { rejectWithValue }) => {
  try {
    const res = await API.post(
      '/auth/ssoLogout',
      {},
      {
        withCredentials: true,
      },
    )

    localStorage.removeItem('accessToken')

    return true
  } catch (err) {
    localStorage.removeItem('accessToken')
    return rejectWithValue(err.response?.data || 'Logout failed')
  }
})

// 🔐 LOGIN
export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', data)

    localStorage.setItem('accessToken', res.data.accessToken)

    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Login failed')
  }
})

// 🔐 LOGOUT (API call)
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await API.post('/auth/logout')
  localStorage.removeItem('accessToken')
})

// 🔁 RESTORE SESSION (on refresh)
export const restoreSession = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      return rejectWithValue('No Token')
    }

    const res = await API.get('/auth/me', {
      withCredentials: true,
    })
    return res.data.user
  } catch (err) {
    localStorage.removeItem('accessToken')
    return rejectWithValue('Session expired')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthChecked: false,
  },
  reducers: {
    logoutLocal: (state) => {
      state.user = null
      state.isAuthChecked = true
      localStorage.removeItem('accessToken')
    },
  },
  extraReducers: (builder) => {
    builder
      //SSO Login
      .addCase(ssoLogin.pending, (state) => {
        state.loading = true
      })
      .addCase(ssoLogin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthChecked = true
      })
      .addCase(ssoLogin.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.payload
        state.isAuthChecked = true
      })
      //SSO LOGOUT
      .addCase(ssoLogout.pending, (state) => {
        state.loading = true
      })

      .addCase(ssoLogout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.error = null
        state.isAuthChecked = true
      })

      .addCase(ssoLogout.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.payload
        state.isAuthChecked = true
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthChecked = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthChecked = true
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthChecked = true
      })

      // RESTORE SESSION
      .addCase(restoreSession.pending, (state) => {
        state.isAuthChecked = false // ⏳ still checking
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthChecked = true
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null
        state.isAuthChecked = true
      })
  },
})

export const { logoutLocal } = authSlice.actions
export default authSlice.reducer
