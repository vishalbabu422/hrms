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
  const exam = {
    id,
    exam_name: 'Civil Services Examination',
    exam_date: '2026-02-10',
    marks_obtained: 425,
    is_active: true,
    created_at: '2026-02-15',
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
    let y = 15

    doc.setFontSize(16)
    doc.text('Exam Details', 10, y)
    y += 10

    doc.setFontSize(11)

    const fields = [
      ['Exam Name', exam.exam_name],
      ['Exam Date', formatDate(exam.exam_date)],
      ['Marks Obtained', exam.marks_obtained],
      ['Status', exam.is_active ? 'Active' : 'Inactive'],
      ['Created On', formatDate(exam.created_at)],
    ]

    fields.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 10, y)
      y += 8
    })

    doc.save('exam-details.pdf')
  }

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = () => {
    const formattedData = [
      {
        'Exam Name': exam.exam_name,
        'Exam Date': formatDate(exam.exam_date),
        'Marks Obtained': exam.marks_obtained,
        Status: exam.is_active ? 'Active' : 'Inactive',
        'Created On': formatDate(exam.created_at),
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exam')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'exam-details.xlsx')
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
                    {exam.exam_name}
                  </h3>
                  <div className="text-muted">
                    Exam ID: {exam.id}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/examination/edit/${exam.id}`)
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
                  Exam Details
                </h5>

                <CRow>
                  <ViewField label="Exam Name" value={exam.exam_name} />
                  <ViewField label="Exam Date" value={formatDate(exam.exam_date)} />
                  <ViewField label="Marks Obtained" value={exam.marks_obtained} />
                  <ViewField
                    label="Status"
                    value={exam.is_active ? 'Active' : 'Inactive'}
                  />
                  <ViewField
                    label="Created On"
                    value={formatDate(exam.created_at)}
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