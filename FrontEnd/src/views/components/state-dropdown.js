// components/state-select.jsx

// import { CCol, CFormLabel, CFormSelect } from '@coreui/react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

import { CCol, CFormLabel } from '@coreui/react'
import Select from 'react-select'
import './select.css'

const StateSelect = ({
  name = 'state',
  value,
  onChange,
  label = 'State',
  placeholder = 'Select State',
  colSize = 6,
  invalid = false,
  feedback = '',
   disabled = false,
}) => {
  const [states, setStates] = useState([])

  useEffect(() => {
    fetchStates()
    // const options = states.map((state) => ({
    //   value: state.id,
    //   label: state.state_name,
    // }))
  }, [])

  const fetchStates = async () => {
    try {
      const response = await api.get('state/index?is_active=true&sort=state_name')

      setStates(response.data?.data.stateList || [])
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const handleSelectChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  const options = states.map((state) => ({
    value: state.id,
    label: state.state_name,
  }))

  return (
    <CCol md={colSize}>
      <CFormLabel>
        {label} <span className="text-danger">*</span>
      </CFormLabel>

      <Select
        name={name}
        options={options}
        placeholder={placeholder}
        isSearchable
        isClearable
        isDisabled={disabled}
        classNamePrefix="react-select"
        value={options.find((option) => String(option.value) === String(value)) || null}
        onChange={(selected) =>
          onChange({
            target: {
              name,
              value: selected ? selected.value : '',
            },
          })
        }
      />

      {feedback && <div className="invalid-feedback d-block">{feedback}</div>}
    </CCol>
  )
}

export default StateSelect
