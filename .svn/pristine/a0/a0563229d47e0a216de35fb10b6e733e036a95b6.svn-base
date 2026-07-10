import GstFormComponent from './form-component'
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
        const res = await api.get(`/admin/gst-code/${id}`)
        setInitialData(mapApiToForm(res.data.data))
      } catch (err) {
        toast.error('Failed to load GST Code')
        navigate('/gst-code')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const mapApiToForm = (data) => ({
    code_type: data.code_type ?? '',
    code: data.code ?? '',
    description: data.description ?? '',
    gst_rate: data.gst_rate ?? '',
    cgst_rate: data.cgst_rate ?? '',
    sgst_rate: data.sgst_rate ?? '',
    igst_rate: data.igst_rate ?? '',
    cess_rate: data.cess_rate ?? '',
    other_rate: data.other_rate ?? '',
    effective_from: data.effective_from ?? '',
    effective_to: data.effective_to ?? null,
    transaction_type: data.transaction_type ?? 'INTRA',
    is_active: Boolean(data.is_active),
  })

  const handleUpdate = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
        gst_rate: Number(payload.gst_rate) || 0,
        cgst_rate: Number(payload.cgst_rate) || 0,
        sgst_rate: Number(payload.sgst_rate) || 0,
        igst_rate: Number(payload.igst_rate) || 0,
        cess_rate: Number(payload.cess_rate) || 0,
        other_rate: Number(payload.other_rate) || 0,
      }

      await api.patch(`/admin/gst-code/edit/${id}`, normalizedPayload)
      toast.success('GST Code updated successfully')
      navigate('/gst-code')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update GST Code')
    }
  }

  return <GstFormComponent initialData={initialData} mode="edit" onSubmit={handleUpdate} />
}

export default edit
