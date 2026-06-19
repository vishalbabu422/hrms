import { CCol, CFormLabel, CFormSelect, CFormInput } from '@coreui/react'

const ValueTypeInput = ({
  typeName = 'value_type',
  valueName = 'value',
  typeValue = '',
  inputValue = '',
  onTypeChange,
  onValueChange,
  label = 'Value Type',
  required = false,
  showLabel = true,
  disabled = false,
  colSize = 12,
  errors = {},
}) => {
  return (
    <>
      {/* Dropdown */}
      <CCol md={colSize}>
        {showLabel && (
          <CFormLabel>
            {label} {required && <span className="text-danger">*</span>}
          </CFormLabel>
        )}

        <CFormSelect
          name={typeName}
          value={typeValue || ''}
          onChange={onTypeChange}
          disabled={disabled}
          invalid={!!errors[typeName]}
          feedback={errors[typeName]}
        >
          <option value="">Select Type</option>
          <option value="FIXED">Fixed</option>
          <option value="PERCENTAGE">Percentage</option>
        </CFormSelect>
      </CCol>

      {/* Input */}
      {typeValue && (
        <CCol md={colSize}>
          {showLabel && (
            <CFormLabel>
              {typeValue === 'PERCENTAGE' ? 'Percentage (%)' : 'Amount'}{' '}
              {required && <span className="text-danger">*</span>}
            </CFormLabel>
          )}

          <CFormInput
            type="number"
            name={typeValue === 'PERCENTAGE' ? 'percentage' : 'amount'}
            value={inputValue || ''}
            onChange={onValueChange}
            placeholder={typeValue === 'PERCENTAGE' ? 'Enter percentage' : 'Enter amount'}
            disabled={disabled}
            invalid={!!errors[valueName]}
            feedback={errors[valueName]}
          />
        </CCol>
      )}
    </>
  )
}

export default ValueTypeInput
