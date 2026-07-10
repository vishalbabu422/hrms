import { toast } from 'react-toastify'
import api from '../../api/axios'
import WorkOrderDesgnFormComponent from './form-component'

const Add = () => {
  const initialData = {
    workOrderId: '',
    deployments: [],
  }

  const handleSubmit = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
      }

      const response = await api.post('/admin/workorder-desgn/create', normalizedPayload)

      toast.success('Work Order Designation created successfully')
      navigate('/work-order-desgn')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to create Work Order Designation')
    }
  }

  return (
    <WorkOrderDesgnFormComponent initialData={initialData} mode="create" onSubmit={handleSubmit} />
  )
}

export default Add
