import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CAlert,
  CContainer,
  CButton,
} from '@coreui/react'

import PageHeader from '../components/form-header'
import './leave.css'

import WorkOrderSelect from '../components/leave-mpr/WorkOrderSelect'
import EmployeeMultiSelect from '../components/leave-mpr/EmployeeMultiSelect'
import MonthYearSelect from '../components/leave-mpr/MonthYearSelect'
import useLeaveMprForm from '../../hooks/useWoMpr'
import api from '../../api/axios'
import {
  calculateLeave,
  getPreviousMonthMeta,
  getMonthMeta,
} from '../components/leave-mpr/leaveCalculation'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const LeaveRecord = () => {
  const user = useSelector((state) => state.auth.user)
  const {
    workOrder,
    setWorkOrder,
    month,
    setMonth,
    monthOptions,

    selectedEmployees,
    setSelectedEmployees,
    filteredEmployees,
    mergeApiData,
    employeeData,
    handleInputChange,
    setEmployeeData,
    isReady,
  } = useLeaveMprForm(false)

  const [year, monthNum] = month.split('-')

  const [loading, setLoading] = useState(false)

  const [leavePerMonth, setLeavePerMonth] = useState(null)
  const [carryForward, setCarryForward] = useState(false)
  const [loadingLeavePolicy, setLoadingLeavePolicy] = useState(false)

  const [previousMonthData, setPreviousMonthData] = useState({})
  const [apiData, setApiData] = useState([])

  useEffect(() => {
    const fetchLeaveData = async () => {
      if (!workOrder || !month) return

      const { year, monthNum } = getMonthMeta(month)

      try {
        setLoading(true)

        let url = `/workorder/${workOrder}/employee-work-order-leave?month=${monthNum}&year=${year}`

        if (selectedEmployees.length > 0) {
          const ids = selectedEmployees.map((emp) => emp.id).join(',')
          url += `&employeeIds=${ids}`
        }

        const res = await api.get(url)

        setApiData(res.data?.data || [])
      } catch (err) {
        console.error(err)
        setApiData([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveData()
  }, [workOrder, month, selectedEmployees])

  useEffect(() => {
    const fetchLeavePolicy = async () => {
      if (!workOrder) {
        setLeavePerMonth(null)
        return
      }

      try {
        setLoadingLeavePolicy(true)

        const modelFilter = {
          EmpanelmentMaster: {
            is_active: true,
          },
        }

        const url = `/admin/workorder/${workOrder}?models=EmpanelmentMaster&modelFilter=${encodeURIComponent(
          JSON.stringify(modelFilter),
        )}&is_active=true`

        const res = await api.get(url)

        // adjust this based on actual API response
        const empanelment = res.data?.data?.EmpanelmentMaster

        // assume field name (you MUST verify)
        const leaveDays = empanelment?.leaves_per_month || 0
        const carryFowards = empanelment?.carry_forward || false
        setLeavePerMonth(leaveDays)
        setCarryForward(carryFowards)
      } catch (err) {
        console.error(err)
        setLeavePerMonth(null)
      } finally {
        setLoadingLeavePolicy(false)
      }
    }

    fetchLeavePolicy()
  }, [workOrder])

  useEffect(() => {
    const fetchPreviousMonth = async () => {
      if (!workOrder || !month) return

      const [year, monthNum] = month.split('-')

      let m = Number(monthNum)
      let y = Number(year)

      if (m === 1) {
        m = 12
        y = y - 1
      } else {
        m = m - 1
      }

      const prevMonthName = new Date(2000, m - 1, 1).toLocaleString('default', {
        month: 'short',
      })

      try {
        const res = await api.get(
          `/workorder/${workOrder}/employee-work-order-leave?month=${m}&year=${y}`,
        )

        const list = res.data?.data || []

        const map = {}
        list.forEach((item) => {
          map[Number(item.employee_id)] = item
        })

        setPreviousMonthData(map)
      } catch (err) {
        console.error(err)
        setPreviousMonthData({})
      }
    }

    fetchPreviousMonth()
  }, [workOrder, month])

  const handleSaveRow = async (emp) => {
    if (!workOrder || !month) return

    const empId = emp.id
    const data = employeeData[empId]

    // Guard: both fields must exist
    if (data?.leaveTaken === undefined || data?.holidaysWorked === undefined) {
      return
    }

    const [year, monthNum] = month.split('-')

    try {
      const calc = calculateLeave({
        employee: emp,
        leaveTaken: data.leaveTaken,
        holidaysWorked: data.holidaysWorked,
        leavePerMonth,
        carryForward,
        previousMonthData,
        selectedMonth: month,
      })

      const recordId = data.recordId

      if (recordId) {
        // PATCH

        const payload = {
          employees: [
            {
              id: recordId,
              employee_id: empId,
              leave_taken: Number(data.leaveTaken || 0),
              holiday_worked: Number(data.holidaysWorked || 0),
              leave_granted: calc.granted,
              month: Number(monthNum),
              year,
            },
          ],
          updated_by: user?.id,
        }

        await api.patch(`/workorder/${workOrder}/employee-work-order-leave`, payload)
      } else {
        // POST

        const payload = {
          employees: [
            {
              employee_id: empId,
              leave_taken: Number(data.leaveTaken || 0),
              holiday_worked: Number(data.holidaysWorked || 0),
              leave_granted: calc.granted,
            },
          ],
          month: Number(monthNum),
          year,
          created_by: user?.id,
        }

        const res = await api.post(`/workorder/${workOrder}/employee-work-order-leave`, payload)

        const createdEmployee = res.data?.data?.[0]
        const newId = createdEmployee?.id

        if (newId) {
          setEmployeeData((prev) => ({
            ...prev,
            [empId]: {
              ...prev[empId],
              recordId: newId,
            },
          }))
        }
      }

      toast.success('Details Saved!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save details')
    }
  }

  const handleSaveAll = async () => {
    if (!workOrder || !month) return

    try {
      const [year, monthNum] = month.split('-')

      const createEmployees = []
      const updateEmployees = []

      filteredEmployees.forEach((emp) => {
        const empId = emp.id
        const data = employeeData[empId]

        if (data?.leaveTaken === undefined || data?.holidaysWorked === undefined) {
          return
        }

        const calc = calculateLeave({
          employee: emp,
          leaveTaken: data.leaveTaken,
          holidaysWorked: data.holidaysWorked,
          leavePerMonth,
          carryForward,
          previousMonthData,
          selectedMonth: month,
        })

        const employeePayload = {
          employee_id: empId,
          leave_taken: Number(data.leaveTaken || 0),
          holiday_worked: Number(data.holidaysWorked || 0),
          leave_granted: calc.granted,
        }

        if (data.recordId) {
          updateEmployees.push({
            id: data.recordId,
            ...employeePayload,
            month: Number(monthNum),
            year,
          })
        } else {
          createEmployees.push(employeePayload)
        }
      })

      // CREATE
      if (createEmployees.length > 0) {
        const res = await api.post(`/workorder/${workOrder}/employee-work-order-leave`, {
          employees: createEmployees,
          month: Number(monthNum),
          year,
          created_by: user?.id,
        })

        const createdRecords = res.data?.data || []

        if (createdRecords.length) {
          setEmployeeData((prev) => {
            const updated = { ...prev }

            createdRecords.forEach((record) => {
              if (record.employee_id) {
                updated[record.employee_id] = {
                  ...updated[record.employee_id],
                  recordId: record.id,
                }
              }
            })

            return updated
          })
        }
      }

      // UPDATE
      if (updateEmployees.length > 0) {
        await api.patch(`/workorder/${workOrder}/employee-work-order-leave`, {
          employees: updateEmployees,
          updated_by: user?.id,
        })
      }

      toast.success('All records saved successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save records')
    }
  }

  const handleBlur = (emp) => {
    const empId = emp.id
    const data = employeeData[empId]

    // only save if BOTH values exist
    if (data?.leaveTaken !== undefined && data?.holidaysWorked !== undefined) {
      handleSaveRow(emp)
    }
  }

  
  useEffect(() => {
    mergeApiData(apiData)
  }, [apiData])

  return (
    <CContainer fluid>
      <PageHeader title="Leave Record" />

      <CCard className="leave-card">
        <CCardBody>
          {/* Filters */}
          <CRow className="g-3 mb-2 ">
            <CCol md={4}>
              <WorkOrderSelect workOrder={workOrder} setWorkOrder={setWorkOrder} />
            </CCol>
            <CCol md={4}>
              <MonthYearSelect month={month} setMonth={setMonth} options={monthOptions} />
            </CCol>
            <CCol md={4}>
              <EmployeeMultiSelect
                workOrder={workOrder}
                month={month}
                selectedEmployees={selectedEmployees}
                setSelectedEmployees={setSelectedEmployees}
              />
            </CCol>
          </CRow>

          {/* Info */}
          {isReady && (
            <CAlert color="info" className="info-box mt-3">
              Employee can take{' '}
              <strong> {loadingLeavePolicy ? '...' : (leavePerMonth ?? '-')} day(s)</strong> leave
              per month with {!carryForward ? 'no' : ''} carry-forward.
            </CAlert>
          )}

          {/* Table */}
          {isReady && (
            <div className="mpr-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Emp Name</th>
                    <th>Opening Bal.</th>
                    <th>No.of Leave Taken</th>
                    <th>No. of Holiday Worked</th>
                    <th>Leave Adjusted</th>
                    <th>Leave Granted</th>
                    <th>Closing Bal.</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp, index) => {
                      const empId = emp.id
                      const empName = emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`

                      const data = employeeData[empId] || {}

                      const calc = calculateLeave({
                        employee: emp,
                        leaveTaken: data.leaveTaken,
                        holidaysWorked: data.holidaysWorked,
                        leavePerMonth,
                        carryForward,
                        previousMonthData,
                        selectedMonth: month,
                      })

                      return (
                        <tr key={index}>
                          <td>{empName}</td>

                          <td>{calc.opening}</td>

                          <td>
                            <CFormInput
                              type="number"
                              value={data.leaveTaken ?? ''}
                              onChange={(e) =>
                                handleInputChange(empId, 'leaveTaken', e.target.value)
                              }
                              onBlur={() => handleBlur(emp)}
                            />
                          </td>

                          <td>
                            <CFormInput
                              type="number"
                              value={data.holidaysWorked ?? ''}
                              onChange={(e) =>
                                handleInputChange(empId, 'holidaysWorked', e.target.value)
                              }
                              onBlur={() => handleBlur(emp)}
                            />
                          </td>

                          <td>{calc.adjusted}</td>

                          <td>{calc.granted}</td>

                          <td>
                            <strong>{calc.closing}</strong>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
              <div className="d-flex justify-content-end mt-3">
                <CButton color="primary" onClick={handleSaveAll}>
                  Save All
                </CButton>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default LeaveRecord
