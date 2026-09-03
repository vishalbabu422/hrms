import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import { cilCloudDownload, cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import SalaryDispatchModal from './salaryDispatchModal'
import PayslipModal from './payslipModal'
import SalaryFilterSection from './SalaryFilterSection'
import SalaryBulkDispatchModal from './salaryBulkDispatchModal'
import { validateBulkTransactions } from '../../validations/bulkTransitionValidation'
import SortableHeaderCell from '../components/sort-table-header'

const SalaryRegister = () => {
  /* ================= FILTERS ================= */

  const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL

  const [sort, setSort] = useState({
    key: 'first_name',
    order: 'asc',
  })

  const currentDate = new Date()

  const [month, setMonth] = useState((currentDate.getMonth() + 1).toString())

  const [year, setYear] = useState(currentDate.getFullYear().toString())

  const [workOrders, setWorkOrders] = useState([])

  const [selectedStructures, setSelectedStructures] = useState([])

  const [selectedWorkOrders, setSelectedWorkOrders] = useState([])

  // const [transactionDate, setTransactionDate] = useState('')

  /* ================= DATA ================= */

  const [salaryStructures, setSalaryStructures] = useState([])
  const [salaryStructure, setSalaryStructure] = useState('')

  const [salaryData, setSalaryData] = useState([])

  /* ================= MULTI SELECT ================= */

  const [selectedEmployees, setSelectedEmployees] = useState([])

  const [selectAll, setSelectAll] = useState(false)

  /* ================= BULK DISPATCH ================= */

  const [bulkDispatchModal, setBulkDispatchModal] = useState(false)

  const [transactionNo, setTransactionNo] = useState('')

  const [transactionDate, setTransactionDate] = useState('')

  const [useMultipleTransactions, setUseMultipleTransactions] = useState(false)

  const [applyAllTransactions, setApplyAllTransactions] = useState(false)

  const [commonTransactionNo, setCommonTransactionNo] = useState('')

  const [commonTransactionDate, setCommonTransactionDate] = useState('')

  const [employeeTransactions, setEmployeeTransactions] = useState({})

  /* ================= INDIVIDUAL DISPATCH ================= */

  const [individualDispatchModal, setIndividualDispatchModal] = useState(false)

  /* ================= PAYSLIP ================= */

  const [payslipModal, setPayslipModal] = useState(false)

  /* ================= SELECTED ROW ================= */

  const [selectedRow, setSelectedRow] = useState(null)

  /* ================= FILTER SEARCHES ================= */

  const [workOrderSearch, setWorkOrderSearch] = useState('')

  const [salaryStructureSearch, setSalaryStructureSearch] = useState('')

  /* ================= FETCH STRUCTURES ================= */

  useEffect(() => {
    if (!month || !year) {
      setSalaryData([])

      toast.error('Please select month and year')

      return
    }

    fetchEmployees()
  }, [month, year, selectedWorkOrders, selectedStructures, sort])

  /* ================= FETCH INITIAL DATA ================= */

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchSalaryStructures(), fetchWorkOrders(), fetchEmployees()])
    } catch (error) {
      console.error(error)

      toast.error('Failed to load filters')
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  /* ================= FETCH WORK ORDERS ================= */

  const fetchWorkOrders = async () => {
    try {
      const response = await api.get('admin/workorder/index?is_active=true')
      setWorkOrders(response?.data?.data?.workOrderList || [])
    } catch (error) {
      console.error(error)

      toast.error('Failed to fetch work orders')
    }
  }

  /* ================= FETCH SALARY STRUCTURES ================= */

  const fetchSalaryStructures = async () => {
    try {
      const response = await api.get('salary-structure?is_active=true')

      setSalaryStructures(response?.data?.data || [])
    } catch (error) {
      console.error(error)

      toast.error('Failed to fetch salary structures')
    }
  }

  /* ================= FETCH EMPLOYEES ================= */

  const fetchEmployees = async () => {
    try {
      const params = {
        models:
          'empSalaryStructure.salaryStructure,employeeSalaryRegisters,employeeWorkOrderDeployment.WoDesgnMapping',

        is_active: true,
        sort: `${sort.key} ${sort.order}`,
      }

      const modelFilter = {}

      /* ================= WORK ORDER FILTER ================= */

      if (selectedWorkOrders.length > 0) {
        modelFilter.WoDesgnMapping = {
          work_order_id: {
            $in: selectedWorkOrders,
          },
        }

        modelFilter.employeeWorkOrderDeployment = {
          required: true,
          is_deleted: false,
        }
      } else {
        // Always take only the active deployment
        modelFilter.employeeWorkOrderDeployment = {
          required: true,
          is_deleted: false,
        }
      }

      /* ================= SALARY STRUCTURE FILTER ================= */

      if (selectedStructures.length > 0) {
        modelFilter.empSalaryStructure = {
          salary_structure_id: {
            $in: selectedStructures,
          },

          required: true,
        }
      }

      /* ================= MONTH YEAR FILTER ================= */

      if (month && year) {
        modelFilter.employeeSalaryRegisters = {
          month: Number(month),

          year: Number(year),

          required: false,
        }
      }

      /* ================= APPLY FILTER ================= */

      if (Object.keys(modelFilter).length > 0) {
        params.modelFilter = JSON.stringify(modelFilter)
      }

      const response = await api.get('employee', {
        params,
      })

      const employees = response?.data?.data || []

      const monthStart = new Date(Number(year), Number(month) - 1, 1)
      const monthEnd = new Date(Number(year), Number(month), 0)

      const filteredEmployees = employees.filter((employee) => {
        const deployment = employee.employeeWorkOrderDeployment

        // No deployment = don't show employee
        if (!deployment || deployment.is_deleted) {
          return false
        }

        const joiningDate = new Date(deployment.joining_date)
        const relievingDate = deployment.relieving_date ? new Date(deployment.relieving_date) : null

        // Deployment must overlap the selected salary month
        const joinedBeforeMonthEnd = joiningDate <= monthEnd

        const notRelievedBeforeMonth = !relievingDate || relievingDate >= monthStart

        if (joinedBeforeMonthEnd && notRelievedBeforeMonth)
          return joinedBeforeMonthEnd && notRelievedBeforeMonth
      })

      const formattedEmployees = filteredEmployees.map((employee) => {
        const latestSalaryStructure =
          employee?.empSalaryStructure?.length > 0
            ? [...employee.empSalaryStructure].sort(
                (a, b) => new Date(b.effective_from) - new Date(a.effective_from),
              )[0]
            : null

        return {
          ...employee,

          latestSalaryStructure,

          hasSalaryStructure: !!latestSalaryStructure,
        }
      })

      setSalaryData(formattedEmployees)

      setSelectedEmployees([])

      setSelectAll(false)
    } catch (error) {
      console.error(error)

      toast.error('Failed to fetch employees')
    }
  }

  /* ================= CHECKBOX ================= */

  const handleCheckbox = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const dispatchableEmployees = salaryData
      .filter((item) => {
        const register = item.employeeSalaryRegisters?.[0] || null

        const isDispatched = register?.status === 'DISPATCHED'

        const isPayslipGenerated = register?.mon_salaryslip_generated

        return item.hasSalaryStructure && !isDispatched && !isPayslipGenerated
      })
      .map((item) => item.id)

    if (selectAll) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(dispatchableEmployees)
    }

    setSelectAll(!selectAll)
  }

  /* ================= Added================= */

  const handleEmployeeTransactionChange = (employeeId, field, value) => {
    setEmployeeTransactions((prev) => ({
      ...prev,

      [employeeId]: {
        ...prev[employeeId],

        [field]: value,
      },
    }))
  }

  const handleApplyAllTransactions = (checked) => {
    setApplyAllTransactions(checked)

    if (checked) {
      const updatedTransactions = {
        ...employeeTransactions,
      }

      salaryData
        .filter((emp) => selectedEmployees.includes(emp.id))
        .forEach((emp) => {
          const existing = updatedTransactions[emp.id] || {}

          updatedTransactions[emp.id] = {
            ...existing,

            transaction_number: existing.transaction_number || commonTransactionNo,

            transaction_date: existing.transaction_date || commonTransactionDate,
          }
        })

      setEmployeeTransactions(updatedTransactions)
    }
  }

  /* ================= BULK DISPATCH ================= */

  const handleBulkDispatch = async () => {
    try {
      const validation = validateBulkTransactions({
        salaryData,

        selectedEmployees,

        employeeTransactions,
      })

      if (!validation.isValid) {
        toast.error(validation.message)

        return
      }

      /* ================= SELECTED EMPLOYEES ================= */

      const selectedEmployeeData = salaryData.filter((item) => selectedEmployees.includes(item.id))

      /* ================= GENERATE REGISTERS ================= */

      const generatedRegisters = await Promise.all(
        selectedEmployeeData.map(async (employee) => {
          const response = await api.post('employee-salary-register-monthly/generate', {
            employee_id: employee.id,

            month: Number(month),

            year: Number(year),

            salary_structure_id: employee?.latestSalaryStructure?.salary_structure_id,
          })

          return response?.data?.data
        }),
      )

      /* ================= CREATE DISPATCH PAYLOAD ================= */

      const payload = generatedRegisters.map((register) => {
        const transaction = employeeTransactions?.[register.employee_id] || {}

        return {
          transaction_number: transaction.transaction_number,

          transaction_date: transaction.transaction_date,

          employee_id: Number(register.employee_id),

          month: Number(register.month),

          year: Number(register.year),

          ctc: Number(register.ctc || 0),

          gross_earnings: Number(register.gross_earnings || 0),

          total_deductions: Number(register.total_deductions || 0),

          net_salary: Number(register.net_salary || 0),

          components: (register.components || []).map((component) => ({
            component_id: component.component_id ? Number(component.component_id) : null,

            name: component.name,

            type: component.type,

            amount: Number(component.amount || 0),
          })),

          addons: (register.addons || []).map((addon) => ({
            addon_id: addon.addon_id ? Number(addon.addon_id) : null,

            salary_addon_master_id: Number(addon.salary_addon_master_id),

            name: addon.name,

            code: addon.code,

            type: addon.type,

            amount: Number(addon.amount || 0),

            recurrence_type: addon.recurrence_type,
          })),
        }
      })

      /* ================= BULK DISPATCH ================= */

      await api.post('employee-salary-register-monthly/dispatch', payload)

      toast.success('Salary dispatched successfully')

      setBulkDispatchModal(false)

      setTransactionNo('')

      setTransactionDate('')

      setSelectedEmployees([])

      setSelectAll(false)

      setEmployeeTransactions({})

      setApplyAllTransactions(false)

      setCommonTransactionNo('')

      setCommonTransactionDate('')

      await fetchEmployees()
    } catch (error) {
      console.error(error)

      toast.error('Dispatch failed')
    }
  }

  /* ================= INDIVIDUAL DISPATCH ================= */

  const handleIndividualDispatch = async (payload) => {
    try {
      await api.post('employee-salary-register-monthly/dispatch', payload)

      toast.success('Salary dispatched successfully')

      setIndividualDispatchModal(false)

      await fetchEmployees()
    } catch (error) {
      console.error(error)

      toast.error('Dispatch failed')
    }
  }

  /* ================= GENERATE PAYSLIP ================= */

  const handleGenerate = async (registerId) => {
    try {
      await api.post(`employee-salary-register-monthly/generate-slip/${registerId}`)

      toast.success('Payslip generated successfully')

      setPayslipModal(false)

      await fetchEmployees()
    } catch (error) {
      console.error(error)

      toast.error('Failed to generate payslip')
    }
  }

  /* ================= ADDED ================= */

  const handleDownload = async (registerId, filePath) => {
    try {
      const response = await api.get(
        `employee-salary-register-monthly/download-slip/${registerId}`,
        {
          responseType: 'blob',
        },
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')

      const disposition = response.headers['content-disposition']
      let filename = filePath?.split('/').pop() || 'Payslip.pdf'

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/)
        if (match) filename = match[1]
      }

      link.href = url
      link.download = filename

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      toast.error('Download failed')
    }
  }

  const filteredWorkOrders = workOrders.filter((item) =>
    item.work_order_no?.toLowerCase().includes(workOrderSearch.toLowerCase()),
  )

  const filteredSalaryStructures = salaryStructures.filter((item) =>
    item.name?.toLowerCase().includes(salaryStructureSearch.toLowerCase()),
  )

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === 'asc' ? 'desc' : 'asc' }
      }
      return { key, order: 'asc' }
    })
  }

  return (
    <>
      {/* FILTERS */}
      <CCard className="border-0 rounded-4 mb-3">
        <CCardBody>
          <CRow className="g-3 align-items-end justify-content-between">
            {/* MONTH */}
            <CCol md={3}>
              <CFormLabel className="fw-semibold small text-muted">
                {' '}
                Month <span className="text-danger">*</span>{' '}
              </CFormLabel>

              <CFormSelect
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="rounded-3"
              >
                <option value="">Select Month</option>

                <option value="1">Jan</option>

                <option value="2">Feb</option>

                <option value="3">Mar</option>

                <option value="4">Apr</option>

                <option value="5">May</option>

                <option value="6">Jun</option>

                <option value="7">Jul</option>

                <option value="8">Aug</option>

                <option value="9">Sep</option>

                <option value="10">Oct</option>

                <option value="11">Nov</option>

                <option value="12">Dec</option>
              </CFormSelect>
            </CCol>

            {/* YEAR */}
            <CCol md={3}>
              <CFormLabel className="fw-semibold small text-muted">
                Year <span className="text-danger">*</span>
              </CFormLabel>

              <CFormSelect
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-3"
              >
                <option value="">Select Year</option>

                {Array.from({ length: 4 }, (_, index) => new Date().getFullYear() - index).map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ),
                )}
              </CFormSelect>
            </CCol>

            {/* FILTER BUTTON */}
            <CCol md="auto" className="d-flex justify-content-end ms-auto">
              <CDropdown alignment="end">
                {/* BUTTON */}
                <CDropdownToggle
                  color="light"
                  className="rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                  style={{
                    height: '36px',
                    border: '1px solid #d8dbe0',
                    color: '#3c4b64',
                    background: '#fff',
                    boxShadow: 'none',
                    minWidth: '120px',
                    transition: '0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#5856d6'

                    e.target.style.borderColor = '#5856d6'

                    e.target.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff'

                    e.target.style.borderColor = '#d8dbe0'

                    e.target.style.color = '#3c4b64'
                  }}
                >
                  <CIcon icon={cilFilter} />

                  <span>Filters</span>
                </CDropdownToggle>
                {/* DROPDOWN */}
                <CDropdownMenu
                  className="border-0 rounded-4 shadow p-0 overflow-hidden"
                  style={{
                    width: '750px',
                    marginTop: '12px',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                  }}
                >
                  {/* HEADER */}
                  <div
                    className="px-4 py-3"
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: '#ffffff',
                    }}
                  >
                    <div
                      className="fw-bold text-uppercase"
                      style={{
                        fontSize: '15px',
                        letterSpacing: '0.5px',
                        color: '#0f172a',
                      }}
                    >
                      Filters
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="px-4 py-4">
                    <div className="row">
                      {/* WORK ORDER */}
                      <div className="col-6">
                        <div
                          className="mb-3"
                          style={{
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            color: '#64748b',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          Work Order
                        </div>

                        {/* SEARCH */}
                        <div className="mb-3">
                          <CFormInput
                            placeholder="Search Work Order"
                            value={workOrderSearch}
                            onChange={(e) => setWorkOrderSearch(e.target.value)}
                            className="mb-2"
                          />
                        </div>

                        {/* LIST */}
                        <div
                          style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            paddingRight: '8px',
                          }}
                        >
                          <div className="d-flex flex-column gap-3">
                            {/* SELECT ALL */}
                            <label
                              className="d-flex align-items-center gap-3"
                              style={{
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedWorkOrders.length === workOrders.length &&
                                  workOrders.length > 0
                                }
                                onChange={() => {
                                  if (selectedWorkOrders.length === 10) {
                                    setSelectedWorkOrders([])
                                  } else {
                                    setSelectedWorkOrders(workOrders.map((wo) => Number(wo.id)))
                                  }
                                }}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  accentColor: '#0f2b7a',
                                }}
                              />

                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#0f172a',
                                }}
                              >
                                Select All
                              </span>
                            </label>

                            {/* OPTIONS */}
                            {filteredWorkOrders.map((workOrder) => (
                              <label
                                key={workOrder.id}
                                className="d-flex align-items-center gap-3"
                                style={{
                                  cursor: 'pointer',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedWorkOrders.includes(Number(workOrder.id))}
                                  onChange={() => {
                                    setSelectedWorkOrders((prev) =>
                                      prev.includes(Number(workOrder.id))
                                        ? prev.filter((x) => x !== Number(workOrder.id))
                                        : [...prev, Number(workOrder.id)],
                                    )
                                  }}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    accentColor: '#0f2b7a',
                                  }}
                                />

                                <span
                                  style={{
                                    fontSize: '14px',
                                    color: '#475569',
                                  }}
                                >
                                  {`${workOrder.work_order_no} - ${workOrder.project_name}`}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* SALARY STRUCTURE */}
                      <div className="col-6 border-start">
                        <div
                          className="ps-3"
                          style={{
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            color: '#64748b',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          Salary Structure
                        </div>

                        {/* SEARCH */}
                        <div className="ps-3 mt-3 mb-3">
                          <CFormInput
                            placeholder="Search Salary Structure"
                            value={salaryStructureSearch}
                            onChange={(e) => setSalaryStructureSearch(e.target.value)}
                            className="mb-2"
                          />
                        </div>

                        {/* LIST */}
                        <div
                          className="ps-3"
                          style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            paddingRight: '8px',
                          }}
                        >
                          <div className="d-flex flex-column gap-3">
                            {/* SELECT ALL */}
                            <label
                              className="d-flex align-items-center gap-3"
                              style={{
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedStructures.length === salaryStructures.length &&
                                  salaryStructures.length > 0
                                }
                                onChange={() => {
                                  if (selectedStructures.length === 10) {
                                    setSelectedStructures([])
                                  } else {
                                    setSelectedStructures(
                                      salaryStructures.map((item) => Number(item.id)),
                                    )
                                  }
                                }}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  accentColor: '#0f2b7a',
                                }}
                              />

                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#0f172a',
                                }}
                              >
                                Select All
                              </span>
                            </label>

                            {/* OPTIONS */}
                            {filteredSalaryStructures.map((structure) => (
                              <label
                                key={structure.id}
                                className="d-flex align-items-center gap-3"
                                style={{
                                  cursor: 'pointer',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedStructures.includes(Number(structure.id))}
                                  onChange={() => {
                                    setSelectedStructures((prev) =>
                                      prev.includes(Number(structure.id))
                                        ? prev.filter((x) => x !== Number(structure.id))
                                        : [...prev, Number(structure.id)],
                                    )
                                  }}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    accentColor: '#0f2b7a',
                                  }}
                                />

                                <span
                                  style={{
                                    fontSize: '14px',
                                    color: '#475569',
                                  }}
                                >
                                  {structure.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div
                    className="d-flex justify-content-between align-items-center px-4 py-3"
                    style={{
                      borderTop: '1px solid #e2e8f0',
                      background: '#ffffff',
                    }}
                  >
                    {/* CLEAR ALL */}
                    <CButton
                      color="light"
                      className="rounded-3 fw-semibold px-4"
                      style={{
                        height: '44px',
                        border: '1px solid #d8dbe0',
                        color: '#3c4b64',
                        background: '#fff',
                        boxShadow: 'none',
                        transition: '0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#5856d6'

                        e.target.style.borderColor = '#5856d6'

                        e.target.style.color = '#fff'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#fff'

                        e.target.style.borderColor = '#d8dbe0'

                        e.target.style.color = '#3c4b64'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()

                        setSelectedWorkOrders([])

                        setSelectedStructures([])
                      }}
                    >
                      Clear All
                    </CButton>
                  </div>
                </CDropdownMenu>
              </CDropdown>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* TABLE */}
      <CCard className="border-0 rounded-4">
        <CCardBody>
          <CTable bordered hover responsive align="middle">
            <CTableHead>
              <CTableRow>
                {/* SELECT ALL */}
                <CTableHeaderCell className="text-center">
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </CTableHeaderCell>

                <SortableHeaderCell
                  label="Employee"
                  sortKey="first_name"
                  sort={sort}
                  onSort={handleSort}
                />

                <CTableHeaderCell>Employee Code</CTableHeaderCell>

                <CTableHeaderCell>Salary Structure</CTableHeaderCell>

                <CTableHeaderCell>CTC</CTableHeaderCell>

                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {salaryData.length > 0 ? (
                salaryData.map((item) => {
                  const latestStructure = item.latestSalaryStructure
                  const register = item.employeeSalaryRegisters?.[0] || null
                  const status = register?.status || null

                  const isPayslipGenerated = register?.mon_salaryslip_generated

                  return (
                    <CTableRow key={item.id}>
                      {/* CHECKBOX */}
                      <CTableDataCell className="text-center">
                        {(() => {
                          const register = item.employeeSalaryRegisters?.[0] || null

                          const isDispatched = register?.status === 'DISPATCHED'

                          const isPayslipGenerated = register?.mon_salaryslip_generated

                          const canDispatch =
                            item.hasSalaryStructure && !isDispatched && !isPayslipGenerated

                          return (
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(item.id)}
                              disabled={!canDispatch}
                              onChange={() => handleCheckbox(item.id)}
                              style={{
                                cursor: canDispatch ? 'pointer' : 'not-allowed',
                              }}
                            />
                          )
                        })()}
                      </CTableDataCell>

                      {/* EMPLOYEE */}
                      <CTableDataCell>
                        {item?.first_name} {item?.middle_name || ''} {item?.last_name || ''}
                      </CTableDataCell>

                      {/* EMPLOYEE CODE */}
                      <CTableDataCell>{item.employee_code}</CTableDataCell>

                      {/* SALARY STRUCTURE */}
                      <CTableDataCell>
                        {' '}
                        {latestStructure?.salaryStructure?.name || '-'}
                      </CTableDataCell>

                      {/* CTC */}
                      <CTableDataCell>
                        {latestStructure?.ctc ? (
                          <>
                            ₹{' '}
                            {Number(latestStructure.ctc).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                            })}
                          </>
                        ) : (
                          '-'
                        )}
                      </CTableDataCell>

                      {/* ACTION */}
                      <CTableDataCell>
                        {!item.hasSalaryStructure ? (
                          <span className="text-muted">Salary Structure Not Mapped</span>
                        ) : !register ? (
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => {
                              setSelectedRow(item)

                              setIndividualDispatchModal(true)
                            }}
                          >
                            Dispatch
                          </CButton>
                        ) : status === 'DISPATCHED' && !isPayslipGenerated ? (
                          <CButton
                            size="sm"
                            color="success"
                            onClick={() => {
                              setSelectedRow(item)

                              setPayslipModal(true)
                            }}
                          >
                            Generate Payslip
                          </CButton>
                        ) : isPayslipGenerated ? (
                          <>
                            <CButton
                              size="sm"
                              className="me-2"
                              style={{
                                background: '#7a8594',
                                border: 'none',
                                color: '#fff',
                              }}
                              onClick={() => {
                                setSelectedRow(item)

                                setPayslipModal(true)
                              }}
                            >
                              View
                            </CButton>

                            {/* <a
                              href={`${FILE_BASE_URL}${register?.mon_salaryslip_filepath}`}
                              target="_blank"
                              download
                              rel="noreferrer"
                            >
                              <CButton
                                size="sm"
                                style={{
                                  background: '#5c7c99',
                                  border: 'none',
                                  color: '#fff',
                                }}
                              >
                                <CIcon icon={cilCloudDownload} className="me-1" />
                                Download
                              </CButton>
                            </a> */}

                            <CButton
                              size="sm"
                              style={{
                                background: '#5c7c99',
                                border: 'none',
                                color: '#fff',
                              }}
                              onClick={() =>
                                handleDownload(register.id, register?.mon_salaryslip_filepath)
                              }
                            >
                              <CIcon icon={cilCloudDownload} className="me-1" />
                              Download
                            </CButton>
                          </>
                        ) : (
                          <span className="text-muted">Pending</span>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-muted py-4">
                    No employees found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {/* BULK ACTION */}
          <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
            <span>
              Selected:
              <strong> {selectedEmployees.length}</strong>
            </span>

            <CButton
              color="primary"
              disabled={selectedEmployees.length === 0}
              onClick={() => setBulkDispatchModal(true)}
            >
              Dispatch Selected
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* ================= BULK DISPATCH MODAL ================= */}
      <SalaryBulkDispatchModal
        visible={bulkDispatchModal}
        onClose={() => {
          setBulkDispatchModal(false)

          setUseMultipleTransactions(false)

          setEmployeeTransactions({})

          setApplyAllTransactions(false)

          setCommonTransactionNo('')

          setCommonTransactionDate('')
        }}
        handleBulkDispatch={handleBulkDispatch}
        useMultipleTransactions={useMultipleTransactions}
        setUseMultipleTransactions={setUseMultipleTransactions}
        transactionNo={transactionNo}
        setTransactionNo={setTransactionNo}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        applyAllTransactions={applyAllTransactions}
        handleApplyAllTransactions={handleApplyAllTransactions}
        commonTransactionNo={commonTransactionNo}
        setCommonTransactionNo={setCommonTransactionNo}
        commonTransactionDate={commonTransactionDate}
        setCommonTransactionDate={setCommonTransactionDate}
        employeeTransactions={employeeTransactions}
        setEmployeeTransactions={setEmployeeTransactions}
        selectedEmployees={selectedEmployees}
        salaryData={salaryData}
        handleEmployeeTransactionChange={handleEmployeeTransactionChange}
      />

      {/* ================= INDIVIDUAL DISPATCH MODAL ================= */}

      <SalaryDispatchModal
        visible={individualDispatchModal}
        onClose={() => setIndividualDispatchModal(false)}
        employeeId={selectedRow?.id}
        month={month}
        year={year}
        salaryStructureId={selectedRow?.latestSalaryStructure?.salary_structure_id}
        onSubmit={handleIndividualDispatch}
      />

      {/* ================= PAYSLIP MODAL ================= */}

      <PayslipModal
        visible={payslipModal}
        onClose={() => setPayslipModal(false)}
        employeeId={selectedRow?.id}
        month={month}
        year={year}
        salaryStructureId={selectedRow?.latestSalaryStructure?.salary_structure_id}
        onGenerate={handleGenerate}
      />
    </>
  )
}

export default SalaryRegister
