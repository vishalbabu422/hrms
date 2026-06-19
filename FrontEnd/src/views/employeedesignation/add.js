import EmployeeDesignationFormComponent from './form-component'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const Add = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
      }

      await api.post('/designation', normalizedPayload)
      toast.success('Designation created successfully')
      navigate('/employeedesignation')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to create Designation')
    }
  }

  const initialData = {
    designation_name: '',
    designation_code: '',
    is_active: true,
  }

  return (
    <EmployeeDesignationFormComponent
      initialData={initialData}
      mode="create"
      onSubmit={handleSubmit}
    />
  )
}

export default Add
