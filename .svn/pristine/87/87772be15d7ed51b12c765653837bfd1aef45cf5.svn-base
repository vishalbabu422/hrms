import EmployeeDesignationFormComponent from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpDesignationData = async () => {
      try {
        const res = await api.get(`/designation/${id}`)
        const mapped = mapApiToForm(res.data.data)
        setInitialData(mapped)
      } catch (err) {
        toast.error('Failed to load Employee Designation')
        navigate('/employeedesignation')
      } finally {
        setLoading(false)
      }
    }

    fetchEmpDesignationData()
  }, [id])

  const mapApiToForm = (data) => ({
    designation_name: data.designation_name ?? '',
    designation_code: data.designation_code ?? '',
    is_active: data?.is_active !== undefined ? Boolean(data.is_active) : true,
  })

  const handleUpdate = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
      }

      await api.patch(`/designation/${id}`, normalizedPayload)
      toast.success('Employee Designation updated successfully')
      navigate('/employeedesignation')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update Employee Designation')
    }
  }

  return <EmployeeDesignationFormComponent initialData={initialData} mode="edit" onSubmit={handleUpdate} />
}

export default edit
