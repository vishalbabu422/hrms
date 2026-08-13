import { configureStore, createSlice } from '@reduxjs/toolkit'
import authReducer from './store/slices/authSlice'
import appConfigReducer from './store/slices/appConfigSlice'

// 🟢 CoreUI UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarShow: true,
    sidebarUnfoldable: false,
    theme: 'light',
  },
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { set } = uiSlice.actions

// 🟢 Configure Store (Thunk included automatically)
const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    auth: authReducer,
    appConfig: appConfigReducer,
  },
})

export default store
