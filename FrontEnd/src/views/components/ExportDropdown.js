import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

const ExportDropdown = ({
  onExportPDF,
  onExportExcel,
  color = 'primary',
  size = 'sm',
  label = 'Export',
  icon = true,
}) => {
  return (
    <CDropdown>
      <CDropdownToggle color={color} size={size} className="d-flex align-items-center gap-2">
        {icon && <CIcon icon={cilCloudDownload} />}
        {label}
      </CDropdownToggle>

      <CDropdownMenu>
        {onExportPDF && (
          <CDropdownItem onClick={onExportPDF}>
            Download PDF
          </CDropdownItem>
        )}

        {onExportExcel && (
          <CDropdownItem onClick={onExportExcel}>
            Download Excel
          </CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default ExportDropdown
