import { CTableRow, CTableDataCell } from '@coreui/react'

const TableEmptyState = ({ colSpan, message = 'No records found', className = 'text-center' }) => {
  return (
    <CTableRow>
      <CTableDataCell colSpan={colSpan} className={className}>
        <i>{message}</i>
      </CTableDataCell>
    </CTableRow>
  )
}

export default TableEmptyState
