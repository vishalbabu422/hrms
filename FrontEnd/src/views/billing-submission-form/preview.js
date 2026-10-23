
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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
  CButton,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilArrowLeft } from '@coreui/icons'

import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'

import api from '../../api/axios'
import ViewField from '../components/preview-field'

const Preview = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [billingSubmission, setBillingSubmission] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ================= FETCH FROM BACKEND =================

  const fetchBillingSubmission = useCallback(async () => {
    try {
      setLoading(true)

      const response = await api.get(`/billing-submission/${id}`)
      const result = response.data

      const record =
        result?.data?.billingSubmission ??
        result?.data?.billing_submission ??
        result?.data?.billingSubmissionDetails ??
        result?.data

      if (
        !record ||
        Array.isArray(record) ||
        typeof record !== 'object' ||
        record.id === undefined
      ) {
        setBillingSubmission(null)
        toast.error('Billing Submission not found')
        return
      }

      setBillingSubmission(record)
    } catch (error) {
      console.error(
        'Fetch Billing Submission error:',
        error.response?.data || error,
      )

      setBillingSubmission(null)

      toast.error(
        error.response?.data?.message ||
          'Failed to fetch Billing Submission',
      )
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBillingSubmission()
  }, [fetchBillingSubmission])

  // ================= DELETE FROM BACKEND =================

  const handleDelete = async () => {
    if (!billingSubmission?.id) {
      toast.error('Billing Submission ID not found')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this Billing Submission?',
    )

    if (!confirmed) return

    try {
      setDeleting(true)

      await api.delete(`/billing-submission/${billingSubmission.id}`)

      toast.success('Billing Submission deleted successfully')

      navigate('/billing-submission-form')
    } catch (error) {
      console.error(
        'Delete Billing Submission error:',
        error.response?.data || error,
      )

      toast.error(
        error.response?.data?.message ||
          'Failed to delete Billing Submission',
      )
    } finally {
      setDeleting(false)
    }
  }

  // ================= FORMAT HELPERS =================

  const formatDate = (date) => {
    if (!date) return '-'

    const value = String(date).slice(0, 10)
    const parts = value.split('-')

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }

    return date
  }

  const formatAmount = (amount) => {
    if (amount === '' || amount === null || amount === undefined) {
      return '-'
    }

    return `₹ ${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const formatRate = (rate) => `${Number(rate || 0)}%`

  const getGSTCode = () =>
    billingSubmission?.gst_code_name ??
    billingSubmission?.gst_code ??
    billingSubmission?.gst_code_value ??
    billingSubmission?.gst_code_id ??
    billingSubmission?.gst_code_fk ??
    '-'

  const getWorkOrder = () =>
    billingSubmission?.work_order_no ??
    billingSubmission?.wo_id ??
    '-'

  const getPBG = () =>
    billingSubmission?.pbg_no ??
    billingSubmission?.pbg_id ??
    '-'

  const getIGST = () =>
    billingSubmission?.billing_igst_amt ??
    billingSubmission?.igst ??
    billingSubmission?.igst_amt

  const getCGST = () =>
    billingSubmission?.billing_cgst_amt ??
    billingSubmission?.cgst ??
    billingSubmission?.cgst_amt

  const getSGST = () =>
    billingSubmission?.billing_sgst_amt ??
    billingSubmission?.sgst ??
    billingSubmission?.sgst_amt

  const getTotal = () =>
    billingSubmission?.total_amount ??
    billingSubmission?.total_amt

  // ================= EXPORT PDF =================

  const handleExportPDF = () => {
    if (!billingSubmission) return

    try {
      const doc = new jsPDF()
      let y = 15

      doc.setFontSize(16)
      doc.text('Billing Submission Details', 10, y)

      y += 10
      doc.setFontSize(10)

      const details = [
        ['Invoice No', billingSubmission.invoice_no || '-'],
        ['Work Order', getWorkOrder()],
        ['Year', billingSubmission.year ?? '-'],
        ['Month', billingSubmission.month ?? '-'],
        ['Invoice Date', formatDate(billingSubmission.invoice_date)],
        ['Billing Amount', formatAmount(billingSubmission.billing_amount)],
        ['GST Code', getGSTCode()],
        [
          `IGST (${formatRate(billingSubmission.igst_rate)})`,
          formatAmount(getIGST()),
        ],
        [
          `CGST (${formatRate(billingSubmission.cgst_rate)})`,
          formatAmount(getCGST()),
        ],
        [
          `SGST (${formatRate(billingSubmission.sgst_rate)})`,
          formatAmount(getSGST()),
        ],
        ['Total Amount', formatAmount(getTotal())],
        ['PBG No', getPBG()],
        [
          'PBG Submission Date',
          formatDate(billingSubmission.pbg_submission_date),
        ],
      ]

      details.forEach(([label, value]) => {
        if (y > 275) {
          doc.addPage()
          y = 15
        }

        doc.text(`${label}: ${String(value ?? '-')}`, 10, y)
        y += 8
      })

      doc.save('billing-submission-details.pdf')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF')
    }
  }

  // ================= EXPORT EXCEL =================

  const handleExportExcel = () => {
    if (!billingSubmission) return

    try {
      const formattedData = {
        'Invoice No': billingSubmission.invoice_no || '-',
        'Work Order': getWorkOrder(),
        Year: billingSubmission.year ?? '',
        Month: billingSubmission.month ?? '',
        'Invoice Date': formatDate(billingSubmission.invoice_date),
        'Billing Amount': billingSubmission.billing_amount ?? '',
        'GST Code': getGSTCode(),
        'IGST Rate (%)': Number(billingSubmission.igst_rate || 0),
        IGST: getIGST() ?? '',
        'CGST Rate (%)': Number(billingSubmission.cgst_rate || 0),
        CGST: getCGST() ?? '',
        'SGST Rate (%)': Number(billingSubmission.sgst_rate || 0),
        SGST: getSGST() ?? '',
        'Total Amount': getTotal() ?? '',
        'PBG No': getPBG(),
        'PBG Submission Date': formatDate(
          billingSubmission.pbg_submission_date,
        ),
      }

      const worksheet = XLSX.utils.json_to_sheet([formattedData])
      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Billing Submission',
      )

      const buffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      const file = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      saveAs(file, 'billing-submission-details.xlsx')
    } catch (error) {
      console.error('Excel export error:', error)
      toast.error('Failed to export Excel')
    }
  }

  // ================= LOADING =================

  if (loading) {
    return (
      <CContainer fluid className="py-4">
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner />
        </div>
      </CContainer>
    )
  }

  // ================= NOT FOUND =================

  if (!billingSubmission) {
    return (
      <CContainer fluid className="py-4">
        <CCard className="shadow border-0 rounded-4">
          <CCardBody>
            <div className="text-center py-5 text-muted">
              Billing Submission not found
              <div className="mt-3">
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate('/billing-submission-form')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to List
                </CButton>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
    )
  }

  // ================= PREVIEW =================

  return (
    <CContainer fluid className="py-4">
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow border-0 rounded-4">
            <CCardBody className="p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="fw-bold mb-1 text-primary">
                    {billingSubmission.invoice_no || '-'}
                  </h3>

                  <div className="text-muted">
                    {getWorkOrder()}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate('/billing-submission-form')}
                  >
                    <CIcon icon={cilArrowLeft} className="me-1" />
                    Back
                  </CButton>

                  <CButton
                    color="danger"
                    variant="outline"
                    disabled={deleting}
                    onClick={handleDelete}
                    title="Delete Billing Submission"
                  >
                    {deleting ? (
                      <CSpinner size="sm" />
                    ) : (
                      <CIcon icon={cilTrash} />
                    )}
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

              {/* Billing Submission Details */}
              <div className="p-4 rounded-3 bg-light">
                <h5 className="fw-semibold text-dark mb-4 border-start border-4 border-primary ps-3">
                  Billing Submission Details
                </h5>

                <CRow>
                  <ViewField
                    label="Invoice No"
                    value={billingSubmission.invoice_no}
                  />

                  <ViewField
                    label="Work Order"
                    value={getWorkOrder()}
                  />

                  <ViewField
                    label="Year"
                    value={billingSubmission.year}
                  />

                  <ViewField
                    label="Month"
                    value={billingSubmission.month}
                  />

                  <ViewField
                    label="Invoice Date"
                    value={formatDate(billingSubmission.invoice_date)}
                  />

                  <ViewField
                    label="Billing Amount"
                    value={formatAmount(billingSubmission.billing_amount)}
                  />

                  <ViewField
                    label="GST Code"
                    value={getGSTCode()}
                  />

                  <ViewField
                    label={`IGST (${formatRate(billingSubmission.igst_rate)})`}
                    value={formatAmount(getIGST())}
                  />

                  <ViewField
                    label={`CGST (${formatRate(billingSubmission.cgst_rate)})`}
                    value={formatAmount(getCGST())}
                  />

                  <ViewField
                    label={`SGST (${formatRate(billingSubmission.sgst_rate)})`}
                    value={formatAmount(getSGST())}
                  />

                  <ViewField
                    label="Total Amount"
                    value={formatAmount(getTotal())}
                  />

                  <ViewField
                    label="PBG No"
                    value={getPBG()}
                  />

                  <ViewField
                    label="PBG Submission Date"
                    value={formatDate(
                      billingSubmission.pbg_submission_date,
                    )}
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
