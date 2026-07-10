import { CCol, CFormLabel } from '@coreui/react'
// import { useEffect, useState } from 'react'
import Select from 'react-select'
// import api from '../../api/axios'
import './select.css'

const DesignationSelect = ({
  options = [],
  name = 'designation',
  value = '',
  onChange,
  label = 'Designation',
  placeholder = 'Select Designation',
  disabled = false,
  colSize = 6,
  invalid = false,
  feedback = '',
}) => {
  const selectOptions = options.map((item) => ({
    value: item.id,
    label: item.designation_name, // or item.designation if that's your API field
  }))

  return (
    <CCol md={colSize}>
      <CFormLabel>
        {label} <span className="text-danger">*</span>
      </CFormLabel>

      <Select
        name={name}
        options={selectOptions}
        placeholder={placeholder}
        isSearchable
        isClearable
        isDisabled={disabled}
        classNamePrefix="react-select"
        value={selectOptions.find((option) => String(option.value) === String(value)) || null}
        onChange={(selected) =>
          onChange({
            target: {
              name,
              value: selected ? selected.value : '',
            },
          })
        }
      />

      {feedback && <div className="text-danger mt-1">{feedback}</div>}
    </CCol>
  )
}

export default DesignationSelect
