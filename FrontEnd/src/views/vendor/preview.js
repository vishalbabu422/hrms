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
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const VendorPreview = () => {
  const navigate = useNavigate()

  const vendor = {
    id: 1,
    organization: 'ABC Healthcare Pvt Ltd',
    empanelment_id: 'EMP-2026-001',
    vendor_name: 'Tech Solutions Pvt Ltd',
    vendor_code: 'TSPL001',
    vendor_type: 'Private Limited',
    contact_person: 'Rahul Sharma',
    contact_email: 'rahul.sharma@techsolutions.com',
    contact_phone: '+91-9876543210',
    website: 'https://www.techsolutions.com',
    address_line1: 'Plot No. 45, Sector 18',
    address_line2: 'Near Metro Station',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    pincode: '122015',
    bank_name: 'HDFC Bank',
    account_number: '50200012345678',
    ifsc_code: 'HDFC0001234',
    branch_name: 'Gurugram Main Branch',
    onboarding_date: '18-02-2026',
    status: 'Active',
  }




/* ================= SECTION COMPONENT ================= */

const Section = ({ title, children }) => (
  <div className="mb-4 p-4 rounded-3 shadow-sm bg-light">
    <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
      {title}
    </h5>
    <CRow className="g-4">
      {children}
    </CRow>
  </div>
)

/* ================= FIELD COMPONENT ================= */

const ViewField = ({ label, value }) => (
  <CCol xs={12} md={6}>
    <div className="mb-3">
      <small className="text-muted">{label}</small>
      <div className="fw-semibold mt-1">
        {value || '-'}
      </div>
    </div>
  </CCol>
)



  /* ================= PDF EXPORT ================= */
  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 10

    doc.setFontSize(14)
    doc.text('Vendor Details', 10, y)
    y += 10

    doc.setFontSize(10)

    Object.entries(vendor).forEach(([key, value]) => {
      doc.text(`${key} : ${value}`, 10, y)
      y += 8
    })

    doc.save('vendor-details.pdf')
  }

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([vendor])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendor')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'vendor-details.xlsx')
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
                    {vendor.vendor_name}
                  </h3>
                  <div className="text-muted">{vendor.vendor_code}</div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => navigate(`/vendor/edit/${vendor.id}`)}
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
                <ViewField label="Organization" value={vendor.organization} />
                <ViewField label="Empanelment ID" value={vendor.empanelment_id} />
                <ViewField label="Vendor Type" value={vendor.vendor_type} />
                <ViewField label="Onboarding Date" value={vendor.onboarding_date} />
                <ViewField label="Status" value={vendor.status} />
              </Section>

              {/* ================= CONTACT DETAILS ================= */}
              <Section title="Contact Details">
                <ViewField label="Contact Person" value={vendor.contact_person} />
                <ViewField label="Contact Email" value={vendor.contact_email} />
                <ViewField label="Contact Phone" value={vendor.contact_phone} />
                <ViewField label="Website" value={vendor.website} />
              </Section>

              {/* ================= ADDRESS DETAILS ================= */}
              <Section title="Address Details">
                <ViewField label="Address Line 1" value={vendor.address_line1} />
                <ViewField label="Address Line 2" value={vendor.address_line2} />
                <ViewField label="City" value={vendor.city} />
                <ViewField label="State" value={vendor.state} />
                <ViewField label="Country" value={vendor.country} />
                <ViewField label="Pincode" value={vendor.pincode} />
              </Section>

              {/* ================= BANK DETAILS ================= */}
              <Section title="Bank Details">
                <ViewField label="Bank Name" value={vendor.bank_name} />
                <ViewField label="Account Number" value={vendor.account_number} />
                <ViewField label="IFSC Code" value={vendor.ifsc_code} />
                <ViewField label="Branch Name" value={vendor.branch_name} />
              </Section>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default VendorPreview

