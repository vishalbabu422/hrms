import React, { useEffect, useState } from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import { toast } from 'react-toastify'

import api from '../../api/axios'

import PageHeader from '../components/form-header'

import './style.css'

const SalaryAccountStatement = () => {
  const currentYear = new Date().getFullYear()

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  const years = Array.from({ length: 6 }, (_, index) => ({
    value: String(currentYear - index),
    label: String(currentYear - index),
  }))

  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [employees, setEmployees] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [loading, setLoading] = useState(false)

  const getSalaryRegisters = (employee) => {
    const registers = employee?.employeeSalaryRegisters

    if (Array.isArray(registers)) {
      return registers
    }

    if (registers && typeof registers === 'object') {
      if (Array.isArray(registers.data)) {
        return registers.data
      }

      if (Array.isArray(registers.rows)) {
        return registers.rows
      }

      if (registers.data && typeof registers.data === 'object') {
        if (Array.isArray(registers.data.rows)) {
          return registers.data.rows
        }

        if (Array.isArray(registers.data.data)) {
          return registers.data.data
        }
      }

      return [registers]
    }

    return []
  }

  const findSalaryRegister = (employee) => {
    const registers = getSalaryRegisters(employee)

    return (
      registers.find((item) => {
        const registerMonth = Number(item?.month ?? item?.salary_month ?? item?.month_id)

        const registerYear = Number(item?.year ?? item?.salary_year)

        const status = String(item?.status || item?.dispatch_status || item?.dispatchStatus || '')
          .trim()
          .toUpperCase()

        return (
          registerMonth === Number(month) &&
          registerYear === Number(year) &&
          status === 'DISPATCHED'
        )
      }) || null
    )
  }

  const fetchSalaryStatements = async () => {
    if (!month || !year) {
      setEmployees([])
      setSelectedEmployees([])
      return
    }

    try {
      setLoading(true)

      const selectedMonth = Number(month)
      const selectedYear = Number(year)

      const employeeParams = {
        models:
          'empSalaryStructure.salaryStructure,employeeSalaryRegisters,employeeWorkOrderDeployment.WoDesgnMapping',

        is_active: true,

        sort: 'first_name asc',

        modelFilter: JSON.stringify({
          employeeWorkOrderDeployment: {
            required: true,
            is_deleted: false,
          },
        }),
      }

      const employeeResponse = await api.get('employee', {
        params: employeeParams,
      })

      console.log('========== SALARY REGISTER DEBUG ==========')

      console.log('Selected Month:', selectedMonth)

      console.log('Selected Year:', selectedYear)

      console.log('FULL EMPLOYEE API RESPONSE:', employeeResponse?.data)

      const employeeData = employeeResponse?.data?.data

      const employeePayload = employeeResponse?.data

      let employeeList = []

      if (Array.isArray(employeeData)) {
        employeeList = employeeData
      } else if (Array.isArray(employeeData?.employees)) {
        employeeList = employeeData.employees
      } else if (Array.isArray(employeeData?.rows)) {
        employeeList = employeeData.rows
      } else if (Array.isArray(employeePayload)) {
        employeeList = employeePayload
      } else if (Array.isArray(employeePayload?.employees)) {
        employeeList = employeePayload.employees
      } else if (Array.isArray(employeePayload?.rows)) {
        employeeList = employeePayload.rows
      }

      let salaryStatements = []

      try {
        const statementResponse = await api.get('/emp-salary-statement/', {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        })

        console.log('SALARY STATEMENT API RESPONSE:', statementResponse?.data)

        salaryStatements = statementResponse?.data?.data?.salaryStatements || []
      } catch (statementError) {
        console.warn(
          'Salary Statement API is not available:',
          statementError?.response?.status,
          statementError?.response?.data,
        )

        // Keep employee list working even if
        // salary statement API is not available.
        salaryStatements = []
      }

      const statementMap = {}

      salaryStatements.forEach((statement) => {
        if (statement?.emp_id !== undefined && statement?.emp_id !== null) {
          statementMap[String(statement.emp_id)] = statement
        }
      })

      const formattedEmployees = employeeList
        .map((employee) => {
          const registers = getSalaryRegisters(employee)

          console.log(`Employee ${employee?.id} salary registers:`, registers)

          const register = findSalaryRegister(employee)

          console.log(`Employee ${employee?.id} matched register:`, register)

          if (!register) {
            return null
          }

          const statement = statementMap[String(employee?.id)] || null

          const fullName = [employee?.first_name, employee?.middle_name, employee?.last_name]
            .filter(Boolean)
            .join(' ')

          const statementPath =
            statement?.statement_path ||
            register?.statement_path ||
            register?.salary_statement_path ||
            register?.file_path ||
            register?.pdf_path ||
            null

          return {
            id: employee?.id,

            full_name: fullName || '-',

            employee_code: employee?.employee_code || '-',

            // Salary values
            net_salary: Number(register?.net_salary || 0),

            gross_earnings: Number(register?.gross_earnings || 0),

            total_deductions: Number(register?.total_deductions || 0),

            // Statement path
            statement_path: statementPath,

            statement_id: statement?.id || null,

            month: selectedMonth,

            year: selectedYear,

            status: String(
              register?.status || register?.dispatch_status || register?.dispatchStatus || '',
            )
              .trim()
              .toUpperCase(),
          }
        })
        .filter(Boolean)

      console.log(
        `FINAL Salary Account Statement (${selectedMonth}/${selectedYear}):`,
        formattedEmployees,
      )

      setEmployees(formattedEmployees)

      // Clear old checkbox selection
      setSelectedEmployees([])
    } catch (error) {
      console.error('Salary Account Statement Error:', error)

      setEmployees([])
      setSelectedEmployees([])

      toast.error(error?.response?.data?.message || 'Failed to fetch salary account statements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalaryStatements()
  }, [month, year])

  const handleEmployeeCheck = (employee) => {
    setSelectedEmployees((prev) => {
      const alreadySelected = prev.some((item) => item.id === employee.id)

      if (alreadySelected) {
        return prev.filter((item) => item.id !== employee.id)
      }

      return [...prev, employee]
    })
  }

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedEmployees(employees)
    } else {
      setSelectedEmployees([])
    }
  }

  const isAllSelected = employees.length > 0 && selectedEmployees.length === employees.length

  const handleDownload = async (employee) => {
    if (!employee?.statement_path) {
      toast.error('Salary statement is not available')
      return
    }

    try {
      const filePath = String(employee.statement_path).replace(/\\/g, '/')

      const baseURL = api.defaults.baseURL?.replace(/\/api\/v1\/?$/, '') || window.location.origin

      const fileURL = `${baseURL}/${filePath}`

      window.open(fileURL, '_blank')
    } catch (error) {
      console.error('Download Error:', error)

      toast.error('Unable to download salary statement')
    }
  }

  return (
    <CContainer fluid>
      {/* PAGE HEADER */}
      <PageHeader title="Salary Account Statement" />

      <CCard className="sas-card">
        <CCardBody className="sas-card-body">
          <CRow className="g-3 mb-3">
            {/* MONTH */}
            <CCol md={6}>
              <label className="form-label">Month</label>

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
            <CCol md={6}>
              <label className="form-label">Year</label>

              <CFormSelect value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select Year</option>

                {years.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {month && year && (
            <div className="sas-table">
              <CTable hover responsive className="mb-0">
                {/* TABLE HEADER */}
                <CTableHead>
                  <CTableRow>
                    {/* SELECT ALL */}
                    <CTableHeaderCell
                      className="text-center"
                      style={{
                        width: '50px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="employee-checkbox"
                        disabled={loading || employees.length === 0}
                      />
                    </CTableHeaderCell>

                    {/* EMPLOYEE */}
                    <CTableHeaderCell
                      style={{
                        width: '40%',
                      }}
                    >
                      Employee Name
                    </CTableHeaderCell>

                    {/* NET SALARY */}
                    <CTableHeaderCell
                      className="text-center"
                      style={{
                        width: '35%',
                      }}
                    >
                      Net Salary
                    </CTableHeaderCell>

                    {/* ACTION */}
                    <CTableHeaderCell
                      className="text-center"
                      style={{
                        width: '20%',
                      }}
                    >
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                {/* TABLE BODY */}
                <CTableBody>
                  {/* LOADING */}
                  {loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-center">
                        Loading...
                      </CTableDataCell>
                    </CTableRow>
                  ) : employees.length > 0 ? (
                    employees.map((employee) => {
                      const isSelected = selectedEmployees.some((item) => item.id === employee.id)

                      return (
                        <CTableRow key={employee.id}>
                          {/* CHECKBOX */}
                          <CTableDataCell className="text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleEmployeeCheck(employee)}
                              className="employee-checkbox"
                            />
                          </CTableDataCell>

                          {/* EMPLOYEE NAME */}
                          <CTableDataCell>{employee.full_name}</CTableDataCell>

                          {/* NET SALARY */}
                          <CTableDataCell className="text-center">
                            ₹
                            {Number(employee.net_salary || 0).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </CTableDataCell>

                          {/* ACTION */}
                          <CTableDataCell className="text-center">
                            <CButton
                              color="primary"
                              variant="ghost"
                              className="sas-download-btn"
                              onClick={() => handleDownload(employee)}
                              title="Download Salary Statement"
                            >
                              <CIcon icon={cilCloudDownload} size="lg" />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  ) : (
                    /* NO DATA */
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-center text-muted">
                        No dispatched employees found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default SalaryAccountStatement
