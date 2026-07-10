import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCol,
  CCardBody,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'

import { getEmployeeSkills } from '../../../services/employeeSkills'

const SkillsView = () => {
  const { employeeId } = useParams()

  const [skillsData, setSkillsData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSkills = async () => {
    try {
      setLoading(true)

      const response = await getEmployeeSkills(employeeId)

      const data = response.data?.data || response.data || []
      setSkillsData(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
  if (employeeId) fetchSkills()
}, [employeeId])

  return (
    <CCol xs={12} md={10}>
      <CCardBody>
        <div className="section-header mb-4">
          <div className="section-accent"></div>
          <h5 className="section-title">Skill View</h5>
        </div>

        {loading && <p>Loading skills...</p>}

        {!loading && skillsData.length === 0 && <p className="text-muted">No skills available</p>}

        {!loading && skillsData.length > 0 && (
          <CAccordion alwaysOpen>
            {skillsData.map((item, index) => (
              <CAccordionItem
                itemKey={index}
                key={item.id || index}
                className="mb-3 border rounded-3 shadow-sm"
              >
                <CAccordionHeader>
                  <div className="fw-bold">{item.skill_name || 'N/A'}</div>
                </CAccordionHeader>

                <CAccordionBody>
                  <div className="row g-4">
                    <div className="col-12 col-md-6 ">
                      <small className="text-muted">Experience (Years)</small>
                      <div className="fw-semibold border-bottom pb-2">
                        {item.experience_years ?? ''}
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <small className="text-muted">Remarks</small>
                      <div className="fw-semibold border-bottom pb-2">{item.remarks || '-'}</div>
                    </div>
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            ))}
          </CAccordion>
        )}
      </CCardBody>
    </CCol>
  )
}

export default SkillsView
