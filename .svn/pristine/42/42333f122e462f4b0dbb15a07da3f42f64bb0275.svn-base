import { CFormSelect } from '@coreui/react'

const MonthYearSelect = ({ month, setMonth, options = [] }) => {
  return (
    <CFormSelect value={month} onChange={(e) => setMonth(e.target.value)}>
      <option value="">Select Month</option>

      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </CFormSelect>
  )
}

export default MonthYearSelect