import { CTableHeaderCell } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilArrowBottom } from '@coreui/icons'


const SortableHeaderCell = ({ label, sortKey, sort, onSort }) => {
  const isActive = sort.key === sortKey

  return (
    <CTableHeaderCell
      role="button"
      onClick={() => onSort(sortKey)}
    >
      {label}
      {isActive && <CIcon icon={sort.order === 'asc' ? cilArrowTop : cilArrowBottom} size="sm" />}
    </CTableHeaderCell>
  )
}

export default SortableHeaderCell
