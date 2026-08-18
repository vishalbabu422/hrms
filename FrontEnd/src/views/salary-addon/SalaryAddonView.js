import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'

const SalaryAddonView = () => {
  const { id } = useParams()

  /* ================= STATES ================= */

  const [month, setMonth] = useState('')

  const [year, setYear] = useState('')

  const [loading, setLoading] = useState(false)

  const [viewData, setViewData] = useState(null)

  /* ================= MONTHS ================= */

  const months = [
    {
      label: 'January',
      value: 1,
    },

    {
      label: 'February',
      value: 2,
    },

    {
      label: 'March',
      value: 3,
    },

    {
      label: 'April',
      value: 4,
    },

    {
      label: 'May',
      value: 5,
    },

    {
      label: 'June',
      value: 6,
    },

    {
      label: 'July',
      value: 7,
    },

    {
      label: 'August',
      value: 8,
    },

    {
      label: 'September',
      value: 9,
    },

    {
      label: 'October',
      value: 10,
    },

    {
      label: 'November',
      value: 11,
    },

    {
      label: 'December',
      value: 12,
    },
  ]

  /* ================= YEARS ================= */

  const currentYear = new Date().getFullYear()

  const years = Array.from({ length: 4 }, (_, index) => currentYear - 3 + index)

  /* ================= VIEW ================= */

  const handleView = async () => {
    try {
      setLoading(true)

      const firstDay = `${year}-${String(month).padStart(2, '0')}-01`

      const lastDay = new Date(year, month, 0).toISOString().split('T')[0]

      const modelFilter = {
        employeeSalaryAddons: {
          required: false,
          effective_from: {
            $gte: firstDay,
          },

          effective_to: {
            $lte: lastDay,
          },
        },
      }

      const response = await api.get(
        `salary-addon-master/${id}?models=employeeSalaryAddons.employee&modelFilter=${encodeURIComponent(
          JSON.stringify(modelFilter),
        )}`,
      )

      setViewData(
        response.data.status === 'success'
          ? response.data.data
          : {
              employeeSalaryAddons: [],
            },
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer fluid>
      {/* PAGE TITLE */}

      <div className="mb-4">
        <h4 className="fw-bold mb-1">View Salary Addon Details</h4>

        <div
          style={{
            color: '#64748b',
            fontSize: '14px',
          }}
        >
          View employee-wise addon details month and year wise
        </div>
      </div>

      {/* FILTER CARD */}

      <CCard className="rounded-4 mb-4 border shadow-sm">
        <CCardBody>
          <CRow>
            {/* MONTH */}

            <CCol md={4}>
              <CFormLabel>Month</CFormLabel>

              <CFormSelect value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select Month</option>

                {months.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* YEAR */}

            <CCol md={4}>
              <CFormLabel>Year</CFormLabel>

              <CFormSelect value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select Year</option>

                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* BUTTON */}

            <CCol md={4} className="d-flex align-items-end">
              <CButton color="primary" onClick={handleView} disabled={!month || !year}>
                {loading ? <CSpinner size="sm" color="light" /> : 'View Details'}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* DATA */}

      {viewData && (
        <>
          {/* SUMMARY CARD */}

          <CCard className="rounded-4 mb-4 border shadow-sm">
            <CCardBody>
              <h5 className="fw-bold mb-4">Summary</h5>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <div className="text-muted small">Addon Name</div>

                    <div className="fw-semibold">{viewData.name}</div>
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="mb-3">
                    <div className="text-muted small">Employees</div>

                    <div className="fw-semibold">{viewData.employeeSalaryAddons?.length}</div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* EMPLOYEE TABLE */}

          <CCard className="rounded-4 border shadow-sm">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Employee Details</h5>

                <div className="text-muted small">
                  {viewData.employeeSalaryAddons?.length} Employees Found
                </div>
              </div>

              <CTable hover responsive align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Employee</CTableHeaderCell>

                    <CTableHeaderCell>Employee Code</CTableHeaderCell>

                    <CTableHeaderCell>Amount</CTableHeaderCell>

                    <CTableHeaderCell>Recurrence</CTableHeaderCell>

                    <CTableHeaderCell>Effective From</CTableHeaderCell>

                    <CTableHeaderCell>Effective To</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {viewData?.employeeSalaryAddons?.length > 0 ? (
                    viewData.employeeSalaryAddons.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>
                          {[
                            item.employee?.first_name,
                            item.employee?.middle_name ?? '',
                            item.employee?.last_name ?? '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        </CTableDataCell>

                        <CTableDataCell>{item.employee?.employee_code}</CTableDataCell>

                        <CTableDataCell>
                          ₹{Number(item.amount).toLocaleString('en-IN')}
                        </CTableDataCell>

                        <CTableDataCell>{item.recurrence_type}</CTableDataCell>

                        <CTableDataCell>{item.effective_from}</CTableDataCell>

                        <CTableDataCell>{item.effective_to}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center py-4 text-muted">
                        No employees found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </>
      )}
    </CContainer>
  )
}

export default SalaryAddonView
