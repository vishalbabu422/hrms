import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'

const SalaryBreakdownView = ({ visible, onClose, employee, salaryStructureId }) => {
  const [loading, setLoading] = useState(false)
  const [salaryData, setSalaryData] = useState(null)

  const fetchSalaryBreakdown = async () => {
    try {
      if (!employee?.employee_id || !salaryStructureId) {
        return
      }

      setLoading(true)

      const response = await api.get(
        `employee-salary-structure/${salaryStructureId}/emp/${employee.employee_id}`,
      )

      setSalaryData(response?.data?.data || null)
    } catch (error) {
      console.error(error)
      setSalaryData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      fetchSalaryBreakdown()
    }
  }, [visible, employee, salaryStructureId])

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const earnings = useMemo(() => {
    return (salaryData?.components || []).filter((item) => item.type === 'EARNING')
  }, [salaryData])

  const deductions = useMemo(() => {
    return (salaryData?.components || []).filter((item) => item.type === 'DEDUCTION')
  }, [salaryData])

  return (
    <CModal
      visible={visible}
      size="xl"
      fullscreen="xl-down"
      alignment="center"
      scrollable
      className="salary-breakdown-modal"
      onClose={onClose}
    >
      <CModalHeader>
        <CModalTitle>
          Salary Breakdown
          {employee?.name ? ` - ${employee.name}` : ''}
        </CModalTitle>
      </CModalHeader>

      <CModalBody
        style={{
          padding: '1rem 1.2rem',
        }}
      >
        {loading ? (
          <div className="text-center py-5">
            <CSpinner />
          </div>
        ) : !salaryData ? (
          <div className="text-center py-5 text-muted">No salary breakdown found</div>
        ) : (
          <>
            {/* Top Summary */}

            <CRow className="mb-3">
              <CCol md={4}>
                <CCard>
                  <CCardBody>
                    <div className="text-muted small">Monthly Gross</div>

                    <h5 className="fw-bold mb-0 text-primary">
                      ₹ {formatCurrency(salaryData.gross_earnings_monthly)}
                    </h5>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4}>
                <CCard>
                  <CCardBody>
                    <div className="text-muted small">Monthly Net</div>

                    <h5 className="fw-bold mb-0 text-success">
                      ₹ {formatCurrency(salaryData.net_salary_monthly)}
                    </h5>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4}>
                <CCard>
                  <CCardBody>
                    <div className="text-muted small">Annual Net</div>

                    <h5 className="fw-bold mb-0 text-info">
                      ₹ {formatCurrency(salaryData.net_salary_yearly)}
                    </h5>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Employee Details */}

            <CCard className="mb-3">
              <CCardBody className="py-3">
                <CRow className="text-center align-items-center">
                  <CCol md={4}>
                    <div className="text-muted small mb-1">Employee Name</div>

                    <div className="fw-semibold fs-6">{salaryData.employee_name}</div>
                  </CCol>

                  <CCol md={4}>
                    <div className="text-muted small mb-1">Monthly CTC</div>

                    <div className="fw-semibold fs-6">
                      ₹ {formatCurrency(salaryData.monthly_ctc)}
                    </div>
                  </CCol>

                  <CCol md={4}>
                    <div className="text-muted small mb-1">Yearly CTC</div>

                    <div className="fw-semibold fs-6">
                      ₹ {formatCurrency(salaryData.yearly_ctc)}
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            {/* Breakdown Tables */}

            <CRow>
              {/* Monthly Breakdown */}

              <CCol md={6}>
                <CCard className="mb-3">
                  <CCardBody>
                    <h5
                      className="fw-bold mb-3"
                      style={{
                        color: '#4f46e5',
                      }}
                    >
                      Monthly Breakdown
                    </h5>

                    <CTable bordered hover responsive align="middle">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Salary Component</CTableHeaderCell>

                          <CTableHeaderCell className="text-end">Monthly Amount</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {/* Earnings */}

                        <CTableRow>
                          <CTableDataCell
                            colSpan={2}
                            style={{
                              background: '#eef2ff',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}
                          >
                            Earnings
                          </CTableDataCell>
                        </CTableRow>

                        {earnings.map((item) => (
                          <CTableRow key={item.component_id}>
                            <CTableDataCell>{item.name}</CTableDataCell>

                            <CTableDataCell className="text-end">
                              ₹ {formatCurrency(item.monthly_amount)}
                            </CTableDataCell>
                          </CTableRow>
                        ))}

                        <CTableRow
                          style={{
                            background: '#ecfdf5',
                            fontWeight: '700',
                          }}
                        >
                          <CTableDataCell>Gross Earnings</CTableDataCell>

                          <CTableDataCell className="text-end text-success">
                            ₹ {formatCurrency(salaryData.gross_earnings_monthly)}
                          </CTableDataCell>
                        </CTableRow>

                        {/* Deductions */}

                        <CTableRow>
                          <CTableDataCell
                            colSpan={2}
                            style={{
                              background: '#fef2f2',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}
                          >
                            Deductions
                          </CTableDataCell>
                        </CTableRow>

                        {deductions.map((item) => (
                          <CTableRow key={item.component_id}>
                            <CTableDataCell>{item.name}</CTableDataCell>

                            <CTableDataCell className="text-end">
                              ₹ {formatCurrency(item.monthly_amount)}
                            </CTableDataCell>
                          </CTableRow>
                        ))}

                        <CTableRow
                          style={{
                            background: '#fef2f2',
                            fontWeight: '700',
                          }}
                        >
                          <CTableDataCell>Total Deductions</CTableDataCell>

                          <CTableDataCell className="text-end text-danger">
                            ₹ {formatCurrency(salaryData.total_deductions_monthly)}
                          </CTableDataCell>
                        </CTableRow>

                        <CTableRow
                          style={{
                            background: '#ede9fe',
                            fontWeight: '700',
                          }}
                        >
                          <CTableDataCell>Net Salary</CTableDataCell>

                          <CTableDataCell className="text-end text-primary">
                            ₹ {formatCurrency(salaryData.net_salary_monthly)}
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Annual Breakdown */}

              <CCol md={6}>
                <CCard className="mb-3">
                  <CCardBody>
                    <h5
                      className="fw-bold mb-3"
                      style={{
                        color: '#2563eb',
                      }}
                    >
                      Annual Breakdown
                    </h5>

                    <CTable bordered hover responsive align="middle">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Salary Component</CTableHeaderCell>

                          <CTableHeaderCell className="text-end">Annual Amount</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {/* Earnings */}

                        <CTableRow>
                          <CTableDataCell
                            colSpan={2}
                            style={{
                              background: '#eef2ff',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}
                          >
                            Earnings
                          </CTableDataCell>
                        </CTableRow>

                        {earnings.map((item) => (
                          <CTableRow key={item.component_id}>
                            <CTableDataCell>{item.name}</CTableDataCell>

                            <CTableDataCell className="text-end">
                              ₹ {formatCurrency(item.yearly_amount)}
                            </CTableDataCell>
                          </CTableRow>
                        ))}

                        <CTableRow
                          style={{
                            background: '#ecfdf5',
                            fontWeight: '700',
                          }}
                        >
                          <CTableDataCell>Gross Earnings</CTableDataCell>

                          <CTableDataCell className="text-end text-success">
                            ₹ {formatCurrency(salaryData.gross_earnings_yearly)}
                          </CTableDataCell>
                        </CTableRow>

                        {/* Deductions */}

                        <CTableRow>
                          <CTableDataCell
                            colSpan={2}
                            style={{
                              background: '#fef2f2',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}
                          >
                            Deductions
                          </CTableDataCell>
                        </CTableRow>

                        {deductions.map((item) => (
                          <CTableRow key={item.component_id}>
                            <CTableDataCell>{item.name}</CTableDataCell>

                            <CTableDataCell className="text-end">
                              ₹ {formatCurrency(item.yearly_amount)}
                            </CTableDataCell>
                          </CTableRow>
                        ))}

                        <CTableRow
                          style={{
                            background: '#fef2f2',
                            fontWeight: '700',
                          }}
                        >
                          <CTableDataCell>Total Deductions</CTableDataCell>

                          <CTableDataCell className="text-end text-danger">
                            ₹ {formatCurrency(salaryData.total_deductions_yearly)}
                          </CTableDataCell>
                        </CTableRow>

                        <CTableRow
                          style={{
                            background: '#ede9fe',
                            fontWeight: '700',
                          }}
                        >
                          <CTableDataCell>Net Salary</CTableDataCell>

                          <CTableDataCell className="text-end text-primary">
                            ₹ {formatCurrency(salaryData.net_salary_yearly)}
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SalaryBreakdownView
