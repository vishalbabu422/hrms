import PropTypes from 'prop-types'
import React from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as CoreUIIcons from '@coreui/icons'

const InFormLabel = (props) => {
  const { children, labelName, tabContentClassName, icon } = props
  const iconObj = CoreUIIcons[icon]
  return (
    <div className="in-form-label">
      <CNav variant="underline-border">
        <CNavItem>
          <CIcon icon={iconObj} className="me-2" />
          {labelName}
        </CNavItem>
      </CNav>
      <CTabPane className="p-3 preview" visible>
        {children}
      </CTabPane>
    </div>
  )
}

InFormLabel.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  tabContentClassName: PropTypes.string,
}

export default React.memo(InFormLabel)
