import EmpSalaryStructureForm from './form-component'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CSpinner, CCard, CCardBody } from '@coreui/react'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/employee-salary-structure/${id}?models=employee.employeeWorkOrderDeployment.WoDesgnMapping`)
        setInitialData(mapApiToForm(res.data.data))
      } catch (err) {
        console.error(err)
        toast.error('Failed to load Employee Salary Structure')
        navigate('/emp-salary-structure')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate])

  /* ================= MAP ================= */

  const mapApiToForm = (data) => {
    return {
      work_order_id: data?.employee?.employeeWorkOrderDeployment?.WoDesgnMapping?.work_order_ ?? '',
      salary_structure_id: data.salary_structure_id ?? '',
      employee_id: data.employee_id ?? '',
      ctc: data.ctc ?? '',
      effective_from: data.effective_from ?? '',
    }
  }

  /* ================= UPDATE ================= */

  const handleUpdate = async (payload) => {
    try {
      await api.patch(`/employee-salary-structure/${id}`, payload)

      toast.success('Employee Salary Structure updated successfully')
      navigate('/emp-salary-structure')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update Employee Salary Structure')
    }
  }

  /* ================= LOADER ================= */

  if (loading) {
    return (
      <CCard>
        <CCardBody
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '300px' }}
        >
          <CSpinner />
        </CCardBody>
      </CCard>
    )
  }

  return <EmpSalaryStructureForm initialData={initialData} mode="edit" onSubmit={handleUpdate} />
}

export default Edit
