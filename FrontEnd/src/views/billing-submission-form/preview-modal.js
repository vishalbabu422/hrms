
import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'

const formatAmount = (value) =>
  Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DetailItem = ({ label, value }) => (
  <div className="h-100" style={{ minWidth: 0 }}>
    <div
      className="text-secondary mb-1"
      style={{
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>

    <div
      className="text-dark"
      style={{
        fontSize: '14px',
        fontWeight: 500,
        overflowWrap: 'anywhere',
        wordBreak: 'normal',
        whiteSpace: 'normal',
        lineHeight: 1.5,
      }}
    >
      {value === null || value === undefined || value === '' ? '-' : value}
    </div>
  </div>
)
const GSTCard = ({ label, rate, amount }) => (
  <div
    className="h-100 rounded-3 p-3"
    style={{
      background: '#f8f9fc',
      border: '1px solid #e7eaf0',
    }}
  >
    <div
      className="text-secondary mb-2"
      style={{
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {label} ({Number(rate || 0)}%)
    </div>

    <div
      className="text-dark"
      style={{
        fontSize: '16px',
        fontWeight: 600,
        overflowWrap: 'anywhere',
      }}
    >
      ₹ {formatAmount(amount)}
    </div>
  </div>
)

const PreviewModal = ({
  visible,
  onClose,
  onSave,
  formData = {},
  gstCodeList = [],
  mode = 'add',
}) => {
  const gstCode =
    gstCodeList.find(
      (item) => String(item.id) === String(formData.gst_code_fk),
    )?.code ||
    formData.gst_code ||
    '-'

  const monthLabel =
    months[Number(formData.month) - 1] ||
    formData.month ||
    '-'

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="lg"
      alignment="center"
      backdrop="static"
      scrollable
    >
      {/* HEADER */}
      <CModalHeader
        closeButton
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e9edf3',
        }}
      >
        <div>
          <CModalTitle
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#24324a',
            }}
          >
            Billing Submission Preview
          </CModalTitle>

          <div
            className="text-secondary mt-1"
            style={{ fontSize: '13px' }}
          >
            Review the details before {mode === 'edit' ? 'updating' : 'saving'}.
          </div>
        </div>
      </CModalHeader>

      <CModalBody style={{ padding: '24px' }}>
        {/* INVOICE DETAILS */}
        <section className="mb-4">
          <div
            className="d-flex align-items-center mb-3"
            style={{
              gap: '10px',
              borderBottom: '1px solid #e9edf3',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '22px',
                background: '#5856d6',
                borderRadius: '4px',
              }}
            />

            <h6
              className="mb-0"
              style={{ fontWeight: 700, color: '#24324a' }}
            >
              Invoice Details
            </h6>
          </div>

          <CRow className="g-4">
  {/* FIRST ROW: YEAR, MONTH, WORK ORDER */}
  <CCol xs={12} md={4}>
    <DetailItem label="Year" value={formData.year} />
  </CCol>

  <CCol xs={12} md={4}>
    <DetailItem label="Month" value={monthLabel} />
  </CCol>

  <CCol xs={12} md={4}>
    <DetailItem
      label="Work Order Number"
      value={formData.work_order_no}
    />
  </CCol>

  {/* SECOND ROW: INVOICE NUMBER, INVOICE DATE, BILLING AMOUNT, GST CODE */}
  <CCol xs={12} md={3}>
    <DetailItem
      label="Invoice Number"
      value={formData.invoice_no}
    />
  </CCol>

  <CCol xs={12} md={3}>
    <DetailItem
      label="Invoice Date"
      value={formData.invoice_date}
    />
  </CCol>

  <CCol xs={12} md={3}>
    <DetailItem
      label="Billing Amount"
      value={`₹ ${formatAmount(formData.billing_amount)}`}
    />
  </CCol>

  <CCol xs={12} md={3}>
    <DetailItem
      label="GST Code"
      value={gstCode}
    />
  </CCol>
</CRow>
        </section>

        {/* GST BREAKDOWN */}
        <section className="mb-4">
          <div
            className="d-flex align-items-center mb-3"
            style={{
              gap: '10px',
              borderBottom: '1px solid #e9edf3',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '22px',
                background: '#198754',
                borderRadius: '4px',
              }}
            />

            <h6
              className="mb-0"
              style={{ fontWeight: 700, color: '#24324a' }}
            >
              GST Breakdown
            </h6>
          </div>

          <CRow className="g-3">
            <CCol xs={12} sm={4}>
              <GSTCard
                label="IGST"
                rate={formData.igst_rate}
                amount={formData.igst}
              />
            </CCol>

            <CCol xs={12} sm={4}>
              <GSTCard
                label="CGST"
                rate={formData.cgst_rate}
                amount={formData.cgst}
              />
            </CCol>

            <CCol xs={12} sm={4}>
              <GSTCard
                label="SGST"
                rate={formData.sgst_rate}
                amount={formData.sgst}
              />
            </CCol>
          </CRow>

          {/* TOTAL AMOUNT */}
          <div
            className="d-flex justify-content-between align-items-center mt-3 rounded-3"
            style={{
              padding: '18px 20px',
              background: '#f0efff',
              border: '1px solid #dedcff',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  color: '#4542a8',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}
              >
                Total Amount
              </div>

              <div
                className="text-secondary mt-1"
                style={{ fontSize: '12px' }}
              >
                Including applicable GST
              </div>
            </div>

            <div
              style={{
                color: '#514fc5',
                fontSize: '21px',
                fontWeight: 700,
                textAlign: 'right',
                overflowWrap: 'anywhere',
              }}
            >
              ₹ {formatAmount(formData.total_amount)}
            </div>
          </div>
        </section>

        {/* PBG DETAILS */}
        <section>
          <div
            className="d-flex align-items-center mb-3"
            style={{
              gap: '10px',
              borderBottom: '1px solid #e9edf3',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '22px',
                background: '#d97706',
                borderRadius: '4px',
              }}
            />

            <h6
              className="mb-0"
              style={{ fontWeight: 700, color: '#24324a' }}
            >
              PBG Details
            </h6>
          </div>

          <div
            className="rounded-3 p-3"
            style={{
              background: '#fffbf2',
              border: '1px solid #f3e8cc',
            }}
          >
            <CRow className="g-3">
              <CCol xs={12} sm={6}>
                <DetailItem
                  label="PBG Number"
                  value={formData.pbg_no}
                />
              </CCol>

              <CCol xs={12} sm={6}>
                <DetailItem
                  label="PBG Submission Date"
                  value={formData.pbg_submission_date}
                />
              </CCol>
            </CRow>
          </div>
        </section>
      </CModalBody>

      {/* FOOTER */}
      <CModalFooter
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #e9edf3',
          gap: '8px',
        }}
      >
        <CButton
          color="secondary"
          variant="outline"
          onClick={onClose}
        >
          Back to Edit
        </CButton>

        <CButton color="primary" onClick={() => onSave?.()}>
          {mode === 'edit' ? 'Update' : 'Save'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default PreviewModal
