import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import api from '../../api/axios'
import TableEmptyState from './table-empty'
import { formatDate } from '../../utils/dateUtils'

const DeploymentTableModal = ({
  visible,
  tableVisible,
  setTableVisible,
  deployment,
  onEdit,
  onSuccess,
}) => {
  const [employeeDeployment, setEmployeeDeployment] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchEmployeeTableList = async () => {
    try {
      setLoading(true)
      if (deployment != null) {
        const response = await api.get(
          `/admin/workorder-desgn/${deployment}?models=EmployeeWorkOrderDeployments.Employee&modelFilter=%7B%22EmployeeWorkOrderDeployments%22%3A%7B%22is_deleted%22%3Afalse%7D%7D`,
        )

        if (response.data?.data.length === 0) setTableVisible(false)

        setEmployeeDeployment(response.data?.data?.EmployeeWorkOrderDeployments)
      }
    } catch (error) {
      console.error('Failed to fetch deployment:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployeeTableList()
  }, [deployment, tableVisible, visible])

  const deleteHandle = async (deploymentId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to remove this deployment?')

      if (!confirmDelete) return

      await api.delete(`/admin/workorder-desgn/deployment/${deploymentId}`)

      fetchEmployeeTableList() // Refresh table
      onSuccess() // refresh parent data
    } catch (error) {
      console.error('Failed to delete deployment:', error)
    }
  }

  return (
    <CModal visible={tableVisible} onClose={() => setTableVisible(false)} size="lg">
      <CModalHeader>
        <CModalTitle>Deployed Employees</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CTable bordered hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Contact</CTableHeaderCell>
              <CTableHeaderCell>Joining</CTableHeaderCell>
              <CTableHeaderCell>Relieving</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center py-4">
                  <CSpinner size="sm" />
                </CTableDataCell>
              </CTableRow>
            ) : employeeDeployment?.length > 0 ? (
              employeeDeployment?.map((emp) => (
                <CTableRow key={emp.id}>
                  <CTableDataCell>{`${emp?.Employee.first_name} ${emp?.Employee.middle_name ?? ''} ${emp?.Employee.last_name ?? ''}`}</CTableDataCell>
                  <CTableDataCell>{emp?.Employee.email}</CTableDataCell>

                  <CTableDataCell>{emp?.Employee.contact_no}</CTableDataCell>
                  <CTableDataCell>{formatDate(emp?.joining_date)}</CTableDataCell>
                  
                  <CTableDataCell>{formatDate(emp?.relieving_date)}</CTableDataCell>

                  <CTableDataCell>
                    <CButton
                      size="sm"
                      variant="ghost"
                      color="primary"
                      onClick={() =>
                        onEdit(emp?.id, {
                          ...emp.Employee,
                          joining_date: emp.joining_date,
                          relieving_date: emp.relieving_date,
                        })
                      }
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>

                    <CButton
                      size="sm"
                      variant="ghost"
                      color="danger"
                      className="ms-2"
                      onClick={() => deleteHandle(emp?.id)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <TableEmptyState colSpan={6} />
            )}
          </CTableBody>
        </CTable>
      </CModalBody>
    </CModal>
  )
}

export default DeploymentTableModal
