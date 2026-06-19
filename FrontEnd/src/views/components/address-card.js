import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import Field from './field'

const AddressCard = ({ title, data = {} }) => {
  const fields = [
    { label: 'Address', key: 'address', col: 12 },
    { label: 'Landmark', key: 'landmark' },
    { label: 'City', key: 'city' },
    { label: 'District', key: 'district' },
    { label: 'State', key: 'state' },
    { label: 'Country', key: 'country' },
    { label: 'Pincode', key: 'pincode' },
  ]

  return (
    <div className="col-12">
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-light fw-semibold">
          {title}
        </CCardHeader>

        <CCardBody>
          <div className="row g-4">
            {fields.map((field, index) => (
              <Field
                key={index}
                label={field.label}
                value={data[field.key]}
                col={field.col || 3}
              />
            ))}
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddressCard