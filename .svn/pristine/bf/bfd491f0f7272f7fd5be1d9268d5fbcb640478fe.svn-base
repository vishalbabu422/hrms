import SalaryAddonFormComponent from './form-component'

import api from '../../api/axios'

import { toast } from 'react-toastify'

import { useNavigate, useParams } from 'react-router-dom'

import { useEffect, useState } from 'react'

const Edit = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const [initialData, setInitialData] = useState(null)

  const [loading, setLoading] = useState(true)

  /* ================= FETCH SINGLE ================= */

  useEffect(() => {
    fetchSalaryAddon()
  }, [id])

  const fetchSalaryAddon = async () => {
    try {
      const response = await api.get(
        `/salary-addon-master/${id}`,
      )

      const data = response?.data?.data

      const mappedData = {
        name: data?.name ?? '',
        code: data?.code ?? '',
        description: data?.description ?? '',
        addon_type: data?.addon_type ?? '',
        taxable: data?.taxable ?? true,
        affects_pf: data?.affects_pf ?? false,
        affects_esi: data?.affects_esi ?? false,
        recurring_allowed:
          data?.recurring_allowed ?? true,
        is_active: data?.is_active ?? true,
      }

      setInitialData(mappedData)
    } catch (error) {
      console.error(error)

      toast.error('Failed to load Salary Addon')

      navigate('/salary-addon')
    } finally {
      setLoading(false)
    }
  }

  /* ================= UPDATE ================= */

  const handleSubmit = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
      }

      await api.patch(
        `/salary-addon-master/edit/${id}`,
        normalizedPayload,
      )

      toast.success('Salary Addon updated successfully')

      navigate('/salary-addon')
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
          'Failed to update Salary Addon',
      )
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return <div>Loading...</div>
  }

  /* ================= UI ================= */

  return (
    <SalaryAddonFormComponent
      initialData={initialData}
      mode="edit"
      onSubmit={handleSubmit}
    />
  )
}

export default Edit