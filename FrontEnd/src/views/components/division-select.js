import { CCol, CFormLabel } from '@coreui/react'
import Select from 'react-select'
import './select.css'

const DivisionSelect = ({
  options = [],
  name = 'division',
  value = '',
  onChange,
  label = 'Division',
  placeholder = 'Select Division',
  disabled = false,
  colSize = 6,
  invalid = false,
  feedback = '',
  required = false, // <-- add this
}) => {
  const selectOptions = Array.isArray(options)
    ? options.map((item) => ({
        value: item.id,
        label: item.division_name,
      }))
    : []

  return (
    <CCol md={colSize}>
      <CFormLabel>
        {label} {required ? <span className="text-danger">*</span> : null}
      </CFormLabel>

      <Select
        name={name}
        options={selectOptions}
        placeholder={placeholder}
        isSearchable
        isClearable
        isDisabled={disabled}
        classNamePrefix="react-select"
        value={
          selectOptions.find(
            (option) => String(option.value) === String(value)
          ) || null
        }
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

export default DivisionSelect