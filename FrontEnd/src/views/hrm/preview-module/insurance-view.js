import React, { useEffect, useState } from 'react'
import { formatDate } from '../../../utils/dateUtils'
import { useParams } from 'react-router-dom'
import { CCard, CCardHeader, CCardBody, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import Field from '../../components/field'
import { getEmployeeInsurance } from '../../../services/employeeInsurance'

const InsuranceView = () => {
  const { employeeId } = useParams()

  const [insuranceList, setInsuranceList] = useState([])

  useEffect(() => {
    if (!employeeId) return

    getEmployeeInsurance(employeeId)
      .then((res) => {
        const list = res.data?.data || []
        setInsuranceList(list)
      })
      .catch((err) => {
        console.error('INSURANCE ERROR:', err)
      })
  }, [employeeId])

  return (
    <div className="row g-4">
      {insuranceList.length === 0 ? (
        <div className="text-muted">No insurance data found</div>
      ) : (
        insuranceList.map((item, index) => (
          <div className="col-12" key={index}>
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-light fw-semibold">Insurance</CCardHeader>

              <CCardBody>
                <div className="row g-4">
                  {/* LEFT */}
                  <div className="col-md-6">
                    <Field label="Insurance Company" value={item.insurance_company} />
                    <Field label="From Date" value={formatDate(item.from_date)} />
                    <Field label="Sum Insured" value={item.sum_insured} />
                    <Field label="Family Members Covered" value={item.family_members_covered} />
                  </div>

                  {/* RIGHT */}
                  <div className="col-md-6">
                    <Field label="Policy Number" value={item.policy_number} />
                    <Field label="To Date" value={formatDate(item.to_date)} />
                    <Field label="Policy Premium" value={item.policy_premium} />
                    {/* DOCUMENT */}
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">Policy Document</small>
                          <div className="fw-semibold">
                            {item.policy_document
                              ? item.policy_document.split('/').pop()
                              : 'No document uploaded'}
                          </div>
                        </div>

                        {item.policy_document && (
                          <CButton size="sm" variant="outline" href={item.policy_document} download>
                            <CIcon icon={cilCloudDownload} />
                          </CButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </div>
        ))
      )}
    </div>
  )
}

export default InsuranceView
