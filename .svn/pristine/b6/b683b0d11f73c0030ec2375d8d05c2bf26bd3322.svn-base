import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CCol, CCardBody } from '@coreui/react'
import { getEmployeeExaminations } from '../../../services/employeeExaminations'

const ExamView = () => {
  const { employeeId } = useParams()

  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchExams = async () => {
    try {
      setLoading(true)

      const response = await getEmployeeExaminations(employeeId)

      const data = response.data?.data || response.data || []
      setExams(data)
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [employeeId])

  return (
    <CCol xs={12} sm={12} md={9} lg={10}>
      <CCardBody style={{ minHeight: '400px' }}>
        {/* Header */}
        <div className="section-header mb-4">
          <div className="section-accent"></div>
          <h5 className="section-title">Examination Details</h5>
        </div>

        {/* Loading */}
        {loading && <p>Loading examinations...</p>}

        {/* Empty */}
        {!loading && exams.length === 0 && (
          <p className="text-muted">No examination records found</p>
        )}

        {/* Data */}
        {!loading &&
          exams.length > 0 &&
          exams.map((item, index) => (
            <div key={item.id || index} className="mb-4">
              <div className="row g-4">
                {/* LEFT */}
                <div className="col-md-6">
                  <div className="mb-4">
                    <small className="text-muted">Examination Name</small>
                    <div className="fw-semibold border-bottom pb-2">
                      {item.examination.exam_name || '-'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <small className="text-muted">Marks Obtained</small>
                    <div className="fw-semibold border-bottom pb-2">
                      {item.marks_obtained ?? '-'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <small className="text-muted">Result</small>
                    <div
                      className={`fw-semibold border-bottom pb-2 ${
                        item.result === 'Pass'
                          ? 'text-success'
                          : item.result === 'Fail'
                          ? 'text-danger'
                          : ''
                      }`}
                    >
                      {item.result_status || '-'}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="col-md-6">
                  <div className="mb-4">
                    <small className="text-muted">Exam Date</small>
                    <div className="fw-semibold border-bottom pb-2">
                      {item.exam_date
                        ? new Date(item.exam_date).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <small className="text-muted">Certificate Number</small>
                    <div className="fw-semibold border-bottom pb-2">
                      {item.certificate_number || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </CCardBody>
    </CCol>
  )
}

export default ExamView