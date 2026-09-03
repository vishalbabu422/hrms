/* ================= IMPORTS ================= */

import React, { useState } from 'react'
import './SalaryFilterSection.css'
import CIcon from '@coreui/icons-react'

import { cilFilter } from '@coreui/icons'

import {
  CRow,
  CCol,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CFormInput,
} from '@coreui/react'

import './SalaryFilterSection.css'

/* ================= COMPONENT ================= */

const SalaryFilterSection = () => {
  /* ================= STATES ================= */

  const [selectedWorkOrders, setSelectedWorkOrders] = useState([])

  const [selectedStructures, setSelectedStructures] = useState([])

  const [workOrderSearch, setWorkOrderSearch] = useState('')

  const [structureSearch, setStructureSearch] = useState('')


  return (
    <CRow className="g-3 align-items-end justify-content-between">
      {/* SEARCH BUTTON */}
      <CCol xs={12} sm={6} md={3}>
        <CButton
          color="light"
          className="w-100 rounded-3 fw-semibold"
          style={{
            width: '100%',
            height: '44px',
            border: '1px solid #d8dbe0',
            color: '#3c4b64',
            background: '#fff',
            boxShadow: 'none',
            transition: '0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#5856d6'

            e.target.style.borderColor = '#5856d6'

            e.target.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#fff'

            e.target.style.borderColor = '#d8dbe0'

            e.target.style.color = '#3c4b64'
          }}
        >
          Search
        </CButton>
      </CCol>

      {/* FILTER BUTTON */}
      <CCol xs={12} sm="auto" className="d-flex justify-content-end ms-auto">
        <CDropdown alignment="end">
          {/* BUTTON */}
          <CDropdownToggle
            color="light"
            className="rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            style={{
              height: '44px',
              border: '1px solid #d8dbe0',
              color: '#3c4b64',
              background: '#fff',
              boxShadow: 'none',
              minWidth: '120px',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#5856d6'

              e.target.style.borderColor = '#5856d6'

              e.target.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff'

              e.target.style.borderColor = '#d8dbe0'

              e.target.style.color = '#3c4b64'
            }}
          >
            <CIcon icon={cilFilter} />

            <span>Filters</span>
          </CDropdownToggle>

          {/* MENU */}
          <CDropdownMenu
            className="filter-dropdown-menu border-0 rounded-4 shadow p-0 overflow-hidden"
            style={{
              width: '750px',
              maxWidth: '95vw',
              marginTop: '12px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
            }}
          >
            {/* HEADER */}
            <div
              className="px-4 py-3"
              style={{
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              <div
                className="fw-bold text-uppercase"
                style={{
                  fontSize: '15px',
                  letterSpacing: '0.5px',
                  color: '#0f172a',
                }}
              >
                Filters
              </div>
            </div>

            {/* BODY */}
            <div className="px-4 py-4">
              <div className="row g-4">
                {/* WORK ORDER */}
                <div className="col-12 col-md-6">
                  {/* HEADER */}
                  <div className="mb-3">
                    <div
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: '#64748b',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      Work Order
                    </div>
                  </div>

                  {/* SEARCH */}
                  <div className="mb-3">
                    <CFormInput
                      size="sm"
                      value={workOrderSearch}
                      onChange={(e) => setWorkOrderSearch(e.target.value)}
                      placeholder="Search Work Order..."
                      className="rounded-3"
                    />
                  </div>

                  {/* LIST */}
                  <div
                    className="slim-scroll"
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      paddingRight: '8px',
                    }}
                  >
                    <div className="d-flex flex-column gap-3">
                      {/* SELECT ALL */}
                      <label className="d-flex align-items-center gap-3">
                        <input
                          type="checkbox"
                          checked={
                            selectedWorkOrders.length === workOrders.length && workOrders.length > 0
                          }
                          onChange={() => {
                            if (selectedWorkOrders.length === workOrders.length) {
                              setSelectedWorkOrders([])
                            } else {
                              setSelectedWorkOrders(workOrders.map((_, index) => index + 1))
                            }
                          }}
                        />

                        <span className="fw-semibold">Select All</span>
                      </label>

                      {/* OPTIONS */}
                      {workOrders
                        .filter((item) =>
                          item.toLowerCase().includes(workOrderSearch.toLowerCase()),
                        )
                        .map((workOrder, index) => (
                          <label key={index} className="d-flex align-items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedWorkOrders.includes(index + 1)}
                              onChange={() => {
                                setSelectedWorkOrders((prev) =>
                                  prev.includes(index + 1)
                                    ? prev.filter((x) => x !== index + 1)
                                    : [...prev, index + 1],
                                )
                              }}
                            />

                            <span>{workOrder}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>

                {/* STRUCTURE */}
                <div className="col-12 col-md-6 border-md-start">
                  {/* HEADER */}
                  <div className="mb-3 ps-md-3">
                    <div
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: '#64748b',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      Salary Structure
                    </div>
                  </div>

                  {/* SEARCH */}
                  <div className="mb-3 ps-md-3">
                    <CFormInput
                      size="sm"
                      value={structureSearch}
                      onChange={(e) => setStructureSearch(e.target.value)}
                      placeholder="Search Structure..."
                      className="rounded-3"
                    />
                  </div>

                  {/* LIST */}
                  <div
                    className="slim-scroll ps-md-3"
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      paddingRight: '8px',
                    }}
                  >
                    <div className="d-flex flex-column gap-3">
                      {/* SELECT ALL */}
                      <label className="d-flex align-items-center gap-3">
                        <input
                          type="checkbox"
                          checked={
                            selectedStructures.length === salaryStructures.length &&
                            salaryStructures.length > 0
                          }
                          onChange={() => {
                            if (selectedStructures.length === salaryStructures.length) {
                              setSelectedStructures([])
                            } else {
                              setSelectedStructures(salaryStructures.map((_, index) => index + 1))
                            }
                          }}
                        />

                        <span className="fw-semibold">Select All</span>
                      </label>

                      {/* OPTIONS */}
                      {salaryStructures
                        .filter((item) =>
                          item.toLowerCase().includes(structureSearch.toLowerCase()),
                        )
                        .map((structure, index) => (
                          <label key={index} className="d-flex align-items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedStructures.includes(index + 1)}
                              onChange={() => {
                                setSelectedStructures((prev) =>
                                  prev.includes(index + 1)
                                    ? prev.filter((x) => x !== index + 1)
                                    : [...prev, index + 1],
                                )
                              }}
                            />

                            <span>{structure}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div
              className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center px-4 py-3"
              style={{
                borderTop: '1px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              {/* CLEAR ALL */}
              <CButton
                color="light"
                className="rounded-3 fw-semibold px-4"
                style={{
                  height: '42px',
                  border: '1px solid #d8dbe0',
                  color: '#3c4b64',
                  background: '#fff',
                  boxShadow: 'none',
                  transition: '0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#5856d6'

                  e.target.style.borderColor = '#5856d6'

                  e.target.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff'

                  e.target.style.borderColor = '#d8dbe0'

                  e.target.style.color = '#3c4b64'
                }}
                onClick={() => {
                  setSelectedWorkOrders([])

                  setSelectedStructures([])

                  setWorkOrderSearch('')

                  setStructureSearch('')
                }}
              >
                Clear All
              </CButton>

              {/* APPLY */}
              <CButton
                className="border-0 rounded-3 px-4 fw-semibold"
                style={{
                  height: '42px',
                  background: '#0f2b7a',
                  color: '#fff',
                }}
              >
                Apply Filter
              </CButton>
            </div>
          </CDropdownMenu>
        </CDropdown>
      </CCol>
    </CRow>
  )
}

export default SalaryFilterSection
