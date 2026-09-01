import React, { useEffect, useState, useRef } from 'react'
import api from '../../../api/axios'
import { getMonthRange } from './leaveCalculation'

const EmployeeMultiSelect = ({ workOrder, month, selectedEmployees, setSelectedEmployees }) => {
  const [employeesList, setEmployeesList] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const isAllSelected =
    employeesList.length > 0 && selectedEmployees.length === employeesList.length

  // Fetch employees based on workOrder
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!workOrder || !month) {
        setEmployeesList([])
        return
      }

      try {
        const url = `/employee?models=EmployeeWorkOrderDeployment.WoDesgnMapping&modelFilter=${encodeURIComponent(
          JSON.stringify({
            EmployeeWorkOrderDeployment: {
              required: true,
              is_deleted: false,
            },
            WoDesgnMapping: {
              required: true,
              work_order_id: workOrder,
            },
          }),
        )}&sort=first_name`

        const res = await api.get(url)

        const list = res.data?.data || []

        const { start, end } = getMonthRange(month)

        const filtered = list.filter((emp) => {
          const deployments = emp.EmployeeWorkOrderDeployment || []

          return deployments.some((dep) => {
            const joining = dep.joining_date
            const relieving = dep.relieving_date

            return joining <= end && (!relieving || relieving >= start)
          })
        })

        // format for UI
        const formatted = filtered.map((emp) => ({
          id: emp.id,
          name: `${emp.first_name} ${emp.middle_name ?? ''} ${emp.last_name ?? ''}`,
        }))

        setEmployeesList(formatted)
      } catch (err) {
        console.error('Error fetching employees', err)
        setEmployeesList([])
      }
    }

    fetchEmployees()
  }, [workOrder, month])

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // toggle employee
  const handleEmployeeToggle = (emp) => {
    if (selectedEmployees.some((e) => e.id === emp.id)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e.id !== emp.id))
    } else {
      setSelectedEmployees([...selectedEmployees, emp])
    }
  }

  // select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(employeesList)
    }
  }

  return (
    <div ref={dropdownRef} className="dropdown-wrapper">
      <div
        className="form-select custom-multiselect"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedEmployees.length === 0
          ? 'Select Employee'
          : selectedEmployees
              .slice(0, 2)
              .map((e) => e.name)
              .join(', ') +
            (selectedEmployees.length > 2 ? ` +${selectedEmployees.length - 2} more` : '')}
      </div>

      {showDropdown && (
        <div className="multi-select-dropdown">
          <div className="dropdown-item">
            <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /> Select All
          </div>

          <hr />

          {employeesList.map((emp) => (
            <div key={emp.id} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedEmployees.some((e) => e.id === emp.id)}
                onChange={() => handleEmployeeToggle(emp)}
              />{' '}
              {emp.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployeeMultiSelect
