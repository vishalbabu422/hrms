import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import OrganizationSelect from '../components/organization-select'
import EmpanelmentSelect from '../components/empanelment-select'
import { validateVendor } from '../../validations/vendorValidation'
import StateSelect from '../components/state-dropdown'

const VendorFormComponent = ({ initialData, mode, onSubmit }) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const emptyAddress = {
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  }

  const emptyBankAccount = {
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch_name: '',
  }

  const [addresses, setAddresses] = useState([{ ...emptyAddress }])

  const [bankAccounts, setBankAccounts] = useState([{ ...emptyBankAccount }])
  useEffect(() => {
    if (!initialData) return

    setFormData(initialData)

    setAddresses(
      initialData.addresses?.length
        ? initialData.addresses
        : [
            {
              address_line1: initialData.address_line1 || '',
              address_line2: initialData.address_line2 || '',
              city: initialData.city || '',
              state: initialData.state || '',
              country: initialData.country || '',
              pincode: initialData.pincode || '',
            },
          ],
    )

    setBankAccounts(
      initialData.bank_accounts?.length
        ? initialData.bank_accounts
        : [
            {
              bank_name: initialData.bank_name || '',
              account_number: initialData.account_number || '',
              ifsc_code: initialData.ifsc_code || '',
              branch_name: initialData.branch_name || '',
            },
          ],
    )
  }, [initialData])
  if (!formData) return null

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? (value === 'true' ? true : false) : value,
    }))
  }

  const handleAddressChange = (index, field, value) => {
    setAddresses((prev) =>
      prev.map((address, i) =>
        i === index
          ? {
              ...address,
              [field]: value,
            }
          : address,
      ),
    )
  }

  const addAddress = () => {
    setAddresses((prev) => [...prev, { ...emptyAddress }])
  }

  const removeAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBankChange = (index, field, value) => {
    setBankAccounts((prev) =>
      prev.map((bank, i) =>
        i === index
          ? {
              ...bank,
              [field]: value,
            }
          : bank,
      ),
    )
  }

  const addBankAccount = () => {
    setBankAccounts((prev) => [...prev, { ...emptyBankAccount }])
  }

  const removeBankAccount = (index) => {
    setBankAccounts((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validateVendor(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) return

    onSubmit(formData)
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              {/* ================= Foreign Keys ================= */}

              <OrganizationSelect
                name="organization_id"
                value={formData.organization_id}
                onChange={handleChange}
                label="Organisation"
                placeholder="Select Organisation"
                colSize={6}
              />

              <CCol md={6}>
                <EmpanelmentSelect
                  name="empanelment_id_fk"
                  value={formData.empanelment_id_fk}
                  onChange={handleChange}
                  label="Empanelment"
                  placeholder="Select Empanelment"
                />
              </CCol>

              {/* ================= Vendor Info ================= */}
              <CCol md={6}>
                <CFormLabel>
                  Vendor Name <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  name="vendor_name"
                  value={formData.vendor_name || ''}
                  onChange={handleChange}
                  invalid={!!errors.vendor_name}
                  feedback={errors.vendor_name}
                  placeholder="Enter vendor name"
                  maxLength={255}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Vendor Code</CFormLabel>
                <CFormInput
                  name="vendor_code"
                  value={formData.vendor_code || ''}
                  onChange={handleChange}
                  placeholder="Enter vendor code"
                  maxLength={50}
                  minLength={2}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Vendor Type</CFormLabel>
                <CFormSelect
                  name="vendor_type"
                  value={formData.vendor_type || ''}
                  onChange={handleChange}
                  maxLength={50}
                >
                  <option value="">Select Type</option>
                  <option value="GOVERNMENT">Government</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="LLP">LLP</option>
                  <option value="NGO">NGO</option>
                  <option value="OTHER">Other</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="PRIVATE_LIMITED">Private Limited</option>
                  <option value="PROPRIETORSHIP">Proprietorship</option>
                  <option value="PUBLIC_LIMITED">Public Limited</option>
                </CFormSelect>
              </CCol>

              {/* ================= Contact ================= */}
              <CCol md={6}>
                <CFormLabel>Contact Person</CFormLabel>
                <CFormInput
                  name="contact_person"
                  placeholder="Contact Person"
                  value={formData.contact_person || ''}
                  onChange={handleChange}
                  maxLength={150}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Contact Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="contact_email"
                  value={formData.contact_email || ''}
                  onChange={handleChange}
                  placeholder="Enter email"
                  maxLength={150}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Contact Phone</CFormLabel>

                <CFormInput
                  name="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')

                    handleChange({
                      target: {
                        name: 'contact_phone',
                        value,
                      },
                    })
                  }}
                  onBlur={() => {
                    if (formData.contact_phone && formData.contact_phone.length !== 10) {
                      setErrors((prev) => ({
                        ...prev,
                        contact_phone: 'Phone number must be 10 digits',
                      }))
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        contact_phone: '',
                      }))
                    }
                  }}
                  placeholder="Enter phone number"
                  maxLength={10}
                  invalid={!!errors.contact_phone}
                />

                {errors.contact_phone && (
                  <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                    {errors.contact_phone}
                  </div>
                )}
              </CCol>

              <CCol md={6}>
                <CFormLabel>Website</CFormLabel>
                <CFormInput
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                  maxLength={150}
                />
              </CCol>

              {/* ================= Address ================= */}
              {/* ================= Address ================= */}

              <CCol xs={12}>
                <h6 className="fw-semibold mb-3">Address Details</h6>

                {addresses.map((address, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Address {index + 1}</h6>

                      {addresses.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeAddress(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <CFormLabel>Address Line 1</CFormLabel>

                        <CFormTextarea
                          rows={2}
                          placeholder="Enter Address"
                          value={address.address_line1 || ''}
                          onChange={(e) =>
                            handleAddressChange(index, 'address_line1', e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>Address Line 2</CFormLabel>

                        <CFormTextarea
                          rows={2}
                          value={address.address_line2 || ''}
                          onChange={(e) =>
                            handleAddressChange(index, 'address_line2', e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>City</CFormLabel>

                        <CFormInput
                          placeholder="Enter City"
                          value={address.city || ''}
                          onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                          maxLength={100}
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>State</CFormLabel>

                        <StateSelect
                          name={`state_${index}`}
                          value={address.state || ''}
                          onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                          colSize={12}
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>Country</CFormLabel>

                        <CFormInput
                          value={address.country || ''}
                          onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                          maxLength={100}
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>Pincode</CFormLabel>

                        <CFormInput
                          placeholder="Enter pincode"
                          value={address.pincode || ''}
                          onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)}
                          maxLength={15}
                          pattern="[0-9]{4,10}"
                          title="Enter valid pincode"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" className="btn btn-outline-primary" onClick={addAddress}>
                  + Add Address
                </button>
              </CCol>
              {/* ================= Bank Details ================= */}
              {/* ================= Bank Details ================= */}

              <CCol xs={12}>
                <h6 className="fw-semibold mb-3">Bank Details</h6>

                {bankAccounts.map((bank, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Bank Account {index + 1}</h6>

                      {bankAccounts.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeBankAccount(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <CFormLabel>Bank Name</CFormLabel>

                        <CFormInput
                          placeholder="Enter Bank Name"
                          value={bank.bank_name || ''}
                          onChange={(e) => handleBankChange(index, 'bank_name', e.target.value)}
                          maxLength={150}
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>Account Number</CFormLabel>

                        <CFormInput
                          placeholder="Enter Account Number"
                          value={bank.account_number || ''}
                          onChange={(e) =>
                            handleBankChange(
                              index,
                              'account_number',
                              e.target.value.replace(/\D/g, ''),
                            )
                          }
                          maxLength={50}
                          pattern="[0-9]{9,18}"
                          title="Enter valid account number"
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>IFSC Code</CFormLabel>

                        <CFormInput
                          placeholder="Enter IFSC Code"
                          value={bank.ifsc_code || ''}
                          onChange={(e) =>
                            handleBankChange(index, 'ifsc_code', e.target.value.toUpperCase())
                          }
                          maxLength={20}
                          pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                          title="Enter valid IFSC code"
                        />
                      </div>

                      <div className="col-md-6">
                        <CFormLabel>Branch Name</CFormLabel>

                        <CFormInput
                          placeholder="Enter Branch Name"
                          value={bank.branch_name || ''}
                          onChange={(e) => handleBankChange(index, 'branch_name', e.target.value)}
                          maxLength={150}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" className="btn btn-outline-primary" onClick={addBankAccount}>
                  + Add Bank Account
                </button>
              </CCol>
              {/* ================= Onboarding ================= */}
              <CCol md={6}>
                <CFormLabel>Onboarding Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="onboarding_date"
                  value={formData.onboarding_date || ''}
                  onChange={handleChange}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="is_active"
                  value={String(formData.is_active)}
                  onChange={handleChange}
                  required
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </CFormSelect>
              </CCol>

              <CCol xs={12}>
                <CButton type="submit" color="primary">
                  {mode === 'edit' ? 'Update' : 'Create'}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default VendorFormComponent
