import { CFormLabel, CFormSelect } from '@coreui/react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const CompanySelect = ({
  name = 'company_id',
  value = '',
  onChange,
  label = 'Company',
  placeholder = 'Select Company',
  disabled = false,
}) => {
  const [companyList, setCompanyList] = useState([])

  useEffect(() => {
    const fetchCompany = async () => {
      const params = {
        fields: 'id,company_name',
      }

      try {
        const response = await api.get('/admin/company/index', { params })
        setCompanyList(response.data.data.companyList)
      } catch (error) {
        console.error('Failed to fetch Company:', error)
      }
    }

    fetchCompany()
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
        {companyList.map((item) => (
          <option key={item.id} value={item.id}>
            {item.company_name}
          </option>
        ))}
      </CFormSelect>
    </>
  )
}

export default CompanySelect
