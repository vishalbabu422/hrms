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
import { toast } from 'react-toastify'
import api from '../../api/axios'
import ViewField from '../components/preview-field'
import { formatDate } from '../../utils/dateUtils'

const Preview = () => {
  const { id } = useParams()
  const [pbg, setPbg] = useState(null)
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH PBG ================= */

  useEffect(() => {
    const fetchPBG = async () => {
      try {
        setLoading(true)

        const response = await api.get(`/pbg-master/${id}`)

        console.log('PBG PREVIEW RESPONSE:', response.data)

        const data = response.data?.data

        if (!data) {
          toast.error('PBG not found')
          return
        }

        const workorderPbgList = Array.isArray(data.workorderPbgList) ? data.workorderPbgList : []

        // Store Work Order mapping
        setWorkOrders(workorderPbgList)

        // PBG details are inside workorderPbgList[0].pbg
        setPbg(workorderPbgList[0]?.pbg || null)
      } catch (error) {
        console.error(error)

        toast.error(error.response?.data?.message || 'Failed to fetch PBG')
      } finally {
        setLoading(false)
      }
    }

    fetchPBG()
  }, [id])
  /* ================= WORK ORDER NAMES ================= */

  const workOrderNames =
    workOrders.length > 0
      ? workOrders
          .map((item) => {
            return (
              item?.work_order?.work_order_no ||
              item?.workOrder?.work_order_no ||
              item?.work_order_no ||
              item?.wo?.work_order_no ||
              `WO ID: ${item?.wo_id || '-'}`
            )
          })
          .join(', ')
      : '-'

  /* ================= PDF ================= */

  const handleExportPDF = () => {
    if (!pbg) return

    try {
      const doc = new jsPDF()

      let y = 15

      doc.setFontSize(16)
      doc.text('PBG Details', 10, y)

      y += 10

      doc.setFontSize(10)

      const details = [
        ['PBG No', pbg.pbg_no || '-'],

        ['Work Order', workOrderNames],

        ['Start Date', formatDate(pbg.start_date)],

        ['End Date', formatDate(pbg.end_date)],

        [
          'Amount',
          pbg.amount !== null && pbg.amount !== undefined && pbg.amount !== ''
            ? `₹ ${Number(pbg.amount).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`
            : '-',
        ],

        ['NICSI Registration No', pbg.nicsi_reg_no || '-'],

        ['NICSI Registration Date', formatDate(pbg.nicsi_reg_date)],

        [
          'Bank Charges',
          pbg.bank_charges !== null && pbg.bank_charges !== undefined && pbg.bank_charges !== ''
            ? `₹ ${Number(pbg.bank_charges).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`
            : '-',
        ],

        ['PBG Document', pbg.pbg_upload_path || '-'],

        ['Status', pbg.is_active ? 'Active' : 'Inactive'],
      ]

      details.forEach(([label, value]) => {
        doc.text(`${label} : ${value}`, 10, y)
        y += 8

        if (y > 280) {
          doc.addPage()
          y = 15
        }
      })

      doc.save('pbg-details.pdf')

      toast.success('PBG PDF exported successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to export PDF')
    }
  }

  /* ================= EXCEL ================= */

  const handleExportExcel = () => {
    if (!pbg) return

    try {
      const formattedData = {
        'PBG No': pbg.pbg_no || '-',

        'Work Order': workOrderNames,

        'Start Date': formatDate(pbg.start_date),

        'End Date': formatDate(pbg.end_date),

        Amount: pbg.amount !== null && pbg.amount !== undefined ? pbg.amount : '',

        'NICSI Registration No': pbg.nicsi_reg_no || '',

        'NICSI Registration Date': formatDate(pbg.nicsi_reg_date),

        'Bank Charges':
          pbg.bank_charges !== null && pbg.bank_charges !== undefined ? pbg.bank_charges : '',

        'PBG Document': pbg.pbg_upload_path || '',

        Status: pbg.is_active ? 'Active' : 'Inactive',
      }

      const worksheet = XLSX.utils.json_to_sheet([formattedData])

      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(workbook, worksheet, 'PBG')

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      const fileData = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      })

      saveAs(fileData, 'pbg-details.xlsx')

      toast.success('PBG Excel exported successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to export Excel')
    }
  }

  /* ================= DOWNLOAD DOCUMENT ================= */

  const handleDownloadDocument = async () => {
    try {
      const response = await api.get(`/pbg-master/${id}/download`, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/pdf',
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url
      link.download = pbg?.pbg_upload_path || 'pbg-document.pdf'

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)

      toast.error(error.response?.data?.message || 'Failed to download PBG document')
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <CContainer fluid className="py-4">
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner />
        </div>
      </CContainer>
    )
  }

  /* ================= NOT FOUND ================= */

  if (!pbg) {
    return (
      <CContainer fluid className="py-4">
        <CCard className="shadow border-0 rounded-4">
          <CCardBody>
            <div className="text-center py-5 text-muted">PBG not found</div>
          </CCardBody>
        </CCard>
      </CContainer>
    )
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid className="py-4">
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow border-0 rounded-4">
            <CCardBody className="p-4">
              {/* ================= HEADER ================= */}

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="fw-bold mb-1 text-primary">{pbg.pbg_no}</h3>

                  <div className="text-muted">{workOrderNames}</div>
                </div>

                <div className="d-flex gap-2">
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

              {/* ================= DETAILS ================= */}

              <div className="p-4 rounded-3 bg-light">
                <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
                  PBG Details
                </h5>

                <CRow>
                  <ViewField label="PBG No" value={pbg.pbg_no} />

                  <ViewField label="Work Order" value={workOrderNames} />

                  <ViewField label="Start Date" value={formatDate(pbg.start_date)} />

                  <ViewField label="End Date" value={formatDate(pbg.end_date)} />

                  <ViewField
                    label="Amount"
                    value={
                      pbg.amount !== null && pbg.amount !== undefined && pbg.amount !== ''
                        ? `₹ ${Number(pbg.amount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}`
                        : '-'
                    }
                  />

                  <ViewField label="NICSI Registration No" value={pbg.nicsi_reg_no || '-'} />

                  <ViewField
                    label="NICSI Registration Date"
                    value={formatDate(pbg.nicsi_reg_date)}
                  />

                  <ViewField
                    label="Bank Charges"
                    value={
                      pbg.bank_charges !== null &&
                      pbg.bank_charges !== undefined &&
                      pbg.bank_charges !== ''
                        ? `₹ ${Number(pbg.bank_charges).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}`
                        : '-'
                    }
                  />

                  <ViewField label="Status" value={pbg.is_active ? 'Active' : 'Inactive'} />

                  {/* DOCUMENT */}

                  <CCol xs={12}>
                    <div className="mb-3">
                      <ViewField label="PBG Document" value={pbg.pbg_upload_path || '-'} />

                      {pbg.pbg_upload_path && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary mt-1"
                          onClick={handleDownloadDocument}
                        >
                          Download Document
                        </button>
                      )}
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
