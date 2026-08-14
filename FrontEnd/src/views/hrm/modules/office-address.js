import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import api from '../../../api/axios'
import { toast } from 'react-toastify'
import { validateOfficeAddress } from '../../../validations/officeAddressValidation'

const OfficeAddress = forwardRef(({ employeeId, isEdit }, ref) => {
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({
    office: {},
    client_office: {},
  })
  const createAddress = (type) => ({
    address_type: type,
    address_line1: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pin_code: '',
    hard_location: false,
  })

  const initialAddressDetails = {
    office: createAddress('OFFICE'),
    client_office: createAddress('CLIENT_OFFICE'),
  }

  const [employeeAddress, setEmployeeAddress] = useState(initialAddressDetails)

  // ================= FETCH =================
  useEffect(() => {
    if (!employeeId) return

    const fetchAddress = async () => {
      try {
        const response = await api.get(`/employee/${employeeId}/address`)
        const data = response.data?.data || response.data

        const office = data.find((a) => a.address_type === 'OFFICE')
        const clientOffice = data.find((a) => a.address_type === 'CLIENT_OFFICE')

        setEmployeeAddress({
          office: office || initialAddressDetails.office,
          client_office: clientOffice || initialAddressDetails.client_office,
        })
      } catch (error) {
        console.error(error)
      }
    }

    fetchAddress()
  }, [employeeId])

  // ================= HANDLE CHANGE =================

  const handleOfficeChange = (e) => {
    const { name, value, type, checked } = e.target

    setEmployeeAddress((prev) => ({
      ...prev,
      office: {
        ...prev.office,
        [name]: type === 'checkbox' ? checked : value,
      },
    }))
  }

  const handleClientChange = (e) => {
    const { name, value, type, checked } = e.target

    setEmployeeAddress((prev) => ({
      ...prev,
      client_office: {
        ...prev.client_office,
        [name]: type === 'checkbox' ? checked : value,
      },
    }))
  }
  // ================= SUBMIT =================

  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        setLoading(true)

        const url = `/employee/${employeeId}/address`
        const addresses = [employeeAddress.office, employeeAddress.client_office]

        setErrors({
          office: {},
          client_office: {},
        })

        for (const addr of addresses) {
          const validationErrors = validateOfficeAddress(
            addr,
            addr.address_type === 'OFFICE' ? 'Office Address' : 'Client Address',
          )

          if (Object.keys(validationErrors).length > 0) {
            setErrors((prev) => ({
              ...prev,
              [addr.address_type === 'OFFICE' ? 'office' : 'client_office']: validationErrors,
            }))

            return false // stop API
          }

          if (addr.id) {
            await api.patch(url + '/' + addr.id, addr)
          } else {
            await api.post(url, addr)
          }
        }

        toast.success('Office Address saved successfully')
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Failed')
        return false
      } finally {
        setLoading(false)
      }
    },
  }))

  const addressFields = ['landmark', 'city', 'district', 'state', 'country', 'pin_code']

  return (
    <>
      {/* ================= OFFICE ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">Office Address</div>

        <div className="card-body">
          <textarea
            className={`form-control ${errors.office.address_line1 ? 'is-invalid' : ''}`}
            name="address_line1"
            value={employeeAddress.office.address_line1 || ''}
            onChange={handleOfficeChange}
            placeholder="Enter address"
          />
          <div className="invalid-feedback">{errors.office.address_line1}</div>

          <div className="row g-3 mt-2">
            {addressFields.map((field) => (
              <div className="col-md-3" key={field}>
                <input
                  className={`form-control ${errors.office[field] ? 'is-invalid' : ''}`}
                  name={field}
                  value={employeeAddress.office[field] || ''}
                  onChange={handleOfficeChange}
                  placeholder={`Enter ${field}`}
                />
                <div className="invalid-feedback">{errors.office[field]}</div>
              </div>
            ))}

            {/* Location Checkbox */}
            <div className="col-md-3 d-flex align-items-center">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="officeHardLocation"
                  name="hard_location"
                  checked={employeeAddress.office.hard_location || false}
                  onChange={handleOfficeChange}
                />

                <label className="form-check-label" htmlFor="officeHardLocation">
                  Hard Location
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CLIENT ================= */}
      <div className="card shadow-sm">
        <div className="card-header">Client Address</div>

        <div className="card-body">
          <textarea
            className={`form-control ${errors.client_office.address_line1 ? 'is-invalid' : ''}`}
            name="address_line1"
            value={employeeAddress.client_office.address_line1 || ''}
            onChange={handleClientChange}
            placeholder="Enter address"
          />
          <div className="invalid-feedback">{errors.client_office.address_line1}</div>

          <div className="row g-3 mt-2">
            {addressFields.map((field) => (
              <div className="col-md-3" key={field}>
                <input
                  className={`form-control ${errors.client_office[field] ? 'is-invalid' : ''}`}
                  name={field}
                  value={employeeAddress.client_office[field] || ''}
                  onChange={handleClientChange}
                  placeholder={`Enter ${field}`}
                />
                <div className="invalid-feedback">{errors.client_office[field]}</div>
              </div>
            ))}
            {/* Location Checkbox */}
           <div className="col-md-3 d-flex align-items-center">
  <div className="form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="clientHardLocation"
      name="hard_location"
      checked={employeeAddress.client_office.hard_location || false}
      onChange={handleClientChange}
    />

    <label className="form-check-label" htmlFor="clientHardLocation">
      Hard Location
    </label>
  </div>
</div>
          </div>
        </div>
      </div>
    </>
  )
})

export default OfficeAddress
