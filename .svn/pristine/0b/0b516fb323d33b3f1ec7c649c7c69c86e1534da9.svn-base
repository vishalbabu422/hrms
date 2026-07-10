import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const AppButton = ({
  label,
  icon,
  color = 'primary',
  size = 'sm',
  variant = undefined,
  onClick,
  className = '',
}) => {
  return (
    <CButton
      color={color}
      size={size}
      variant={variant}
      onClick={onClick}
      className={`d-flex align-items-center gap-2 ${className}`}
    >
      {icon && <CIcon icon={icon} />}
      {label}
    </CButton>
  )
}

export default AppButton
