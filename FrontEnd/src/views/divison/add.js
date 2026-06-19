import DivisionFormComponent from './form-component'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const Add = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
        parent_division_id: payload.parent_division || null,
      }
      delete normalizedPayload.parent_division
      await api.post('/division', normalizedPayload)
      toast.success('Division created successfully')
      navigate('/division')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to create Division')
    }
  }

  const initialData = {
    division_name: '',
    division_code: '',
    is_active: true,
  }
  return <DivisionFormComponent initialData={initialData} mode="create" onSubmit={handleSubmit} />
}

export default Add
