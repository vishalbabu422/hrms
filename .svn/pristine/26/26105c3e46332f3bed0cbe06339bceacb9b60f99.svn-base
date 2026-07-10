import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CCol, CCardBody } from '@coreui/react'
import { getEmployeeHobbies } from "../../../services/employeeHobbies"

const HobbiesView = () => {
  const { employeeId } = useParams()

  const [hobbies, setHobbies] = useState([])
  const [loading, setLoading] = useState(false)

 const fetchHobbies = async () => {
  try {
    if (!employeeId) return   // ✅ ADD THIS LINE

    setLoading(true)

    const response = await getEmployeeHobbies(employeeId)

    const data = response.data?.data || response.data || []
    setHobbies(data)
  } catch (error) {
    console.error('Error fetching hobbies:', error)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchHobbies()
  }, [employeeId])

  return (
    <CCol xs={12} sm={12} md={9} lg={10}>
      <CCardBody style={{ minHeight: '400px' }}>
        {/* ===== Header ===== */}
        <div className="section-header mb-4">
          <div className="section-accent"></div>
          <h5 className="section-title">Hobbies</h5>
        </div>

       
        {loading && <p>Loading hobbies...</p>}

   
        {!loading && hobbies.length === 0 && (
          <p className="text-muted">No hobbies available</p>
        )}

       
        {!loading &&
          hobbies.length > 0 &&
          hobbies.map((item, index) => (
            <div className="mb-4" key={item.id || index}>
              <div className="row">
                <div className="col-12 col-md-6">
                  <small className="text-muted">Hobby</small>
                  <div className="fw-semibold border-bottom pb-2">
                    {item.hobby_name || item.hobby || 'N/A'}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <small className="text-muted">Remarks</small>
                  <div className="fw-semibold border-bottom pb-2">
                    {item.remarks || '-'}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </CCardBody>
    </CCol>
  )
}

export default HobbiesView