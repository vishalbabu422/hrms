import SalaryStructureForm from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await api.get(`/salary-structure/${id}?models=structureComponents`)

        const mapped = mapApiToForm(res.data.data)
        setInitialData(mapped)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load Salary Structure')
        navigate('/salary-structure')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate])

  /* ================= MAP API → FORM ================= */

  const mapApiToForm = (data) => ({
    name: data?.name ?? '',
    description: data?.description ?? '',
    is_active: data?.is_active ?? true,

    // IMPORTANT: map structureComponents → components
    components:
      data?.structureComponents?.map((item) => ({
        component_id: item.salary_component_id,
        value_type: item.value_type,
        value: item.value_type === 'PERCENTAGE' ? item.percentage : item.amount,
      })) || [],
  })

  /* ================= UPDATE ================= */

  const handleUpdate = async (payload) => {
    try {
      await api.patch(`/salary-structure/${id}`, payload)
      toast.success('Updated successfully')
      navigate('/salary-structure')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update')
    }
  }

  /* ================= RENDER ================= */

  if (loading) return <div>Loading...</div>
  if (!initialData) return <div>No data found</div>

  return <SalaryStructureForm initialData={initialData} mode="edit" onSubmit={handleUpdate} />
}

export default Edit
