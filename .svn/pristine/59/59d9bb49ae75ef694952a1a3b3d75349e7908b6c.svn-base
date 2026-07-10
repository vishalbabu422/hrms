import SalaryComponentForm from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const res = await api.get(`/salary-component/${id}`)
        setInitialData(mapApiToForm(res.data.data))
      } catch (err) {
        toast.error('Failed to load')
        navigate('/salary-component')
      }
    }

    fetchData()
  }, [id])

  const mapApiToForm = (data) => ({
    name: data.name ?? '',
    code: data.code ?? '',
    type: data.type ?? '',
    value_type: data.value_type ?? '',
    percentage: data.percentage ?? '',
    amount: data.amount ?? '',
    base_type: data.base_type ?? '',
    base_component_id: data.base_component_id ?? '',
    calculation_priority: data.calculation_priority ?? 1,
    is_prorated: data.is_prorated ?? true,
    is_mandatory: data.is_mandatory ?? false,
    is_active: data.is_active ?? true,
  })

  const handleUpdate = async (payload) => {
    try {
      await api.patch(`/salary-component/${id}`, payload)
      toast.success('Updated successfully')
      navigate('/salary-component')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update')
    }
  }

  return (
    <SalaryComponentForm
      initialData={initialData}
      mode="edit"
      onSubmit={handleUpdate}
    />
  )
}

export default Edit