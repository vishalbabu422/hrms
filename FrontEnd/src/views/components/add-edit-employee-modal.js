import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CButton,
} from '@coreui/react'

import Select from 'react-select'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const AddEditEmployeeModal = ({
  visible,
  setVisible,
  editEmployee,
  deployment,
  onSuccess,
  editId,
}) => {
  const user = useSelector((state) => state.auth.user)
  const [formData, setFormData] = useState(null)
  const editMode = !!editEmployee
  const [employee, setEmployee] = useState([])

  const fetchEmployeeList = async () => {
    try {
      const response = await api.get('/employee?models=EmployeeWorkOrderDeployment')
      const employees = response.data.data

      const availableEmployees = employees.filter((emp) => {
        return !emp.EmployeeWorkOrderDeployment.some(
          (d) => d.is_deleted === false && d.relieving_date === null,
        )
      })

      setEmployee(availableEmployees || [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch Employee')
    }
  }

  useEffect(() => {
    fetchEmployeeList()
  }, [visible])

  useEffect(() => {
    if (editEmployee) {
      setFormData(editEmployee)
    } else {
      setFormData({
        joining_date: '',
        relieving_date: '',
      })
    }
  }, [editEmployee, visible])

  const handleSave = async () => {
    if (!formData) return

    try {
      const deploymentData = formData?.EmployeeWorkOrderDeployment?.[0] || {}

      const payload = {
        employee_id: formData.id,
        wo_desgn_id: deployment,
        joining_date: formData.joining_date,
        relieving_date: formData.relieving_date || null,
      }

      if (editMode) {
        payload.updated_by = user?.id
        await api.patch(`/admin/workorder-desgn/deployment/${editId}`, payload)
        toast.success('Deployment updated successfully')
      } else {
        payload.created_by = user?.id
        await api.post('/admin/workorder-desgn/deployment', payload)
        toast.success('Employee deployed successfully')
      }
      onSuccess()
      setVisible(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to save deployment')
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
      <CModalHeader>
        <CModalTitle>{editMode ? 'Edit Employee' : 'Add Employee'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CFormLabel>Employee Name</CFormLabel>

        <Select
          isDisabled={editMode}
          options={employee.map((emp) => ({
            value: emp.id,
            label: [emp.first_name, emp?.middle_name, emp?.last_name].filter(Boolean).join(' '),
            data: emp,
          }))}
          value={
            formData
              ? {
                  value: formData.id,
                  label: [formData.first_name, formData.middle_name, formData.last_name]
                    .filter(Boolean)
                    .join(' '),
                }
              : null
          }
          onChange={(selected) => {
            const emp = selected.data
            const deployment = emp.EmployeeWorkOrderDeployment?.[0] || {}

            setFormData({
              ...emp,
            })
          }}
          placeholder="Search employee..."
        />

        <CFormLabel className="mt-2">Email</CFormLabel>
        <CFormInput value={formData?.email || ''} disabled />

        <CFormLabel className="mt-2">Contact</CFormLabel>
        <CFormInput value={formData?.contact_no || ''} disabled />

        <CFormInput
          type="date"
          label="Joining Date"
          className="mt-2"
          value={formData?.joining_date || ''}
          disabled={editMode}
          onChange={(e) =>
            setFormData({
              ...formData,
              joining_date: e.target.value,
            })
          }
        />

        <CFormLabel className="mt-2">Relieving Date</CFormLabel>
        <CFormInput
          type="date"
          value={formData?.relieving_date || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              relieving_date: e.target.value,
            })
          }
        />
      </CModalBody>

      <CModalFooter>
        <CButton color="primary" onClick={handleSave}>
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddEditEmployeeModal
