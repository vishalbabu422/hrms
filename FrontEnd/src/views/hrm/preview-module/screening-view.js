import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CButton, CCard, CCardHeader, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import Field from '../../components/field'
import { getEmployeeScreening } from '../../../services/employeeScreening'

const ScreeningView = () => {
  const { employeeId } = useParams()
  const [screening, setScreening] = useState({})

  useEffect(() => {
    if (!employeeId) return

    getEmployeeScreening(employeeId)
      .then((res) => {
         const data = res.data?.data[0] || {}

              setScreening({
          scheduledDate: data.test_scheduled_date,
          givenDate: data.test_given_date,
          marks: data.marks_secured,
          result: data.result || data.test_result || data.status,
          mail: data.screening_mail,
          mailName: data.screening_mail
            ? data.screening_mail.split('/').pop()
            : '',
        })
      })
      .catch((err) => {
        console.error('SCREENING ERROR:', err)
      })
  }, [employeeId])

  const resultValue = (screening.result || '').trim().toUpperCase()

  return (
    <div className="row g-4">
      <div className="col-12">
        <CCard className="border-0 shadow-sm">
          <CCardHeader className="bg-light fw-semibold">
            Screening Test
          </CCardHeader>

          <CCardBody>
            <div className="row g-4">

              <div className="col-md-6">
                <Field label="Test Scheduled Date" value={screening.scheduledDate} />
                <Field label="Marks Secured" value={screening.marks} />
              </div>

              <div className="col-md-6">
                <Field label="Test Given Date" value={screening.givenDate} />

                <div className="mb-4">
                  <small className="text-muted">Result</small>
                  <div
                    className={`fw-semibold border-bottom pb-2 ${
                      resultValue === 'PASS'
                        ? 'text-success'
                        : resultValue === 'FAIL'
                        ? 'text-danger'
                        : ''
                    }`}
                  >
                    {screening.result || '-'}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">Screening Mail Copy</small>
                    <div className="fw-semibold">
                      {screening.mailName || 'No document uploaded'}
                    </div>
                  </div>

                  {screening.mail && (
                    <CButton size="sm" variant="outline" href={screening.mail} download>
                      <CIcon icon={cilCloudDownload} />
                    </CButton>
                  )}
                </div>
              </div>

            </div>
          </CCardBody>
        </CCard>
      </div>
    </div>
  )
}

export default ScreeningView