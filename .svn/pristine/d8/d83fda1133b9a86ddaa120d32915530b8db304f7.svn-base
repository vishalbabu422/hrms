import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import { getEmployeeHealth } from '../../../services/employeeHealth'
import { getEmployeeVaccinations } from '../../../services/employeeVaccination'

const HealthView = () => {
  const { employeeId } = useParams()

  const [health, setHealth] = useState({})
  const [vaccination, setVaccination] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      if (!employeeId) return // ✅ prevents crash

      setLoading(true)

      const [healthRes, vaccinationRes] = await Promise.all([
        getEmployeeHealth(employeeId),
        getEmployeeVaccinations(employeeId),
      ])

      setHealth(healthRes.data?.data || {})

      const vacData = vaccinationRes.data?.data || []
      setVaccination(Array.isArray(vacData) ? vacData : [vacData])

    } catch (error) {
      console.error('Error fetching health/vaccination:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [employeeId])

  return (
    <CCol xs={12} md={10}>
      <CCardBody>

        {/* Header */}
        <div className="section-header mb-4">
          <div className="section-accent"></div>
          <h5 className="section-title">Health</h5>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            {/* ================= HEALTH ================= */}
            <CCard className="border-0 shadow-sm mb-4">
              <CCardHeader className="bg-light fw-semibold">
                Health Details
              </CCardHeader>

              <CCardBody>
                {Object.keys(health).length === 0 ? (
                  <p className="text-muted">No health data available</p>
                ) : (
                  <div className="row g-4">

                    <div className="col-md-6">
                      <small className="text-muted">Height (cm)</small>
                      <div className="fw-semibold border-bottom pb-2">
                        {health.height_cm ?? '-'}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <small className="text-muted">Weight (kg)</small>
                      <div className="fw-semibold border-bottom pb-2">
                        {health.weight_kg ?? '-'}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <small className="text-muted">Has Health Issues</small>
                      <div className="fw-semibold border-bottom pb-2">
                        {health.has_health_issues ? 'Yes' : 'No'}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <small className="text-muted">Is Handicapped</small>
                      <div className="fw-semibold border-bottom pb-2">
                        {health.is_handicapped ? 'Yes' : 'No'}
                      </div>
                    </div>

                    <div className="col-12">
                      <small className="text-muted">Identification Mark</small>
                      <div className="fw-semibold border-bottom pb-2">
                        {health.identification_mark || '-'}
                      </div>
                    </div>

                  </div>
                )}
              </CCardBody>
            </CCard>

            {/* ================= VACCINATION ================= */}
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-light fw-semibold">
                Vaccination Details
              </CCardHeader>

              <CCardBody>
                {vaccination.length === 0 ? (
                  <p className="text-muted">No vaccination data available</p>
                ) : (
                  vaccination.map((v, index) => (
                    <div className="row g-4 mb-3" key={index}>

                      <div className="col-md-4">
                        <small className="text-muted">Vaccination Name</small>
                        <div className="fw-semibold border-bottom pb-2">
                          {v.vaccination_name || '-'}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <small className="text-muted">Vaccination Date</small>
                        <div className="fw-semibold border-bottom pb-2">
                          {v.vaccination_date || '-'}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">Document</small>
                            <div className="fw-semibold">
                              {v.vaccination_document_name || 'No document'}
                            </div>
                          </div>

                          {v.vaccination_document && (
                            <CButton
                              size="sm"
                              href={v.vaccination_document}
                              download
                            >
                              <CIcon icon={cilCloudDownload} />
                            </CButton>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </CCardBody>
            </CCard>

          </>
        )}
      </CCardBody>
    </CCol>
  )
}

export default HealthView