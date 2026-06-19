import DesignationFormComponent from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const add = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
      }

      await api.post('/admin/designation/create', normalizedPayload)
      toast.success('Designation created successfully')
      navigate('/designation')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to create Designation')
    }
  }

  const initialData = {
    empanelment_id_fk: '',
    type: '',
    designation: '',
    qualification: '',
    exp_in_years: '',
    is_active: true,
  }

  return (
    <DesignationFormComponent initialData={initialData} mode="create" onSubmit={handleSubmit} />
  )
}

export default add
