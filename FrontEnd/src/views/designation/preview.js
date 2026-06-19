import React from 'react'
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

  /* ================= DUMMY DATA ================= */
  const data = {
    id,
    type: 'Permanent',
    empanelment: 'EMP-2026-001',
    designation: 'Senior Consultant',
    qualification: 'MBA, B.Tech',
    experience: '5 Years',
    is_active: true,
  }

  /* ================= FIELD COMPONENT ================= */
  const ViewField = ({ label, value }) => (
    <CCol xs={12} md={4}>
      <div className="mb-3">
        <small className="text-muted">{label}</small>
        <div className="fw-semibold mt-1">{value ?? '-'}</div>
      </div>
    </CCol>
  )

  /* ================= PDF EXPORT ================= */
  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 10

    doc.setFontSize(14)
    doc.text('Designation Details', 10, y)
    y += 10

    doc.setFontSize(10)
    Object.entries(data).forEach(([key, value]) => {
      doc.text(`${key} : ${value}`, 10, y)
      y += 8
    })

    doc.save('designation-details.pdf')
  }

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([data])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Details')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'designation-details.xlsx')
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
                    {data.designation}
                  </h3>
                  <div className="text-muted">{data.type}</div>
                </div>

                <div className="d-flex gap-3">
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => navigate(`/your-route/edit/${data.id}`)}
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

              {/* ================= DETAILS ================= */}
              <div className="p-4 rounded-3 bg-light">
                <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
                  Details
                </h5>

                <CRow>
                  <ViewField label="Type" value={data.type} />
                  <ViewField label="Empanelment" value={data.empanelment} />
                  <ViewField label="Designation" value={data.designation} />

                  <ViewField label="Qualification" value={data.qualification} />
                  <ViewField label="Experience" value={data.experience} />
                  <ViewField
                    label="Status"
                    value={data.is_active ? 'Active' : 'Inactive'}
                  />
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