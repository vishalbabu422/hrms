import EmpSalaryStructureForm from './form-component'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const Add = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      if (!payload.length) {
        toast.error('Please select at least one employee')
        return
      }

      await api.post('employee-salary-structure', payload)

      toast.success('Saved successfully')
      navigate('/salary-structure')
    } catch (error) {
      console.error(error)

      const message = error?.response?.data?.message || 'Error saving data'

      toast.error(message)
    }
  }

  return <EmpSalaryStructureForm mode="create" onSubmit={handleSubmit} />
}

export default Add
