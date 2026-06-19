// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import { Provider } from 'react-redux'
// import 'core-js'
// import './views/'
// import App from './App'

// import 'simplebar-react/dist/simplebar.min.css' 
// import store from './store'

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
// )

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'

// ✅ CoreUI (includes Bootstrap)
import '@coreui/coreui/dist/css/coreui.min.css'

// ✅ Your custom global CSS
import './index.css'

import 'simplebar-react/dist/simplebar.min.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
