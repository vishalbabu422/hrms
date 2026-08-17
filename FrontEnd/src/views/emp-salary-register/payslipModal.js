import { CModal, CModalBody, CModalFooter, CButton } from '@coreui/react'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios'

const PayslipModal = ({
  visible,
  onClose,
  employeeId,
  month,
  year,
  salaryStructureId,
  onGenerate,
}) => {
  const [salaryData, setSalaryData] = useState(null)

  const [loading, setLoading] = useState(false)

  const monthYearLabel = new Date(year, month - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  const fetchSalaryData = async () => {
    try {
      setLoading(true)

      const res = await api.post('employee-salary-register-monthly/generate', {
        employee_id: employeeId,
        month,
        year,
        salary_structure_id: salaryStructureId,
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
    }
  }, [visible, employeeId, month, year, salaryStructureId])

  const handleGenerateClick = async () => {
    if (!salaryData?.register_id) {
      toast.error('Register ID not found')
      return
    }

    await onGenerate?.(salaryData.register_id)
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalBody
        style={{
          padding: '30px',
          background: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h5 className="mb-0">Payslip</h5>

          <strong>{monthYearLabel}</strong>
        </div>

        <hr />

        <div className="mb-3">
          <p className="mb-1">
            <strong>Employee Name:</strong> {salaryData?.employee_name}
          </p>

          <p className="mb-1">
            <strong>Transaction Number:</strong> {salaryData?.transaction_number || '-'}
          </p>

          <p className="mb-1">
            <strong>Status:</strong> {salaryData?.status || '-'}
          </p>
        </div>

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
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Earnings & Deductions
              </th>
            </tr>

            <tr>
              <th
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Component
              </th>

              <th
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                  textAlign: 'right',
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
                  padding: '8px',
                  background: '#f3f4f6',
                }}
              >
                <strong>Earnings</strong>
              </td>
            </tr>

            {salaryData?.components
              ?.filter((component) => component.type === 'EARNING')
              .map((component, index) => (
                <tr key={`${component.component_id}-earning-${index}`}>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '8px',
                    }}
                  >
                    {component.name}
                  </td>

                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '8px',
                      textAlign: 'right',
                    }}
                  >
                    ₹ {Number(component.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))}

            {/* ================= GROSS EARNINGS ================= */}

            <tr>
              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                }}
              >
                <strong>Gross Earnings</strong>
              </td>

              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                  textAlign: 'right',
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
                  padding: '8px',
                  background: '#f3f4f6',
                }}
              >
                <strong>Deductions</strong>
              </td>
            </tr>

            {/* ================= LEAVE DEDUCTION ================= */}

            <tr>
              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                }}
              >
                Leave
              </td>

              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                  textAlign: 'right',
                }}
              >
                ₹ {Number(salaryData?.leave_deduction || 0).toFixed(2)}
              </td>
            </tr>

            {/* ================= SALARY DEDUCTION COMPONENTS ================= */}

            {salaryData?.components
              ?.filter((component) => component.type === 'DEDUCTION')
              .map((component, index) => (
                <tr key={`${component.component_id}-deduction-${index}`}>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '8px',
                    }}
                  >
                    {component.name}
                  </td>

                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '8px',
                      textAlign: 'right',
                    }}
                  >
                    ₹ {Number(component.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))}

            {/* ================= TOTAL DEDUCTIONS ================= */}

            <tr>
              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                }}
              >
                <strong>Total Deductions</strong>
              </td>

              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                  textAlign: 'right',
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
                  padding: '8px',
                }}
              >
                <strong>Net Salary</strong>
              </td>

              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                  textAlign: 'right',
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
                  padding: '8px',
                }}
              >
                <strong>CTC</strong>
              </td>

              <td
                style={{
                  border: '1px solid #000',
                  padding: '8px',
                  textAlign: 'right',
                }}
              >
                <strong>₹ {Number(salaryData?.ctc || 0).toFixed(2)}</strong>
              </td>
            </tr>

            {/* ================= ADDONS HEADING ================= */}

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
                    Add-Ons
                  </th>
                </tr>
              </>
            )}

            {/* ================= ADDONS ================= */}

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
                    textAlign: 'right',
                  }}
                >
                  ₹ {Number(addon.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: '20px',
            fontSize: '12px',
          }}
        >
          This is a system generated payslip.
        </div>
      </CModalBody>

      <CModalFooter>
        {!salaryData?.salaryslip_generated && (
          <CButton color="primary" onClick={handleGenerateClick} disabled={loading}>
            Generate
          </CButton>
        )}

        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default PayslipModal
