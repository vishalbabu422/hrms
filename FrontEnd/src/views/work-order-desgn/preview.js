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

const WorkOrderPreview = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const workorder = {
    id,
    work_order_no: 'WO-2026-001',
    date: '18-02-2026',
    project_no: 'PRJ-1001',
    pi_no: 'PI-7788',
    project_name: 'Hospital IT Upgrade Project',
    issued_to_name: 'Tech Solutions Pvt Ltd',
    issued_to_address: 'Plot No. 45, Sector 18, Gurugram, Haryana - 122015',
    issued_to_email: 'info@techsolutions.com',
    issued_to_phone: '+91-9876543210',
    contact_person_name: 'Rahul Sharma',
    contact_person_email: 'rahul.sharma@techsolutions.com',
    contact_person_phone: '+91-9999999999',
  }

  /* ================= SECTION COMPONENT ================= */
  const Section = ({ title, children }) => (
    <div className="mb-4 p-4 rounded-3 shadow-sm bg-light">
      <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
        {title}
      </h5>
      <CRow className="g-4">{children}</CRow>
    </div>
  )

  /* ================= FIELD COMPONENT ================= */
  const ViewField = ({ label, value }) => (
    <CCol xs={12} md={6}>
      <div className="mb-3">
        <small className="text-muted">{label}</small>
        <div className="fw-semibold mt-1">{value || '-'}</div>
      </div>
    </CCol>
  )

  /* ================= PDF EXPORT ================= */
  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 10

    doc.setFontSize(14)
    doc.text('Work Order Details', 10, y)
    y += 10

    doc.setFontSize(10)
    Object.entries(workorder).forEach(([key, value]) => {
      doc.text(`${key} : ${value}`, 10, y)
      y += 8
    })

    doc.save('workorder-details.pdf')
  }

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([workorder])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'WorkOrder')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'workorder-details.xlsx')
  }

  return (
    <CContainer fluid className="py-4 pb-5">
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow border-0 rounded-4 mb-4">
            <CCardBody className="p-4">

              {/* ================= HEADER ================= */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="fw-bold mb-1 text-primary">
                    {workorder.work_order_no}
                  </h3>
                  <div className="text-muted">
                    {workorder.project_name}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/work-order/edit/${workorder.id}`)
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

              {/* ================= BASIC DETAILS ================= */}
              <Section title="Basic Details">
                <ViewField label="Work Order No" value={workorder.work_order_no} />
                <ViewField label="Date" value={workorder.date} />
                <ViewField label="Project No" value={workorder.project_no} />
                <ViewField label="PI No" value={workorder.pi_no} />
                <ViewField label="Project Name" value={workorder.project_name} />
              </Section>

              {/* ================= ISSUED TO ================= */}
              <Section title="Issued To">
                <ViewField label="Name" value={workorder.issued_to_name} />
                <ViewField label="Address" value={workorder.issued_to_address} />
                <ViewField label="Email" value={workorder.issued_to_email} />
                <ViewField label="Phone" value={workorder.issued_to_phone} />
              </Section>

              {/* ================= CONTACT PERSON ================= */}
              <Section title="Contact Person">
                <ViewField label="Name" value={workorder.contact_person_name} />
                <ViewField label="Email" value={workorder.contact_person_email} />
                <ViewField label="Phone" value={workorder.contact_person_phone} />
              </Section>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default WorkOrderPreview
