import { CCol, CFormLabel, CFormSelect } from '@coreui/react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const DistrictSelect = ({
  stateId,
  name = 'district',
  value,
  onChange,
  label = 'District',
  placeholder = 'Select District',
  colSize = 6,
  invalid = false,
  feedback = '',
  disabled = false,
}) => {
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    if (stateId) {
      fetchDistricts()
    } else {
      setDistricts([])
    }
  }, [stateId])

  const fetchDistricts = async () => {
    try {
      const response = await api.get(
        `district/index?state_id=${stateId}&is_active=true&sort=district_name`,
      )

      setDistricts(response.data?.data?.districtList || [])
    } catch (error) {
      console.error('Error fetching districts:', error)
      setDistricts([])
    }
  }

  const handleSelectChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value)
    }
  }

  return (
    <CCol md={colSize}>
      <CFormLabel>
        {label} <span className="text-danger">*</span>
      </CFormLabel>

      <CFormSelect
        name={name}
        value={value || ''}
        onChange={handleSelectChange}
        invalid={invalid}
        disabled={disabled || !stateId}
      >
        <option value="">{stateId ? placeholder : 'Select State First'}</option>

        {districts.map((district) => (
          <option key={district.id} value={district.district_name}>
            {district.district_name}
          </option>
        ))}
      </CFormSelect>

      {feedback && <div className="invalid-feedback d-block">{feedback}</div>}
    </CCol>
  )
}

export default DistrictSelect
