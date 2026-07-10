import SalaryComponentForm from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Add = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      await api.post('/salary-component', payload)
      toast.success('Salary Component created successfully')
      navigate('/salary-component')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create')
    }
  }

  const initialData = {
    name: '',
    code: '',
    type: '',
    value_type: '',
    percentage: null,
    amount: null,
    base_type: '',
    base_component_id: null,
    calculation_priority: 1,
    is_prorated: true,
    is_mandatory: false,
    is_active: true,
  }

  return <SalaryComponentForm initialData={initialData} mode="create" onSubmit={handleSubmit} />
}

export default Add
