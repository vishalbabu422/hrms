import React, { useMemo } from 'react'
import { CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBuilding, cilCalendar } from '@coreui/icons'

const DivisionView = ({ divisions }) => {
  // Use the division history received from the employee API.
  const divisionData = divisions || []

  // Prepare the division history and keep the current division first.
  const normalizedDivisions = useMemo(() => {
    return [...divisionData]
      .map((item) => ({
        id: item.id || item.division_id || item.id_fk,

        divisionId: item.division_id || item.division?.id,

        division:
          item.division?.division_name ||
          item.division_name ||
          item.division?.name ||
          item.name ||
          '-',

        effectiveFrom:
          item.effective_from || item.from_date || item.start_date || item.date_from || null,

        effectiveTo: item.effective_to || item.to_date || item.end_date || item.date_to || null,

        isCurrent: item.is_current === true,
      }))
      .sort((a, b) => {
        // Always keep the current division at the top.
        if (a.isCurrent && !b.isCurrent) return -1
        if (!a.isCurrent && b.isCurrent) return 1

        // For previous divisions, the most recently ended
        // division should appear first.
        if (!a.isCurrent && !b.isCurrent) {
          return new Date(b.effectiveTo || 0) - new Date(a.effectiveTo || 0)
        }

        return 0
      })
  }, [divisionData])

  // Separate the current division from the previous divisions.
  const currentDivision = normalizedDivisions.find((item) => item.isCurrent)

  const previousDivisions = normalizedDivisions.filter((item) => !item.isCurrent)

  // Format dates in a readable format.
  const formatDate = (date) => {
    if (!date) return 'Present'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Calculate how long the employee was associated with a division.
  const calculateDuration = (from, to) => {
    if (!from) return '-'

    const start = new Date(from)
    const end = to ? new Date(to) : new Date()

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return '-'
    }

    let months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

    if (end.getDate() < start.getDate()) {
      months--
    }

    if (months < 0) return '-'

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0 && remainingMonths > 0) {
      return `${years} Yr${years > 1 ? 's' : ''} ${remainingMonths} Mo${
        remainingMonths > 1 ? 's' : ''
      }`
    }

    if (years > 0) {
      return `${years} Yr${years > 1 ? 's' : ''}`
    }

    return `${remainingMonths} Mo${remainingMonths !== 1 ? 's' : ''}`
  }

  return (
    <CCard className="border-0 shadow-sm">
      <CCardBody>
        {/* Page heading */}
        <div className="mb-4">
          <h4 className="fw-semibold mb-1" style={{ color: '#1f2937' }}>
            Division History
          </h4>

          <div className="text-muted" style={{ fontSize: '14px' }}>
            Complete history of divisions the employee has been associated with.
          </div>
        </div>

        {/* Current division */}
        {currentDivision && (
          <div
            className="mb-4"
            style={{
              border: '1px solid #b7e5ca',
              borderRadius: '8px',
              background: '#f8fffb',
              padding: '12px 18px',
            }}
          >
            {/* Current division header */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span
                style={{
                  background: '#dff7e8',
                  color: '#198754',
                  borderRadius: '5px',
                  padding: '4px 9px',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.2px',
                }}
              >
                CURRENT DIVISION
              </span>

              <span
                style={{
                  background: '#e2f7e9',
                  color: '#198754',
                  borderRadius: '5px',
                  padding: '4px 11px',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                ● Current
              </span>
            </div>

            {/* Current division details */}
            <div
              className="d-flex align-items-center"
              style={{
                minHeight: '55px',
              }}
            >
              {/* Division name */}
              <div
                className="d-flex align-items-center"
                style={{
                  width: '42%',
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#e5f8ec',
                    color: '#198754',
                    flexShrink: 0,
                  }}
                >
                  <CIcon icon={cilBuilding} size="sm" />
                </div>

                <div>
                  <div
                    className="fw-semibold"
                    style={{
                      fontSize: '14px',
                      color: '#1f2937',
                    }}
                  >
                    {currentDivision.division}
                  </div>

                  <div
                    className="text-muted"
                    style={{
                      fontSize: '11px',
                    }}
                  >
                    Current Division
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '38px',
                  width: '1px',
                  background: '#d8eee0',
                  marginRight: '30px',
                }}
              />

              {/* Effective from */}
              <div
                style={{
                  width: '28%',
                }}
              >
                <div
                  className="text-muted"
                  style={{
                    fontSize: '11px',
                    marginBottom: '3px',
                  }}
                >
                  Effective From
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CIcon
                    icon={cilCalendar}
                    size="sm"
                    style={{
                      color: '#6b7280',
                    }}
                  />

                  <strong
                    style={{
                      fontSize: '13px',
                      color: '#1f2937',
                    }}
                  >
                    {formatDate(currentDivision.effectiveFrom)}
                  </strong>
                </div>
              </div>

              {/* Effective to */}
              <div
                style={{
                  width: '28%',
                }}
              >
                <div
                  className="text-muted"
                  style={{
                    fontSize: '11px',
                    marginBottom: '3px',
                  }}
                >
                  Effective To
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CIcon
                    icon={cilCalendar}
                    size="sm"
                    style={{
                      color: '#6b7280',
                    }}
                  />

                  <strong
                    style={{
                      fontSize: '13px',
                      color: '#198754',
                    }}
                  >
                    Present
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previous division heading */}
        <div className="mb-3">
          <h5
            className="fw-semibold mb-0"
            style={{
              fontSize: '18px',
              color: '#1f2937',
            }}
          >
            Previous Division History
          </h5>
        </div>

        {/* Previous division history */}
        {previousDivisions.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {previousDivisions.map((item, index) => (
              <div
                key={item.id || index}
                className="d-flex align-items-center"
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#ffffff',
                  padding: '12px 16px',
                }}
              >
                {/* Division icon */}
                <div
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    color: '#5b5bd6',
                    flexShrink: 0,
                  }}
                >
                  <CIcon icon={cilBuilding} size="sm" />
                </div>

                {/* Division name */}
                <div
                  style={{
                    minWidth: '240px',
                    flex: 1,
                  }}
                >
                  <div
                    className="fw-semibold"
                    style={{
                      fontSize: '14px',
                      color: '#1f2937',
                    }}
                  >
                    {item.division}
                  </div>

                  <div
                    className="text-muted mt-1"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Previous Division
                  </div>
                </div>

                {/* Effective period */}
                <div
                  style={{
                    minWidth: '300px',
                  }}
                >
                  <div
                    className="text-muted"
                    style={{
                      fontSize: '11px',
                    }}
                  >
                    Effective Period
                  </div>

                  <div
                    className="d-flex align-items-center gap-2 mt-1"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    <CIcon icon={cilCalendar} size="sm" />

                    <strong>{formatDate(item.effectiveFrom)}</strong>

                    <span className="text-muted">→</span>

                    <strong>{formatDate(item.effectiveTo)}</strong>
                  </div>
                </div>

                {/* Duration */}
                <div
                  className="text-end"
                  style={{
                    minWidth: '110px',
                  }}
                >
                  <div
                    className="text-muted"
                    style={{
                      fontSize: '11px',
                    }}
                  >
                    Duration
                  </div>

                  <div
                    className="fw-semibold mt-1"
                    style={{
                      fontSize: '13px',
                      color: '#374151',
                    }}
                  >
                    {calculateDuration(item.effectiveFrom, item.effectiveTo)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center text-muted py-4"
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          >
            No previous division history available.
          </div>
        )}

        {/* Total number of division assignments */}
        <div
          className="mt-3 text-muted"
          style={{
            fontSize: '12px',
          }}
        >
          Total Assignments: <strong>{normalizedDivisions.length}</strong>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default DivisionView
