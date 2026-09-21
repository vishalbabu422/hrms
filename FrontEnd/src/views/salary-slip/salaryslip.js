import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
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
import { cilCloudDownload, cilSearch } from '@coreui/icons'

import api from '../../api/axios'

import './salarySlip.css'

const SalarySlip = () => {
  const currentYear = new Date().getFullYear()

  const user = useSelector((state) => state.auth.user)


  const employeeId = user?.employee_id || user?.id

  const years = [2026, 2025, 2024, 2023, 2022]

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const [selectedYear, setSelectedYear] = useState(currentYear)

  const [salaryHistory, setSalaryHistory] = useState([])

  const [searched, setSearched] = useState(false)

  const [loading, setLoading] = useState(false)

  const [downloadingId, setDownloadingId] = useState(null)

  const [error, setError] = useState('')

  const getSalarySlips = async (year) => {
    if (!employeeId) {
      setSalaryHistory([])
      setSearched(true)
      setError('Employee information is not available.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const params = {
        employee_id: employeeId,
        year,
      }

      const response = await api.get('/employee-salary-register-monthly/generated-slips', {
        params,
      })

      const responseData = response.data?.data || response.data

      setSalaryHistory(responseData?.salarySlips || responseData || [])
      setSearched(true)
    } catch (error) { //catch runs when the API call fails/throws an error.
      setSalaryHistory([])
      setError('No salary slip records found.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (employeeId) {
      getSalarySlips(currentYear)
    }
  }, [employeeId])

  const handleSearch = () => {
    getSalarySlips(selectedYear)
  }

  const handleDownload = async (salary) => {
    const registerId = salary?.register_id

    if (!salary?.mon_salaryslip_generated) {
      setError('Salary slip has not been generated yet.')

      return
    }

    if (!registerId) {
      setError('Register ID is not available.')

      return
    }

    try {
      setDownloadingId(registerId)

      setError('')

      const response = await api.get(
        `/employee-salary-register-monthly/download-slip/${registerId}`,
        {
          responseType: 'blob',
        },
      )

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      })

      const url = window.URL.createObjectURL(blob)

      const monthName = getMonthName(salary)

      const fileName = `Salary-Slip-${monthName}-${salary.year}-Register-${registerId}.pdf`

      const link = document.createElement('a')

      link.href = url

      link.download = fileName

      link.style.display = 'none'

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Unable to download salary slip.')
    } finally {
      setDownloadingId(null)
    }
  }

  const getMonthName = (salary) => {
    const monthNumber = Number(salary?.month)

    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber - 1]
    }

    return '-'
  }

  const formatDate = (date) => {
    if (!date) return '-'

    const d = new Date(date)

    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
      2,
      '0',
    )}/${d.getFullYear()}`
  }

  return (
    <div className="salary-slip-page">
      <div className="salary-page-header">
        <div>
          <h5 className="salary-page-title">Salary Slip</h5>
        </div>
      </div>

      <CCard className="salary-period-card mt-2">
        <CCardBody>
          <CRow className="align-items-end g-3">
            <CCol xs={12} md={4}>
              <div className="salary-form-group">
                <label htmlFor="salaryYear">Year</label>

                <CFormSelect
                  id="salaryYear"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value)

                    setError('')
                  }}
                  className="salary-select"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>

            <CCol xs={12} md={4}>
              <div className="salary-search-button-wrapper">
                <CButton
                  type="button"
                  className="salary-search-button"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <CIcon icon={cilSearch} className="salary-search-button-icon" />

                  <span>{loading ? 'Searching...' : 'Search'}</span>
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {error && <div className="text-danger mt-2">{error}</div>}

      {searched && (
        <CCard className="history-card">
          <CCardBody>
            <div className="history-header">
              <div>
                <h5 className="section-title mb-1">Salary Slip History</h5>

                <p className="history-subtitle">Salary slips for {selectedYear}</p>
              </div>
            </div>

            <div className="salary-table-wrapper">
              <CTable hover responsive className="salary-history-table mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="serial-column">S.No</CTableHeaderCell>

                    <CTableHeaderCell>Month</CTableHeaderCell>

                    <CTableHeaderCell>Year</CTableHeaderCell>

                    <CTableHeaderCell>Transaction Number</CTableHeaderCell>

                    <CTableHeaderCell>Transaction Date</CTableHeaderCell>

                    <CTableHeaderCell className="action-column">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="no-data">
                        Loading salary slips...
                      </CTableDataCell>
                    </CTableRow>
                  ) : salaryHistory.length > 0 ? (
                    salaryHistory.map((salary, index) => (
                      <CTableRow key={salary.register_id || salary.id}>
                        {/* S.NO */}

                        <CTableDataCell>{index + 1}</CTableDataCell>

                        {/* MONTH */}

                        <CTableDataCell>{getMonthName(salary)}</CTableDataCell>

                        {/* YEAR */}

                        <CTableDataCell>{salary.year}</CTableDataCell>

                        {/* TRANSACTION NUMBER */}

                        <CTableDataCell>{salary.transaction_number || '-'}</CTableDataCell>

                        {/* TRANSACTION DATE */}

                        <CTableDataCell>{formatDate(salary.transaction_date)}</CTableDataCell>

                        {/* DOWNLOAD */}

                        <CTableDataCell>
                          <CButton
                            type="button"
                            className="download-table-btn"
                            onClick={() => handleDownload(salary)}
                            disabled={
                              !salary.mon_salaryslip_generated ||
                              downloadingId === salary.register_id
                            }
                          >
                            <CIcon icon={cilCloudDownload} className="table-download-icon" />

                            <span>
                              {downloadingId === salary.register_id
                                ? 'Downloading...'
                                : salary.mon_salaryslip_generated
                                  ? 'Download'
                                  : 'Not generated'}
                            </span>
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="no-data">
                        No salary slip found for {selectedYear}.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      )}
    </div>
  )
}

export default SalarySlip
