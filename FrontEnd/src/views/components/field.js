import React from 'react'

const Field = ({ label, value, col, className }) => {
  const display =
    value !== undefined && value !== null && value !== ''
      ? value
      : '-'

  const wrapperClass = col ? `col-md-${col}` : className || 'mb-4'

  return (
    <div className={wrapperClass}>
      <small className="text-muted">{label}</small>
      <div className="fw-semibold border-bottom pb-2">
        {display}
      </div>
    </div>
  )
}

export default Field