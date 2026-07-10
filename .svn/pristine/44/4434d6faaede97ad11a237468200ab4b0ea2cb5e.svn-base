import { CFormLabel, CFormSelect } from '@coreui/react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const EmpanelmentSelect = ({
  name = 'empanelment_id_fk',
  value = '',
  onChange,
  label = 'Empanelment',
  placeholder = 'Select Empanelment',
  disabled = false,
}) => {
  const [empanelmentList, setEmpanelmentList] = useState([])

  useEffect(() => {
    const fetchEmpanelments = async () => {
      const params = {
        fields: 'id,empanelment_no',
      }

      try {
        const response = await api.get('/admin/empanelment/index?is_active=true&sort=empanelment_no', { params })
        setEmpanelmentList(response.data.data.EmpanelmentList)
      } catch (error) {
        console.error('Failed to fetch empanelments:', error)
      }
    }

    fetchEmpanelments()
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
        {empanelmentList.map((item) => (
          <option key={item.id} value={item.id}>
            {item.empanelment_no}
          </option>
        ))}
      </CFormSelect>
    </>
  )
}

export default EmpanelmentSelect
