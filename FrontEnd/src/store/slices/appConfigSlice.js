import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const loadAppConfig = createAsyncThunk('appConfig/load', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/auth/config')
    const config = res.data.config

    return {
      authMode: config.auth_mode,
      ssoLoginUrl: config.sso_login_url,
      ssoProvider: config.sso_provider,
      ssoPortalUrl: config.sso_portal_url,
      enableSsoValidation: config.enable_sso_validation,
    }
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Unable to load configuration')
  }
})

const appConfigSlice = createSlice({
  name: 'appConfig',

  initialState: {
    authMode: 'LOCAL',
    ssoProvider: null,
    ssoPortalUrl: null,
    ssoLoginUrl: null,
    enableSsoValidation: false,
    loaded: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(loadAppConfig.fulfilled, (state, action) => {
      Object.assign(state, action.payload)
      state.loaded = true
    })

    builder.addCase(loadAppConfig.rejected, (state) => {
      state.loaded = true
    })
  },
})

export default appConfigSlice.reducer
