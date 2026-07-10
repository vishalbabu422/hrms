import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  CContainer,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
} from '@coreui/react'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import ViewField from '../components/preview-field'
import api from '../../api/axios'

const Preview = () => {
  const { id } = useParams()

  const [company, setCompany] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)

        const response = await api.get(
          `/admin/company/${id}?models=Organization&modelFilter=%7B%7D`,
        )

        setCompany(response.data?.data || [])
      } catch (error) {
        console.error(error)
        toast.error('Failed to fetch company')
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [])

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
    doc.text('Company Details', 10, y)
    y += 10

    doc.setFontSize(10)
    Object.entries(company).forEach(([key, value]) => {
      doc.text(`${key} : ${value}`, 10, y)
      y += 8
    })

    doc.save('company-details.pdf')
  }

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([company])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Company')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'company-details.xlsx')
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
                  <h3 className="fw-bold mb-1 text-primary">{company.company_name}</h3>
                  <div className="text-muted">{company.company_code}</div>
                </div>

                <div className="d-flex gap-3">
                  <CDropdown>
                    <CDropdownToggle color="primary" size="sm">
                      Export
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={handleExportPDF}>Download PDF</CDropdownItem>
                      <CDropdownItem onClick={handleExportExcel}>Download Excel</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </div>

              {/* ================= DETAILS SECTION ================= */}
              <div className="p-4 rounded-3 bg-light">
                <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
                  Company Details
                </h5>

                <CRow>
                  <ViewField label="Organization" value={company?.Organization?.org_name} />
                  <ViewField label="Company Name" value={company.company_name} />
                  <ViewField label="Code" value={company.company_code} />

                  <ViewField label="Company Type" value={company.company_type} />
                  <ViewField
                    label="Incorporation Date"
                    value={formatDate(company.incorporation_date)}
                  />
                  <ViewField label="Status" value={company.is_active ? 'Active' : 'Inactive'} />

                  <ViewField label="Email" value={company.official_email} />
                  <ViewField label="Phone" value={company.official_phone} />
                  <ViewField label="Website" value={company.website} />
                  <ViewField label="City" value={company.city} />

                  <ViewField label="State" value={company.state} />
                  <ViewField label="Country" value={company.country} />
                  <ViewField label="Pincode" value={company.pincode} />

                  <CCol xs={12}>
                    <div className="mb-3">
                      <ViewField label="Address" value={company.address_line1} />
                    </div>
                  </CCol>
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
