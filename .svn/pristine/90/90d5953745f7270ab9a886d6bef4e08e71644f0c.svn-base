import { CDropdown, CDropdownToggle, CDropdownMenu, CBadge, useColorModes } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilUser, cilWarning, cilDollar, cilBriefcase } from '@coreui/icons'

const notifications = [
  {
    id: 1,
    title: 'Approval Pending',
    message: '3 Leave Requests Awaiting Approval',
    time: '10 min ago',
    icon: cilWarning,
    color: '#F59E0B',
    unread: true,
  },
  {
    id: 2,
    title: 'Employee Onboarded',
    message: 'Employee EMP-1024 joined successfully',
    time: '25 min ago',
    icon: cilUser,
    color: '#22C55E',
    unread: true,
  },
  {
    id: 3,
    title: 'Payroll Generated',
    message: 'May 2026 Payroll Completed',
    time: '1 hour ago',
    icon: cilDollar,
    color: '#0EA5E9',
    unread: false,
  },
  {
    id: 4,
    title: 'Work Order Expiring',
    message: 'WO-104 expires in 3 days',
    time: '2 hours ago',
    icon: cilBriefcase,
    color: '#8B5CF6',
    unread: false,
  },
]

const NotificationDropdown = () => {
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const isDark = colorMode === 'dark'

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle
        caret={false}
        style={{
          border: 'none',
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        <div style={{ position: 'relative' }}>
          <CIcon icon={cilBell} size="lg" />

          {unreadCount > 0 && (
            <CBadge
              color="danger"
              shape="rounded-pill"
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                minWidth: '18px',
                height: '18px',
                fontSize: '10px',
              }}
            >
              {unreadCount}
            </CBadge>
          )}
        </div>
      </CDropdownToggle>

      <CDropdownMenu
        style={{
          width: '420px',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          border: isDark ? '1px solid #334155' : '1px solid #edf2f7',
          background: isDark ? '#111827' : '#ffffff',
          boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: isDark ? '#0f172a' : '#fafbff',
            borderBottom: isDark ? '1px solid #334155' : '1px solid #edf2f7',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: isDark ? '#f8fafc' : '#1e293b',
              }}
            >
              Notifications
            </div>

            <small
              style={{
                color: isDark ? '#94a3b8' : '#64748b',
              }}
            >
              {unreadCount} unread notifications
            </small>
          </div>

          <span
            style={{
              color: '#321FDB',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Mark All Read
          </span>
        </div>

        {/* Notification List */}
        <div
          style={{
            maxHeight: '420px',
            overflowY: 'auto',
          }}
        >
          {notifications.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px 18px',
                borderBottom: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
                background: isDark
                  ? item.unread
                    ? '#1f2937'
                    : '#111827'
                  : item.unread
                    ? '#f8f9ff'
                    : '#ffffff',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  borderRadius: '12px',
                  background: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={item.icon} size="lg" />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isDark ? '#f8fafc' : '#1e293b',
                    }}
                  >
                    {item.title}
                  </div>

                  <small
                    style={{
                      color: '#94a3b8',
                    }}
                  >
                    {item.time}
                  </small>
                </div>

                <div
                  style={{
                    fontSize: '13px',
                    color: isDark ? '#cbd5e1' : '#64748b',
                  }}
                >
                  {item.message}
                </div>
              </div>

              {item.unread && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#321FDB',
                    marginTop: '7px',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '15px',
            fontWeight: 600,
            color: '#321FDB',
            cursor: 'pointer',
            background: isDark ? '#0f172a' : '#fafbff',
            borderTop: isDark ? '1px solid #334155' : '1px solid #edf2f7',
          }}
        >
          View All Notifications →
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default NotificationDropdown
