import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'

import { useState } from 'react'

import MonthlyRegister from './MonthlyRegister'
import FinancialRegister from './FinancialRegister'

const SalaryRegister = () => {
  const [activeTab, setActiveTab] = useState('monthly')

  return (
    <CCard>
      <CCardBody>
        <h5 className="mb-3">Salary Register</h5>

        {/* TABS */}
        <CNav variant="tabs" className="mb-3">
          <CNavItem>
            <CNavLink
              active={activeTab === 'monthly'}
              onClick={() => setActiveTab('monthly')}
              style={{ cursor: 'pointer' }}
            >
              Monthly
            </CNavLink>
          </CNavItem>

          <CNavItem>
            <CNavLink
              active={activeTab === 'financial'}
              onClick={() => setActiveTab('financial')}
              style={{ cursor: 'pointer' }}
            >
              Financial Year
            </CNavLink>
          </CNavItem>
        </CNav>

        {/* CONTENT */}
        {activeTab === 'monthly' && (
          <MonthlyRegister />
        )}

        {activeTab === 'financial' && (
          <FinancialRegister />
        )}
      </CCardBody>
    </CCard>
  )
}

export default SalaryRegister