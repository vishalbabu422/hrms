import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const Preview = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [division, setDivision] = useState(null)

  /* ================= FETCH FROM LOCAL STORAGE ================= */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem('divisions')) || []

    const found = stored.find(
      (item) => String(item.id) === String(id)
    )

    setDivision(found || null)
  }, [id])

  /* ================= FIELD COMPONENT ================= */
  const ViewField = ({ label, value }) => (
    <CCol xs={12} md={4}>
      <div className="mb-3">
        <small className="text-muted">{label}</small>
        <div className="fw-semibold mt-1">{value ?? '-'}</div>
      </div>
    </CCol>
  )

  /* ================= DATE FORMAT ================= */
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '-'

  /* ================= PDF EXPORT ================= */
  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 10

    doc.setFontSize(14)
    doc.text('Division Details', 10, y)
    y += 10

    doc.setFontSize(10)

    Object.entries(division).forEach(([key, value]) => {
      doc.text(`${key} : ${value}`, 10, y)
      y += 8
    })

    doc.save('division-details.pdf')
  }

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([division])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Division')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'division-details.xlsx')
  }

  if (!division) {
    return (
      <CContainer className="py-4">
        <CCard>
          <CCardBody className="text-center">
            Division not found
          </CCardBody>
        </CCard>
      </CContainer>
    )
  }

  return (
    <CContainer fluid className="py-4">
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow border-0 rounded-4">
            <CCardBody className="p-4">

              {/* ================= HEADER ================= */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="fw-bold mb-1 text-primary">
                    {division.division_name || division.division}
                  </h3>
                  <div className="text-muted">
                    {division.division_code || '-'}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/division/edit/${division.id}`)
                    }
                  >
                    <CIcon icon={cilPencil} className="me-1" />
                    Edit
                  </CButton>

                  <CDropdown>
                    <CDropdownToggle color="primary" size="sm">
                      Export
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={handleExportPDF}>
                        Download PDF
                      </CDropdownItem>
                      <CDropdownItem onClick={handleExportExcel}>
                        Download Excel
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </div>

              {/* ================= DETAILS SECTION ================= */}
              <div className="p-4 rounded-3 bg-light">
                <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
                  Division Details
                </h5>

                <CRow>
                  <ViewField
                    label="Division Name"
                    value={division.division_name || division.division}
                  />

                  <ViewField
                    label="Division Code"
                    value={division.division_code}
                  />

                  <ViewField
                    label="Status"
                    value={division.is_active ? 'Active' : 'Inactive'}
                  />

                  {division.created_at && (
                    <ViewField
                      label="Created On"
                      value={formatDate(division.created_at)}
                    />
                  )}
                </CRow>
              </div>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Preview