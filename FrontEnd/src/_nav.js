import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCalculator,
  cilSpreadsheet,
  cilBriefcase,
  cilBarcode,
  cilWallet,
  cilPeople,
  cilIndustry,
  cilBuilding,
  cilUser,
  cilLayers,
  cilApps,
  cilChart,
  cilLockLocked,
  cilChartLine,
  cilCalendar,
  cilMoney,
  cilSettings,
  cilNotes,
  cilApplications,
  cilSpeedometer,
  cilAddressBook,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // No permission for dashboards for now
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'User Dashboard',
    to: '/userdashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'My Details',
    to: '/mydetails',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Organization',
    to: '/organization',
    permission: 'ORGANIZATION.MENU',
    icon: <CIcon icon={cilIndustry} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'GST Codes',
    to: '/gst-code',
    permission: 'GST.MENU',
    icon: <CIcon icon={cilBarcode} className="nav-icon" />,
  },

  // ================= Empanelment =================

  {
    component: CNavTitle,
    name: 'Empanelment',
    section: 'empanelment',
  },

  {
    component: CNavItem,
    name: 'Empanelment',
    to: '/empanelment',
    permission: 'EMPANELMENT.MENU',
    section: 'empanelment',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Company',
    to: '/company',
    permission: 'COMPANY.MENU',
    section: 'empanelment',
    icon: <CIcon icon={cilBuilding} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Vendor',
    to: '/vendor',
    permission: 'VENDOR.MENU',
    section: 'empanelment',
    icon: <CIcon icon={cilUser} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Empl Designation',
    to: '/designation',
    permission: 'EMPL_DES.MENU',
    section: 'empanelment',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Resource Rate',
    to: '/rate',
    permission: 'RESO_RATE.MENU',
    section: 'empanelment',
    icon: <CIcon icon={cilWallet} className="nav-icon" />,
  },

  // ================= Work Order =================

  {
    component: CNavTitle,
    name: 'Work Order',
    section: 'work-order',
  },

  {
    component: CNavItem,
    name: 'Work Order',
    to: '/work-order',
    permission: 'WORKORDER.MENU',
    section: 'work-order',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Leave Record',
    to: '/leave-record',
    permission: 'LEAVE.MENU',
    section: 'work-order',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'MPR',
    to: '/mpr',
    permission: 'MPR.MENU',
    section: 'work-order',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },

  // ================= HRM =================

  {
    component: CNavTitle,
    name: 'HRM',
    section: 'hrm',
  },

  {
    component: CNavItem,
    name: 'Employees',
    to: '/hrm',
    permission: 'EMPLOYEE.MENU',
    section: 'hrm',
    icon: <CIcon icon={cilPeople} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Designations',
    to: '/employeedesignation',
    permission: 'EMPLOYEE_DES.MENU',
    section: 'hrm',
    icon: <CIcon icon={cilLayers} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Divisions',
    to: '/division',
    permission: 'EMPLOYEE_DIV.MENU',
    section: 'hrm',
    icon: <CIcon icon={cilApps} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Examinations',
    to: '/examination',
    permission: 'EMPLOYEE_EXA.MENU',
    section: 'hrm',
    icon: <CIcon icon={cilChart} className="nav-icon" />,
  },

  // ================= Salary =================

  {
    component: CNavTitle,
    name: 'Salary',
    section: 'salary',
  },

  {
    component: CNavItem,
    name: 'Salary Component',
    to: '/salary-component',
    permission: 'EMP_SALARY.MENU',
    section: 'salary',
    icon: <CIcon icon={cilMoney} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Salary Structure',
    to: '/salary-structure',
    permission: 'EMP_SALARY.MENU',
    section: 'salary',
    icon: <CIcon icon={cilSettings} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Employee Salary Register',
    to: '/emp-salary-register',
    permission: 'EMP_SALARY.MENU',
    section: 'salary',
    icon: <CIcon icon={cilNotes} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Salary Add-on',
    to: '/salary-addon',
    permission: 'EMP_SALARY.MENU',
    section: 'salary',
    icon: <CIcon icon={cilNotes} className="nav-icon" />,
  },

  // ================= Roles and Permissions =================

  {
    component: CNavTitle,
    name: 'Roles and Permissions',
    section: 'roles-permissions',
  },

  {
    component: CNavItem,
    name: 'Roles and Permissions',
    to: '/roles-and-permissions',
    permission: 'ROLE_PER.MENU',
    section: 'roles-permissions',
    icon: <CIcon icon={cilLockLocked} className="nav-icon" />,
  },
]

export default _nav