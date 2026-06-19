import VendorFormComponent from './form-component.js'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
      }

      await api.post('/admin/vendor/create', normalizedPayload)
      toast.success('Vendor created successfully')
      navigate('/vendor')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to create Vendor')
    }
  }

  const initialData = {
    organization_id: '',
    empanelment_id_fk: '',

    vendor_name: '',
    vendor_code: '',
    vendor_type: '',

    contact_person: '',
    contact_email: '',
    contact_phone: '',

    website: '',

    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',

    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch_name: '',

    onboarding_date: null,

    is_active: true,
  }

  return <VendorFormComponent initialData={initialData} mode="create" onSubmit={handleSubmit} />
}

export default Add
