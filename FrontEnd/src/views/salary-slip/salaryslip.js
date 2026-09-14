import React, { useMemo, useState } from 'react'
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

import './SalarySlip.css'

const SalarySlip = () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

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

  const salaryHistory = [
    {
      id: 1,
      month: 'September',
      monthNumber: '09',
      year: 2026,
      transactionNumber: 'SAL-2026-09-001',
      transactionDate: '30 Sep 2026',
    },
    {
      id: 2,
      month: 'August',
      monthNumber: '08',
      year: 2026,
      transactionNumber: 'SAL-2026-08-001',
      transactionDate: '31 Aug 2026',
    },
    {
      id: 3,
      month: 'July',
      monthNumber: '07',
      year: 2026,
      transactionNumber: 'SAL-2026-07-001',
      transactionDate: '31 Jul 2026',
    },
    {
      id: 4,
      month: 'June',
      monthNumber: '06',
      year: 2026,
      transactionNumber: 'SAL-2026-06-001',
      transactionDate: '30 Jun 2026',
    },
    {
      id: 5,
      month: 'May',
      monthNumber: '05',
      year: 2026,
      transactionNumber: 'SAL-2026-05-001',
      transactionDate: '31 May 2026',
    },
    {
      id: 6,
      month: 'April',
      monthNumber: '04',
      year: 2026,
      transactionNumber: 'SAL-2026-04-001',
      transactionDate: '30 Apr 2026',
    },
  ]

  const [selectedYear, setSelectedYear] = useState(currentYear)

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth] || 'September')

  const [searched, setSearched] = useState(false)

  const filteredHistory = useMemo(() => {
    if (!searched) {
      return []
    }

    return salaryHistory.filter(
      (item) => item.year === Number(selectedYear) && item.month === selectedMonth,
    )
  }, [searched, selectedYear, selectedMonth])

  const handleSearch = () => {
    setSearched(true)
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

                    setSearched(false)
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
              <div className="salary-form-group">
                <label htmlFor="salaryMonth">Month</label>

                <CFormSelect
                  id="salaryMonth"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value)

                    setSearched(false)
                  }}
                  className="salary-select"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>

            <CCol xs={12} md={4}>
              <div className="salary-search-button-wrapper">
                <CButton type="button" className="salary-search-button" onClick={handleSearch}>
                  <CIcon icon={cilSearch} className="salary-search-button-icon" />

                  <span>Search</span>
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {searched && (
        <CCard className="history-card">
          <CCardBody>
            <div className="history-header">
              <div>
                <h5 className="section-title mb-1">Salary Slip History</h5>

                <p className="history-subtitle">Salary slip for the selected period</p>
              </div>
            </div>

            <div className="salary-table-wrapper">
              <CTable hover responsive className="salary-history-table mb-0">
                {/* TABLE HEADER */}

                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="serial-column">#</CTableHeaderCell>

                    <CTableHeaderCell>Month</CTableHeaderCell>

                    <CTableHeaderCell>Year</CTableHeaderCell>

                    <CTableHeaderCell>Transaction Number</CTableHeaderCell>

                    <CTableHeaderCell>Transaction Date</CTableHeaderCell>

                    <CTableHeaderCell className="action-column">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                {/* TABLE BODY */}

                <CTableBody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((salary, index) => (
                      <CTableRow key={salary.id}>
                        {/* NUMBER */}

                        <CTableDataCell>{index + 1}</CTableDataCell>

                        {/* MONTH */}

                        <CTableDataCell>{salary.month}</CTableDataCell>

                        {/* YEAR */}

                        <CTableDataCell>{salary.year}</CTableDataCell>

                        {/* TRANSACTION NUMBER */}

                        <CTableDataCell>{salary.transactionNumber}</CTableDataCell>

                        {/* TRANSACTION DATE */}

                        <CTableDataCell>{salary.transactionDate}</CTableDataCell>

                        {/* DOWNLOAD */}

                        <CTableDataCell>
                          <CButton
                            type="button"
                            className="download-table-btn"
                            onClick={() => handleDownload(salary)}
                          >
                            <CIcon icon={cilCloudDownload} className="table-download-icon" />

                            <span>Download</span>
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="no-data">
                        No salary slip found for {selectedMonth} {selectedYear}.
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
