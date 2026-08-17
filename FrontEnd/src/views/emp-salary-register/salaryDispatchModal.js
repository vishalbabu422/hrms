import {
  CModal,
  CModalBody,
  CModalFooter,
  CButton,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import { CTooltip } from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useSelector } from 'react-redux'

const SalaryDispatchModal = ({
  visible,
  onClose,
  employeeId,
  month,
  year,
  salaryStructureId,
  onSubmit,
}) => {
  const user = useSelector((state) => state.auth.user)
  const [txnNo, setTxnNo] = useState('')
  const [salaryData, setSalaryData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [transactionDate, setTransactionDate] = useState('')
  const [showAddonDropdown, setShowAddonDropdown] = useState('')
  const [selectedAddons, setSelectedAddons] = useState([])

  const [addonOptions, setAddonOptions] = useState([])

  const fetchSalaryAddons = async () => {
    try {
      const monthStart = `${year}-${String(month).padStart(2, '0')}-01`

      const monthEnd = new Date(year, month, 0).toISOString().split('T')[0]

      const modelFilter = {
        employeeSalaryAddons: {
          employee_id: Number(employeeId),

          required: false,
        },
      }

      const response = await api.get('/salary-addon-master/index', {
        params: {
          is_active: true,

          models: 'employeeSalaryAddons',

          modelFilter: JSON.stringify(modelFilter),
        },
      })

      const list = response?.data?.data?.salaryAddonList || []

      /* ================= FILTER ACTIVE ADDONS FOR CURRENT MONTH ================= */

      const filteredList = list.filter((item) => {
        const mappings = item.employeeSalaryAddons || []

        const hasActiveMapping = mappings.some((mapping) => {
          const from = new Date(mapping.effective_from)

          const to = mapping.effective_to ? new Date(mapping.effective_to) : null

          const currentMonthStart = new Date(monthStart)

          const currentMonthEnd = new Date(monthEnd)

          return from <= currentMonthEnd && (!to || to >= currentMonthStart)
        })

        return !hasActiveMapping
      })

      setAddonOptions(filteredList)
    } catch (error) {
      console.error(error)

      toast.error('Failed to fetch salary addons')
    }
  }

  const monthYearLabel =
    month && year
      ? new Date(year, month - 1).toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        })
      : ''

  const fetchSalaryData = async () => {
    try {
      setLoading(true)

      const res = await api.post('employee-salary-register-monthly/generate', {
        employee_id: Number(employeeId),
        month: Number(month),
        year: Number(year),
        salary_structure_id: Number(salaryStructureId),
      })

      setSalaryData(res?.data?.data || null)
    } catch (error) {
      console.error(error)

      toast.error(error?.response?.data?.message || 'Failed to generate salary')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible && employeeId && month && year && salaryStructureId) {
      fetchSalaryData()
      fetchSalaryAddons()
    }
  }, [visible, employeeId, month, year, salaryStructureId])

  // handle submit create employee add on mapping
  const createEmployeeAddonMappings = async () => {
    if (selectedAddons.length === 0) {
      return []
    }

    const addonPayload = selectedAddons.map((addon) => ({
      employee_id: Number(employeeId),

      salary_addon_master_id: Number(addon.salary_addon_master_id),

      amount: Number(addon.amount),

      recurrence_type: 'ONCE',

      effective_from: `${year}-${String(month).padStart(2, '0')}-01`,

      effective_to: new Date(Number(year), Number(month), 0).toISOString().split('T')[0],

      remarks: '',

      created_by: user?.id,
    }))

    const response = await api.post('/employee-salary-addon/create', addonPayload)

    return response?.data?.data || []
  }

  // formatted new addons
  const formatCreatedAddons = (createdAddonMappings) => {
    return createdAddonMappings.map((addon, index) => {
      const selectedAddon = selectedAddons[index]

      return {
        addon_id: Number(addon.id),

        salary_addon_master_id: Number(addon.salary_addon_master_id),

        name: selectedAddon?.name,

        code: selectedAddon?.code,

        type: selectedAddon?.addon_type,

        amount: Number(addon.amount),

        recurrence_type: addon.recurrence_type,
      }
    })
  }

  // dispatch payload
  const buildDispatchPayload = (newlyCreatedAddons) => {
    return [
      {
        transaction_number: txnNo.trim(),

        transaction_date: transactionDate,

        employee_id: Number(employeeId),

        month: Number(month),

        year: Number(year),

        ctc: Number(salaryData?.ctc || 0),

        gross_earnings: Number(salaryData?.gross_earnings || 0),

        total_deductions: Number(salaryData?.total_deductions || 0),

        net_salary: Number(salaryData?.net_salary || 0),

        leave_deduction: Number(salaryData?.lop || 0),
        components: (salaryData?.components || []).map((component) => ({
          component_id: component.component_id ? Number(component.component_id) : null,

          name: component.name,

          type: component.type,

          amount: Number(component.amount || 0),
        })),

        addons: [...(salaryData?.addons || []), ...newlyCreatedAddons],
      },
    ]
  }

  // reset form for handle submit
  const resetForm = () => {
    setTxnNo('')

    setTransactionDate('')

    setSelectedAddons([])

    setShowAddonDropdown('')
  }

  // final form submission
  const handleSubmit = async () => {
    try {
      if (!txnNo.trim()) {
        toast.error('Transaction Number is required')
        return
      }

      if (!salaryData) {
        toast.error('Salary data not found')
        return
      }

      const createdAddonMappings = await createEmployeeAddonMappings()

      const newlyCreatedAddons = formatCreatedAddons(createdAddonMappings)

      const payload = buildDispatchPayload(newlyCreatedAddons)

      onSubmit?.(payload)

      resetForm()

      // toast.success('Salary dispatched successfully')
    } catch (error) {
      console.error(error)

      toast.error(error?.response?.data?.message || 'Failed to dispatch salary')
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalBody
        style={{
          padding: '30px',
          background: '#fff',

          maxHeight: '80vh',

          overflowY: 'auto',

          overflowX: 'hidden',
        }}
      >
        {/* MONTH YEAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <strong>{monthYearLabel}</strong>
        </div>

        <br />

        {/* HEADER */}
        <p>
          <strong>Dear Employee,</strong>
        </p>

        <p>
          <strong>Sub: Salary Structure</strong>
        </p>

        <p>Please find below your salary structure details for the selected period.</p>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            {/* TABLE */}
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #000',
              }}
            >
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    SALARY BREAKUP
                  </th>
                </tr>

                <tr>
                  <th
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    Component
                  </th>

                  <th
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* ================= EARNINGS ================= */}

                <tr>
                  <td
                    colSpan="2"
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                      background: '#f3f4f6',
                    }}
                  >
                    <strong>Earnings</strong>
                  </td>
                </tr>

                {salaryData?.components
                  ?.filter((component) => component.type === 'EARNING')
                  .map((component) => (
                    <tr key={component.component_id}>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px',
                        }}
                      >
                        {component.name}
                      </td>

                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px',
                        }}
                      >
                        ₹ {Number(component.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}

                {/* ================= GROSS EARNINGS ================= */}

                <tr>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>Gross Earnings</strong>
                  </td>

                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>₹ {Number(salaryData?.gross_earnings || 0).toFixed(2)}</strong>
                  </td>
                </tr>

                {/* ================= DEDUCTIONS ================= */}

                <tr>
                  <td
                    colSpan="2"
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                      background: '#f3f4f6',
                    }}
                  >
                    <strong>Deductions</strong>
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    Leave
                  </td>

                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    ₹ {Number(salaryData?.lop || 0).toFixed(2)}
                  </td>
                </tr>

                {salaryData?.components
                  ?.filter((component) => component.type === 'DEDUCTION')
                  .map((component) => (
                    <tr key={component.component_id}>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px',
                        }}
                      >
                        {component.name}
                      </td>

                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px',
                        }}
                      >
                        ₹ {Number(component.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}

                {/* ================= TOTAL DEDUCTIONS ================= */}

                <tr>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>Total Deductions</strong>
                  </td>

                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>₹ {Number(salaryData?.total_deductions || 0).toFixed(2)}</strong>
                  </td>
                </tr>

                {/* ================= NET SALARY ================= */}

                <tr>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>Net Salary</strong>
                  </td>

                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>₹ {Number(salaryData?.net_salary || 0).toFixed(2)}</strong>
                  </td>
                </tr>

                {/* ================= CTC ================= */}

                <tr>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>CTC</strong>
                  </td>

                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '6px',
                    }}
                  >
                    <strong>₹ {Number(salaryData?.ctc || 0).toFixed(2)}</strong>
                  </td>
                </tr>

                {/* ADDONS HEADING */}

                {salaryData?.addons?.length > 0 && (
                  <>
                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          height: '20px',
                          border: 'none',
                        }}
                      ></td>
                    </tr>

                    <tr>
                      <th
                        colSpan={2}
                        style={{
                          border: '1px solid #000',
                          padding: '6px',
                        }}
                      >
                        Addons
                      </th>
                    </tr>
                  </>
                )}

                {/* ADDONS */}

                {salaryData?.addons?.map((addon) => (
                  <tr key={addon.addon_id}>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px',
                      }}
                    >
                      {addon.name}
                    </td>

                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px',
                      }}
                    >
                      ₹ {Number(addon.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}

                {/* ADDITIONAL ADDONS */}
              </tbody>
            </table>

            <br />

            {/* ADDITIONAL SALARY ADDONS */}

            <div
              className="mt-2"
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div
                style={{
                  background: '#f3f4f6',
                  padding: '12px 16px',
                  fontWeight: '600',
                  fontSize: '15px',
                  borderBottom: '1px solid #d1d5db',
                }}
              >
                Additional Salary Addons
              </div>

              <div
                style={{
                  padding: '16px 16px 22px',
                }}
              >
                <div className="row g-3 align-items-end">
                  <div className="col-md-5">
                    <CFormLabel>Addon Type</CFormLabel>

                    <CFormSelect
                      value={showAddonDropdown}
                      onChange={(e) => setShowAddonDropdown(e.target.value)}
                      style={{
                        height: '38px',
                      }}
                    >
                      <option value="">Select Addon</option>

                      {addonOptions.map((addon) => (
                        <option key={addon.id} value={addon.id}>
                          {addon.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div className="col-md-5">
                    <CFormLabel>Amount</CFormLabel>

                    <CFormInput
                      type="number"
                      placeholder="Enter Amount"
                      id="addonAmountInput"
                      style={{
                        height: '38px',
                      }}
                    />
                  </div>

                  <div className="col-md-2">
                    <CButton
                      color="primary"
                      style={{
                        width: '100%',
                        height: '38px',
                      }}
                      onClick={() => {
                        const amount = document.getElementById('addonAmountInput')?.value

                        if (!showAddonDropdown || !amount) {
                          toast.error('Please select addon and enter amount')

                          return
                        }

                        const selectedAddonData = addonOptions.find(
                          (item) => String(item.id) === String(showAddonDropdown),
                        )

                        setSelectedAddons((prev) => {
                          const existingIndex = prev.findIndex(
                            (item) =>
                              Number(item.salary_addon_master_id) === Number(selectedAddonData?.id),
                          )

                          /* UPDATE EXISTING */

                          if (existingIndex !== -1) {
                            return prev.map((item, index) =>
                              index === existingIndex
                                ? {
                                    ...item,
                                    amount,
                                  }
                                : item,
                            )
                          }

                          /* ADD NEW */

                          return [
                            ...prev,
                            {
                              id: Date.now(),

                              salary_addon_master_id: selectedAddonData?.id,

                              name: selectedAddonData?.name,

                              code: selectedAddonData?.code,

                              addon_type: selectedAddonData?.addon_type,

                              amount,
                            },
                          ]
                        })

                        setShowAddonDropdown('')

                        document.getElementById('addonAmountInput').value = ''
                      }}
                    >
                      Add
                    </CButton>
                  </div>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="mt-4">
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: '#f9fafb',
                          }}
                        >
                          <th
                            style={{
                              border: '1px solid #d1d5db',
                              padding: '10px',
                              textAlign: 'left',
                            }}
                          >
                            Addon Name
                          </th>

                          <th
                            style={{
                              border: '1px solid #d1d5db',
                              padding: '10px',
                              textAlign: 'left',
                            }}
                          >
                            Amount
                          </th>

                          <th
                            style={{
                              border: '1px solid #d1d5db',
                              padding: '10px',
                              textAlign: 'center',
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedAddons.map((addon, index) => (
                          <tr key={addon.id}>
                            <td
                              style={{
                                border: '1px solid #d1d5db',
                                padding: '10px',
                              }}
                            >
                              {addon.name}
                            </td>

                            <td
                              style={{
                                border: '1px solid #d1d5db',
                                padding: '10px',
                              }}
                            >
                              ₹ {addon.amount}
                            </td>

                            <td
                              style={{
                                border: '1px solid #d1d5db',
                                padding: '10px',
                                textAlign: 'center',
                              }}
                            >
                              <CButton
                                size="sm"
                                color="danger"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAddons((prev) => prev.filter((_, i) => i !== index))
                                }}
                              >
                                Remove
                              </CButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <p
              style={{
                fontSize: '12px',
                marginTop: '14px',
                marginBottom: '4px',
                color: '#4b5563',
              }}
            >
              Kindly verify the above details before submission.
            </p>

            {/* TRANSACTION */}

            <div className="mt-3">
              <label>
                <strong>Transaction Number</strong>
              </label>

              <input
                className="form-control"
                value={txnNo}
                onChange={(e) => setTxnNo(e.target.value)}
              />
            </div>

            <div className="mt-3">
              <label>
                <strong>Transaction Date</strong>
              </label>

              <CFormInput
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>
          </>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>

        <CButton color="primary" disabled={loading} onClick={handleSubmit}>
          Submit
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SalaryDispatchModal
