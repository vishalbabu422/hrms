import EmpanelmentFormComponent from './form-component'
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
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/empanelment/${id}`)
        setInitialData(mapApiToForm(res.data.data))
      } catch (err) {
        toast.error('Failed to load Empanelment')
        navigate('/gst-code')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const mapApiToForm = (data) => ({
    id,
    organization_id: data.organization_id ?? '',
    company_id: data.company_id ?? '',

    category: data.category ?? '',
    empanelment_no: data.empanelment_no ?? '',
    amc: data.amc ?? 0.0,
    agm: data.agm ?? 0.0,
    date: data.date ?? '',
    shortcode: data.shortcode ?? '',
    rfe: data.rfe ?? '',

    effective_from: data.effective_from ?? '',
    effective_to: data.effective_to ?? null,

    leaves_per_month:
      data.leaves_per_month !== null && data.leaves_per_month !== undefined
        ? String(data.leaves_per_month)
        : '',

    carry_forward: Boolean(data.carry_forward),
    leave_category: data.leave_category ?? '',
    maternity_leaves: Boolean(data.maternity_leaves),

    remarks: data.remarks ?? '',
    doc_path: data.doc_path ?? '',

    is_active: Boolean(data.is_active),
  })

  const handleUpdate = async (payload) => {
    try {
      const formData = new FormData()

      Object.entries(payload).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          !(key === 'doc_path' && value instanceof File)
        ) {
          formData.append(key, value)
        }
      })

      if (payload.doc_path instanceof File) {
        formData.set('doc_path', payload.doc_path)
      }

      await api.patch(`/admin/empanelment/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Empanelment updated successfully')
      navigate('/empanelment')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update Empanelment')
    }
  }

  return <EmpanelmentFormComponent initialData={initialData} mode="edit" onSubmit={handleUpdate} />
}

export default edit
