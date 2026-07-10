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

  const data = {
    id,
    designation: 'Senior Consultant',
    agency_margin: '10%',
    unit_rate_including: '60000',
    unit_rate_excluding: '55000',
    agency_amount: '5000',

    nicsi_margin: '5%',
    nicsi_margin_amount: '2750',

    total_amount: '62750',

    gst_code: '998314',
    cgst_amount: '5647.50',
    sgst_amount: '5647.50',
    igst_amount: '0',

    total_gst_amount: '11295',
    final_amount: '74045',

    is_active: true,
  }

  const ViewField = ({ label, value }) => (
    <CCol xs={12} md={3}>
      <div className="small">
        <span className="text-muted">{label} : </span>
        <span className="fw-semibold">{value || '-'}</span>
      </div>
    </CCol>
  )

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text('Resource Rate Details', 10, 10)
    doc.save('resource-rate-details.pdf')
  }

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([data])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ResourceRate')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    saveAs(fileData, 'resource-rate-details.xlsx')
  }


 

  return (
    <CContainer fluid className="py-4 pb-5">
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow border-0 rounded-4">
            <CCardBody className="p-4">

              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="fw-bold mb-1 text-primary">
                    {data.designation}
                  </h3>
                  <div className="text-muted">
                    Unit Rate: ₹ {data.unit_rate_including}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/resource-rate/edit/${data.id}`)
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

              {/* RATE DETAILS */}
              <div className="mb-4 p-4 rounded-3 bg-light">
                <h5 className="fw-bold mb-3">Rate Details</h5>
                <CRow className="g-3">
                  <ViewField label="Designation" value={data.designation} />
                  <ViewField label="Agency Margin" value={data.agency_margin} />
                  <ViewField label="Unit Rate (Including A.M)" value={`₹ ${data.unit_rate_including}`} />
                  <ViewField label="Unit Rate (Excluding A.M)" value={`₹ ${data.unit_rate_excluding}`} />
                  <ViewField label="Agency Amount" value={`₹ ${data.agency_amount}`} />
                  <ViewField label="NICSI Margin" value={data.nicsi_margin} />
                  <ViewField label="NICSI Margin Amount" value={`₹ ${data.nicsi_margin_amount}`} />
                  <ViewField label="Total Amount" value={`₹ ${data.total_amount}`} />
                </CRow>
              </div>

              {/* GST DETAILS */}
              <CCard className="mb-4 shadow-sm border-0 rounded-3">
                <CCardBody>
                  <h5 className="fw-bold mb-3">GST Details</h5>
                  <CRow className="g-3">
                    <ViewField label="GST Code" value={data.gst_code} />
                    <ViewField label="CGST Amount" value={`₹ ${data.cgst_amount}`} />
                    <ViewField label="SGST Amount" value={`₹ ${data.sgst_amount}`} />
                    <ViewField label="IGST Amount" value={`₹ ${data.igst_amount}`} />
                    <ViewField label="Total GST Amount" value={`₹ ${data.total_gst_amount}`} />
                  </CRow>
                </CCardBody>
              </CCard>

              {/* FINAL SUMMARY */}
              <CCard className="shadow-sm border-0 rounded-3 bg-light">
                <CCardBody>
                  <h5 className="fw-bold">Final Amount</h5>
                  <h4 className="fw-bold text-success mt-2">
                    ₹ {data.final_amount}
                  </h4>

                  <div className="mt-3">
                    <span className="text-muted">Status : </span>
                    <span className="fw-semibold">
                      {data.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CCardBody>
              </CCard>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Preview