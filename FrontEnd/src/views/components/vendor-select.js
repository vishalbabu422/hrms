import { CFormLabel, CFormSelect } from '@coreui/react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const VendorSelect = ({
  name = 'vendor_id',
  value = '',
  onChange,
  label = 'Vendor',
  placeholder = 'Select Vendor',
  disabled = false,
}) => {
  const [vendorList, setVendorList] = useState([])

  useEffect(() => {
    const fetchVendor = async () => {
      const params = {
        fields: 'id,vendor_name',
      }

      try {
        const response = await api.get('/admin/vendor/index?is_active=true&sort=vendor_name', { params })
        setVendorList(response.data.data.vendorList)
      } catch (error) {
        console.error('Failed to fetch Vendor:', error)
      }
    }

    fetchVendor()
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
        {vendorList.map((item) => (
          <option key={item.id} value={item.id}>
            {item.vendor_name}
          </option>
        ))}
      </CFormSelect>
    </>
  )
}

export default VendorSelect
