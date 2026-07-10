import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// UserDashboard

const UserDashboard = React.lazy(() => import('./views/userdashboard/userdashboard'))

//----------------------------------------------------------//

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

/* Work Order */
const WorkOrderIndex = React.lazy(() => import('./views/work-order/index'))
const WorkOrderAdd = React.lazy(() => import('./views/work-order/add'))
const WorkOrderEdit = React.lazy(() => import('./views/work-order/edit'))
const WorkOrderPreview = React.lazy(() => import('./views/work-order/preview'))
// const WorkOrderDesignation = React.lazy(() => import('./views/work-order/designations'))
const WorkOrderEmpDeployment = React.lazy(() => import('./views/work-order/emp-deployment'))
const WorkOrderDesignation = React.lazy(() => import('./views/work-order/designations'))
const WorkOrderMilestones = React.lazy(() => import('./views/work-order/milestones'))

/* leave record */
const leaverecord = React.lazy(() => import('./views/leave-record/leave'))

/* MPR */
const mpr = React.lazy(() => import('./views/mpr/mpr'))

/* Category Empanelment */
const CatEmpIndex = React.lazy(() => import('./views/category-empanelment/index'))
const CatEmpAdd = React.lazy(() => import('./views/category-empanelment/add'))
const CatEmpEdit = React.lazy(() => import('./views/category-empanelment/edit'))
const CatEmpPreview = React.lazy(() => import('./views/category-empanelment/preview'))

/* Designation */
const DesIndex = React.lazy(() => import('./views/designation/index'))
const DesAdd = React.lazy(() => import('./views/designation/add'))
const DesEdit = React.lazy(() => import('./views/designation/edit'))
const Despreview = React.lazy(() => import('./views/designation/preview'))

/* HSN/SAC Code */
const GstCodeIndex = React.lazy(() => import('./views/gst-code/index'))
const GstCodeAdd = React.lazy(() => import('./views/gst-code/add'))
const GstCodeEdit = React.lazy(() => import('./views/gst-code/edit'))
const GstCodePreview = React.lazy(() => import('./views/gst-code/preview'))

/* Resource Rate */
const resrateIndex = React.lazy(() => import('./views/resource-rate/index'))
const resrateAdd = React.lazy(() => import('./views/resource-rate/add'))
const resrateEdit = React.lazy(() => import('./views/resource-rate/edit'))
const resratepreview = React.lazy(() => import('./views/resource-rate/preview'))

/* HRM */
const hrmIndex = React.lazy(() => import('./views/hrm/index'))
const hrmAdd = React.lazy(() => import('./views/hrm/add'))
const hrmMore = React.lazy(() => import('./views/hrm/more-details/index'))
const hrmPreview = React.lazy(() => import('./views/hrm/preview'))

/* Salary */
const salaryComponentIndex = React.lazy(() => import('./views/salary/index'))
const salaryComponentAdd = React.lazy(() => import('./views/salary/add'))
const salaryComponentEdit = React.lazy(() => import('./views/salary/edit'))

/* Salary Structure */
const salaryStructureIndex = React.lazy(() => import('./views/salary-structure/index'))
const salaryStructureAdd = React.lazy(() => import('./views/salary-structure/add'))
const salaryStructureEdit = React.lazy(() => import('./views/salary-structure/edit'))

/* Employee Salary Structure */
const empSalaryStructureIndex = React.lazy(() => import('./views/emp-salary-structure/index'))
const empSalaryStructureAdd = React.lazy(() => import('./views/emp-salary-structure/add'))
const empSalaryStructureEdit = React.lazy(() => import('./views/emp-salary-structure/edit'))

/* Employee Salary Register */
const salaryRegister = React.lazy(() => import('./views/emp-salary-register/salary-register'))

/* Salary Addon */
const salaryAddonIndex = React.lazy(() => import('./views/salary-addon'))

const salaryAddonAdd = React.lazy(() => import('./views/salary-addon/add'))

const salaryAddonEdit = React.lazy(() => import('./views/salary-addon/edit'))

const SalaryAddonView = React.lazy(() => import('./views/salary-addon/SalaryAddonView'))

const employeeAddon = React.lazy(() => import('./views/salary-addon/employeeaddon'))

/* Profile */

const Profile = React.lazy(() => import('./views/profile/profile'))

/* Employee Designation */
const employeedesignationIndex = React.lazy(() => import('./views/employeedesignation/index'))
const employeedesignationAdd = React.lazy(() => import('./views/employeedesignation/add'))
const employeedesignationEdit = React.lazy(() => import('./views/employeedesignation/edit'))
const employeedesignationPreview = React.lazy(() => import('./views/employeedesignation/preview'))

/* division*/
const divisionIndex = React.lazy(() => import('./views/divison/index'))
const divisionAdd = React.lazy(() => import('./views/divison/add'))
const divisionEdit = React.lazy(() => import('./views/divison/edit'))
const divisionPreview = React.lazy(() => import('./views/divison/preview'))

/* Exam*/
const examIndex = React.lazy(() => import('./views/examination/index'))
const examAdd = React.lazy(() => import('./views/examination/add'))
const examEdit = React.lazy(() => import('./views/examination/edit'))
const examPreview = React.lazy(() => import('./views/examination/preview'))

/* Roles & Permissions--------- */
const rolesIndex = React.lazy(() => import('./views/roles-and-permissions/index'))
const rolesAdd = React.lazy(() => import('./views/roles-and-permissions/add'))
const rolesEdit = React.lazy(() => import('./views/roles-and-permissions/edit'))
const rolesPermission = React.lazy(() => import('./views/roles-and-permissions/Permission'))

/* modules*/
/*const modulesIndex = React.lazy(() => import('./views/modules/index'))
const modulesAdd = React.lazy(() => import('./views/modules/add'))
const modulesEdit = React.lazy(() => import('./views/modules/edit'))
*/

/* Organisation */
const OrganizationIndex = React.lazy(() => import('./views/organization/index'))
const OrganizationAdd = React.lazy(() => import('./views/organization/add'))
const OrganizationEdit = React.lazy(() => import('./views/organization/edit'))
const OrganizationPreview = React.lazy(() => import('./views/organization/preview'))

/* company */
const companyIndex = React.lazy(() => import('./views/company/index'))
const companyAdd = React.lazy(() => import('./views/company/add'))
const companyEdit = React.lazy(() => import('./views/company/edit'))
const CompanyPreview = React.lazy(() => import('./views/company/preview'))

/* vendor */
const vendorIndex = React.lazy(() => import('./views/vendor/index'))
const vendorAdd = React.lazy(() => import('./views/vendor/add'))
const vendorEdit = React.lazy(() => import('./views/vendor/edit'))
const VendorPreview = React.lazy(() => import('./views/vendor/preview'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // User Dashboard//

  {
    path: '/userdashboard',
    name: 'User Dashboard',
    element: UserDashboard,
  },

  // Work Order
  { path: '/work-order', name: 'Work Order', element: WorkOrderIndex },
  { path: '/work-order/add', name: 'Add', element: WorkOrderAdd },
  { path: '/work-order/edit/:id', name: 'Edit', element: WorkOrderEdit },
  { path: '/work-order/preview/:id', name: 'preview', element: WorkOrderPreview },
  { path: '/work-order/designations/:id', name: 'Designations', element: WorkOrderDesignation },
  { path: '/work-order/:id/milestones', name: 'milestones', element: WorkOrderMilestones },

  {
    path: '/work-order/emp-deployment/:id',
    name: 'Emp-Deployment',
    element: WorkOrderEmpDeployment,
  },

  //leave record
  { path: '/leave-record', name: 'Leave Record', element: leaverecord },

  //mpr
  { path: '/mpr', name: 'MPR', element: mpr },

  // cat-emp
  { path: '/empanelment', name: 'Empanelment', element: CatEmpIndex },
  { path: '/empanelment/add', name: 'Add Empanelment', element: CatEmpAdd },
  { path: '/empanelment/edit/:id', name: 'Edit Empanelment', element: CatEmpEdit },
  { path: '/empanelment/preview/:id', name: 'Preview Empanelment', element: CatEmpPreview },

  // designation
  { path: '/designation', name: 'Designation', element: DesIndex },
  { path: '/designation/add', name: 'Add Designation', element: DesAdd },
  { path: '/designation/edit/:id', name: 'Edit Designation', element: DesEdit },
  { path: '/designation/preview/:id', name: 'Edit Designation', element: Despreview },

  // hsn/sac code
  { path: '/gst-code', name: 'GST Codes', element: GstCodeIndex },
  { path: '/gst-code/add', name: 'Add GST Codes', element: GstCodeAdd },
  { path: '/gst-code/edit/:id', name: 'Edit GST Codes', element: GstCodeEdit },
  { path: '/gst-code/preview/:id', name: 'preview', element: GstCodePreview },

  //Resource Rate//
  { path: '/rate', name: 'Resource Rate', element: resrateIndex },
  { path: '/rate/add', name: 'Add Resource Rate', element: resrateAdd },
  { path: '/rate/edit/:id', name: 'Edit Resource Rate', element: resrateEdit },
  { path: '/rate/preview/:id', name: 'preview', element: resratepreview },

  //HRM//
  { path: '/hrm', name: 'HRM', element: hrmIndex },
  { path: '/hrm/add', name: 'Add', element: hrmAdd },
  { path: '/hrm/:employeeId', name: 'Edit', element: hrmAdd },
  { path: '/hrm/:employeeId/more-details', name: 'More Details', element: hrmMore },
  { path: '/hrm/:employeeId/preview', name: 'Preview', element: hrmPreview },

  // Salary Component
  { path: '/salary-component', name: 'Salary Component', element: salaryComponentIndex },
  { path: '/salary-component/add', name: 'Add', element: salaryComponentAdd },
  { path: '/salary-component/edit/:id', name: 'Edit', element: salaryComponentEdit },

  // Salary Structure
  { path: '/salary-structure', name: 'Salary Structure', element: salaryStructureIndex },
  { path: '/salary-structure/add', name: 'Add', element: salaryStructureAdd },
  { path: '/salary-structure/edit/:id', name: 'Edit', element: salaryStructureEdit },
  { path: '/salary-structure/:id/add-employee', name: 'Add', element: empSalaryStructureAdd },

  // Employee Salary Structure
  {
    path: '/emp-salary-structure',
    name: 'Employee Salary Structure',
    element: empSalaryStructureIndex,
  },
  {
    path: '/emp-salary-structure/add',
    name: 'Add',
    element: empSalaryStructureAdd,
  },
  {
    path: '/emp-salary-structure/edit/:id',
    name: 'Edit',
    element: empSalaryStructureEdit,
  },

  /* Employee Salary Register */

  {
    path: '/emp-salary-register',
    name: 'Salary Register',
    element: salaryRegister,
  },

  /* Salary Addon */
  {
    path: '/salary-addon',
    name: 'Salary Addon',
    element: salaryAddonIndex,
  },

  {
    path: '/salary-addon/add',
    name: 'Add',
    element: salaryAddonAdd,
  },

  {
    path: '/salary-addon/edit/:id',
    name: 'Edit',
    element: salaryAddonEdit,
  },

  {
    path: '/salary-addon/view/:id',
    name: 'Salary Addon View',
    element: SalaryAddonView,
  },

  /* Employee Addon */
  {
    path: '/salary-addon/:id/employee-addon',
    name: 'Employee Addon',
    element: employeeAddon,
  },

  /* Profile */

  {
    path: '/profile',
    name: 'My Profile',
    element: Profile,
  },

  // Employee Designation
  { path: '/employeedesignation', name: 'Employee Designation', element: employeedesignationIndex },
  { path: '/employeedesignation/add', name: 'Add', element: employeedesignationAdd },
  { path: '/employeedesignation/edit/:id', name: 'Edit', element: employeedesignationEdit },
  {
    path: '/employeedesignation/preview/:id',
    name: 'Preview',
    element: employeedesignationPreview,
  },

  // Division//
  { path: '/division', name: 'Division', element: divisionIndex },
  { path: '/division/add', name: 'Add', element: divisionAdd },
  { path: '/division/edit/:id', name: 'Edit', element: divisionEdit },
  { path: '/division/preview/:id', name: 'Preview', element: divisionPreview },

  //Exam
  { path: '/examination', name: 'Examinations', element: examIndex },
  { path: '/examination/add', name: 'Add', element: examAdd },
  { path: '/examination/edit/:id', name: 'Edit', element: examEdit },
  { path: '/examination/preview/:id', name: 'Preview', element: examPreview },

  // Roles & Permissions Routes.........
  // { path: '/roles-and-permissions', name: 'roles-and-permissions', element: rolesIndex },
  { path: '/roles-and-permissions/add', name: 'Add Role', element: rolesAdd },
  { path: '/roles-and-permissions/edit/:id', name: 'Edit Role', element: rolesEdit },
  {
    path: '/roles-and-permissions',
    name: 'Permission Roles',
    element: rolesPermission,
  },

  // Modules...
  /*{ path: '/modules', name: 'modules', element: modulesIndex },
  { path: '/modules/add', name: 'Add Role', element: modulesAdd },
  { path: '/modules/edit/:id', name: 'Edit Role', element: modulesEdit },
*/
  // Organization
  { path: '/organization', name: 'Organization', element: OrganizationIndex },
  { path: '/organization/add', name: 'Add Organization', element: OrganizationAdd },
  { path: '/organization/edit/:id', name: 'Edit Organization', element: OrganizationEdit },
  { path: '/organization/preview/:id', name: 'Preview Organization', element: OrganizationPreview },

  //company//
  { path: '/company', name: 'Company', element: companyIndex },
  { path: '/company/add', name: 'Add Company', element: companyAdd },
  { path: '/company/edit/:id', name: 'Edit Company', element: companyEdit },
  { path: '/company/preview/:id', name: 'Preview Company', element: CompanyPreview },

  //Vendor//
  { path: '/vendor', name: 'vendor', element: vendorIndex },
  { path: '/vendor/add', name: 'Add', element: vendorAdd },
  { path: '/vendor/edit/:id', name: 'Edit Vendor', element: vendorEdit },
  { path: '/vendor/preview/:id', name: 'preview', element: VendorPreview },

  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
