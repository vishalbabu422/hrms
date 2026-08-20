import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatDate } from '../../utils/dateUtils'

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
  CTableRow,
  CSpinner,
} from '@coreui/react'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import ViewField from '../components/preview-field'
import api from '../../api/axios'

const GstCodePreview = () => {
  const { id } = useParams()

  const [gstCode, setGstCode] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchGstCode = async () => {
      try {
        setLoading(true)

        const response = await api.get(`/admin/gst-code/${id}`)
        setGstCode(response.data?.data || [])
      } catch (error) {
        console.error(error)
        toast.error('Failed to fetch GST Code')
      } finally {
        setLoading(false)
      }
    }

    fetchGstCode()
  }, [])

  /* ---------- PDF Export ---------- */
  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 10

    doc.setFontSize(14)
    doc.text('GST Code Details', 10, y)
    y += 10

    doc.setFontSize(10)
    Object.entries(gstCode).forEach(([key, value]) => {
      doc.text(`${key} : ${value}`, 10, y)
      y += 8
    })

    doc.save('gst-code-details.pdf')
  }

  /* ---------- Excel Export ---------- */
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([gstCode])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'GST Code')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'gst-code-details.xlsx')
  }

  return (
    <CContainer fluid className="py-4">
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow border-0 rounded-4">
            {loading ? (
              <CTableRow>
                <div className="d-flex justify-content-center align-items-center py-5">
                  <CSpinner color="primary" />
                </div>
              </CTableRow>
            ) : (
              <CCardBody className="p-4">
                {/* ---------- Header ---------- */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="fw-bold mb-1 text-primary">{gstCode.code}</h3>
                    <div className="text-muted">{gstCode.code_type}</div>
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

                {/* ---------- GST Code Details ---------- */}
                <div className="p-4 rounded-3 bg-light">
                  <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
                    GST Code Details
                  </h5>

                  <CRow>
                    <ViewField label="Code Type" value={gstCode.code_type} />
                    <ViewField label="Code" value={gstCode.code} />
                    <ViewField label="Description" value={gstCode.description} />

                    <ViewField label="GST Rate (%)" value={`${gstCode.gst_rate}%`} />
                    <ViewField label="CGST Rate (%)" value={`${gstCode.cgst_rate}%`} />
                    <ViewField label="SGST Rate (%)" value={`${gstCode.sgst_rate}%`} />

                    <ViewField label="IGST Rate (%)" value={`${gstCode.igst_rate}%`} />
                    <ViewField label="CESS Rate (%)" value={`${gstCode.cess_rate}%`} />
                    <ViewField label="OTHER Rate (%)" value={`${gstCode.other_rate}%`} />

                    <ViewField label="Effective From" value={formatDate(gstCode.effective_from)} />

                    <ViewField label="Effective To" value={formatDate(gstCode.effective_to)} />
                    <ViewField label="Status" value={gstCode.is_active ? 'Active' : 'Inactive'} />
                  </CRow>
                </div>
              </CCardBody>
            )}
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default GstCodePreview
