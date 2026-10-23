import PBGFormComponent from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  // ================= FETCH PBG =================

  useEffect(() => {
    const fetchPBG = async () => {
      try {
        setLoading(true)

        const response = await api.get(`/pbg-master/${id}`)
        const data = response.data?.data

        console.log('PBG API RESPONSE:', response.data)

        if (!data) {
          toast.error('PBG not found')
          navigate('/pbg')
          return
        }

        // Work Order mapping list
        const workOrderList = Array.isArray(data.workorderPbgList)
          ? data.workorderPbgList
          : []

        // Support both API response structures.
        const pbg = data.pbg || workOrderList[0]?.pbg || {}

        console.log('PBG OBJECT:', pbg)
        console.log('WORK ORDER MAPPING:', workOrderList)

        // Get all associated Work Order IDs.
        const workOrderIds = [
          ...new Set(
            workOrderList
              .map(
                (item) =>
                  item.wo_id ??
                  item.work_order?.id ??
                  item.workOrder?.id,
              )
              .filter(
                (woId) => woId !== null && woId !== undefined,
              )
              .map(String),
          ),
        ]

        // Fallback for APIs returning wo_id directly in PBG.
        if (workOrderIds.length === 0 && pbg.wo_id != null) {
          workOrderIds.push(String(pbg.wo_id))
        }

        const mappedData = {
          pbg_no: pbg.pbg_no ?? '',

          work_order_ids: workOrderIds,

          start_date: pbg.start_date
            ? String(pbg.start_date).substring(0, 10)
            : '',

          end_date: pbg.end_date
            ? String(pbg.end_date).substring(0, 10)
            : '',

          amount: pbg.amount ?? '',

          nicsi_reg_no: pbg.nicsi_reg_no ?? '',

          nicsi_reg_date: pbg.nicsi_reg_date
            ? String(pbg.nicsi_reg_date).substring(0, 10)
            : '',

          bank_charges: pbg.bank_charges ?? '',

          pbg_upload_path: pbg.pbg_upload_path ?? '',

          is_active:
            pbg.is_active !== undefined
              ? Boolean(pbg.is_active)
              : true,
        }

        console.log('FINAL EDIT DATA:', mappedData)

        setInitialData(mappedData)
      } catch (error) {
        console.error('FETCH PBG ERROR:', error)
        console.error('SERVER RESPONSE:', error.response?.data)

        toast.error(
          error.response?.data?.message || 'Failed to load PBG',
        )

        navigate('/pbg')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPBG()
    } else {
      setLoading(false)
      toast.error('PBG ID is missing')
    }
  }, [id, navigate])

  // ================= UPDATE PBG =================

  const handleUpdate = async (payload) => {
    try {
      console.log('UPDATE PBG PAYLOAD:', payload)

      const response = await api.patch(`/pbg-master/${id}`, payload)

      console.log('PBG UPDATE RESPONSE:', response.data)

      toast.success('PBG updated successfully')
      navigate('/pbg')
    } catch (error) {
      console.error('PBG UPDATE ERROR:', error)
      console.error('SERVER RESPONSE:', error.response?.data)

      toast.error(
        error.response?.data?.message || 'Failed to update PBG',
      )
    }
  }

  // ================= LOADING =================

  if (loading) {
    return <div className="p-4">Loading PBG...</div>
  }

  if (!initialData) {
    return null
  }

  return (
    <PBGFormComponent
      key={id}
      initialData={initialData}
      mode="edit"
      onSubmit={handleUpdate}
    />
  )
}

export default Edit
