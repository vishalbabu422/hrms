import PBGFormComponent from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()

  const initialData = {
    pbg_no: '',
    work_order_ids: [],
    start_date: '',
    end_date: '',
    amount: '',
    nicsi_reg_no: '',
    nicsi_reg_date: '',
    bank_charges: '',
    pbg_upload_path: '',
    is_active: true,
  }

  const handleSubmit = async (payload) => {
    try {
      console.log('PBG PAYLOAD:', payload)

      await api.post('/pbg-master/', payload)

      toast.success('PBG created successfully')

      navigate('/pbg')
    } catch (error) {
      console.error('PBG CREATE ERROR:', error)
      console.error('SERVER RESPONSE:', error.response?.data)

      toast.error(
        error.response?.data?.message || 'Failed to create PBG',
      )
    }
  }

  return (
    <PBGFormComponent
      initialData={initialData}
      mode="create"
      onSubmit={handleSubmit}
    />
  )
}

export default Add