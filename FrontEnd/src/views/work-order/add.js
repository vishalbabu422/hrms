import WorkOrderFormComponent from './form-component'
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

      const formData = new FormData()
      Object.entries(normalizedPayload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })

      await api.post('/admin/workorder/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Work Order created successfully')
      navigate('/work-order')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to create Work Order')
    }
  }

  const initialData = {
    empanelment_id_fk: '',
    work_order_no: '',
    work_order_date: null,
    project_no: '',
    pi_number: '',
    project_name: '',
    vendor_id_fk: null,
    issued_to_name: '',
    issued_to_address: '',
    issued_to_contact: '',
    issued_to_phone: '',
    issued_to_email: '',
    type: 'MANPOWER',
    contact_name: '',
    contact_number: '',
    contact_email: '',

    total_amt: 0,
    total_cgst_amt: 0,
    total_sgst_amt: 0,
    total_igst_amt: 0,
    grand_total: 0,
    created_by: 1,
    doc_path: '',
    remarks: '',
    is_active: true,
    doc_path: '',
  }

  return <WorkOrderFormComponent initialData={initialData} mode="create" onSubmit={handleSubmit} />
}

export default Add
