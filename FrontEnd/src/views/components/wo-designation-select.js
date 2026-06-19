import { CFormLabel, CFormSelect } from '@coreui/react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const WoDesignationSelect = ({
  name = 'designation_id',
  value = '',
  onChange,
  label = 'Designation',
  placeholder = 'Select Designation',
  disabled = false,
}) => {
  const [desgnList, setDesgnList] = useState([])

  useEffect(() => {
    const fetchDesignation = async () => {
      const params = {
        fields: 'id,designation,qualification,exp_in_years',
      }

      try {
        const response = await api.get('/admin/designation/index', { params })
        setDesgnList(response.data.data.DesignationList)
      } catch (error) {
        console.error('Failed to fetch Designation:', error)
      }
    }

    fetchDesignation()
  }, [])

  return (
    <>
      <CFormLabel>{label}</CFormLabel>
      <CFormSelect
        name={name}
        value={value === null || value === undefined ? '' : String(value)}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {desgnList.map((item) => (
          <option key={item.id} value={item.id}>
            {item.designation}
          </option>
        ))}
        <option value="0">Others</option>
  
      </CFormSelect>
    </>
  )
}

export default WoDesignationSelect
