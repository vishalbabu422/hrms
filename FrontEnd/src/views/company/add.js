import CompanyFormComponent from './form-component'
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

      await api.post('/admin/company/create', normalizedPayload)
      toast.success('Company created successfully')
      navigate('/company')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to create Company')
    }
  }

  const initialData = {
    organization_id: '',

    company_name: '',
    company_code: '',

    company_type: '',

    incorporation_date: null,

    official_email: '',
    official_phone: '',
    website: '',

    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',

    is_active: true,
  }

  return <CompanyFormComponent initialData={initialData} mode="create" onSubmit={handleSubmit} />
}

export default Add
