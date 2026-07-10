import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilUser, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import './AppHeaderDropdown.css'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <CDropdown className="header-user-dropdown" variant="nav-item">
      <CDropdownToggle caret={true}>
        {user?.first_name || user?.name || 'User'} {user?.middle_name} {user?.last_name}
      </CDropdownToggle>

      <CDropdownMenu
        placement="bottom-end"
        className="p-0 shadow"
        style={{
          minWidth: '220px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}
      >
        <CDropdownItem
          style={{ padding: '12px 16px' }}
          onClick={() => navigate('/profile')}
        >
          <CIcon icon={cilUser} className="me-2" />
          My Profile
        </CDropdownItem>

        <CDropdownItem
          onClick={handleLogout}
          style={{
            padding: '12px 16px',
            color: '#dc2626',
            fontWeight: 600,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown