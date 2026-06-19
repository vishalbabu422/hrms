// components/state-select.jsx

import { CCol, CFormLabel, CFormSelect } from '@coreui/react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const StateSelect = ({
  name = 'state',
  value,
  onChange,
  label = 'State',
  placeholder = 'Select State',
  colSize = 6,
  invalid = false,
  feedback = '',
}) => {
  const [states, setStates] = useState([])

  useEffect(() => {
    fetchStates()
  }, [])

  const fetchStates = async () => {
    try {
      const response = await api.get('state/index?is_active=true&sort=state_name')

      setStates(response.data?.data.stateList || [])
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }


  

  // const handleSelectChange = (e) => {
  //   if (onChange) {
  //     onChange(name, e.target.value)
  //   }
  // }

//   Change done

const handleSelectChange = (e) => {
  if (onChange) {
    onChange(e)
  }
}

  return (
    <CCol md={colSize}>
      <CFormLabel>
        {label} <span className="text-danger">*</span>
      </CFormLabel>

      <CFormSelect name={name} value={value || ''} onChange={handleSelectChange} invalid={invalid}>
        <option value="">{placeholder}</option>

        {states.map((state) => (
          <option key={state.id} value={state.id}>
            {state.state_name}
          </option>
        ))}
      </CFormSelect>

      {feedback && <div className="invalid-feedback d-block">{feedback}</div>}
    </CCol>
  )
}

export default StateSelect
