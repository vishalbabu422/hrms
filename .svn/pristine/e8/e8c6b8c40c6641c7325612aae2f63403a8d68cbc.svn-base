import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AddressCard from '../../components/address-card'
import { getEmployeeAddresses } from '../../../services/employeeAddress'

const AddressView = () => {
  const { employeeId } = useParams()

  const [address, setAddress] = useState({
    correspondence: {},
    permanent: {},
  })

  useEffect(() => {
    if (!employeeId) return

    getEmployeeAddresses(employeeId)
      .then((res) => {

        const data = res.data?.data || res.data || {}
        const addresses = data.EmployeeAddresses || []

        const getAddress = (type) => {
          const a = addresses.find((x) => x.address_type === type)

          return {
            address: [a?.address_line1, a?.address_line2]
              .filter(Boolean)
              .join(', '),
            landmark: a?.landmark || '',
            city: a?.city || '',
            district: a?.district || '',
            state: a?.state || '',
            country: a?.country || '',
            pincode: a?.pin_code || '',
          }
        }

        setAddress({
          correspondence: getAddress('CORRESPONDENCE'),
          permanent: getAddress('PERMANENT'),
        })
      })
      .catch((err) => {
        console.error('ADDRESS ERROR:', err)
      })
  }, [employeeId])

  return (
    <div className="row g-4">
      <AddressCard
        title="Correspondence Address"
        data={address.correspondence}
      />
      <AddressCard
        title="Permanent Address"
        data={address.permanent}
      />
    </div>
  )
}

export default AddressView