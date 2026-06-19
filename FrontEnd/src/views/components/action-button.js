import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'

const ActionButton = ({ color, icon, onClick, size = 'sm' }) => (
  <CButton size={size} color={color} variant="ghost" onClick={onClick} className="rounded-circle">
    <CIcon icon={icon} />
  </CButton>
)

export default ActionButton
