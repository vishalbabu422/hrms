import React from 'react'

const BasicInfo = ({ employee }) => {
  if (!employee) return null

  return (
    <div className="row g-4">
      {/* LEFT COLUMN */}
      <div className="col-md-6">
        <Field label="Salutation" value={employee.salutation} />
        <Field label="Middle Name" value={employee.middleName} />
        <Field label="Employee Type" value={employee.employeeType} />
        <Field label="Division" value={employee.division} />
        <Field label="State of Working" value={employee.stateOfWorking} />
        <Field label="Email Address" value={employee.email} />
        <Field label="Date of Birth" value={employee.dob} />
        <Field label="Mother's Name" value={employee.motherName} />
        <Field label="Gender" value={employee.gender} />
        <Field label="Probation End Date" value={employee.probationEnd} />
        <Field label="Relieving Date" value={employee.relievingDate} />
        <Field label="Notice Period (Days)" value={employee.noticePeriod} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-md-6">
        <Field label="First Name" value={employee.firstName} />
        <Field label="Last Name" value={employee.lastName} />
        <Field label="Designation" value={employee.designation} />
        <Field label="Mode of Working" value={employee.modeOfWorking} />
        <Field label="Employee Category" value={employee.category} />
        <Field label="Contact No" value={employee.contact} />
        <Field label="Father's Name" value={employee.fatherName} />
        <Field label="Marital Status" value={employee.maritalStatus} />
        <Field label="Date Of Joining" value={employee.joiningDate} />
        <Field label="Confirmation Date" value={employee.confirmationDate} />
        <Field label="Resignation Date" value={employee.resignationDate} />
        <Field label="Gazetted" value={employee.gazetted ? 'Yes' : 'No'} />
      </div>
    </div>
  )
}

// reusable field
const Field = ({ label, value }) => (
  <div className="mb-4">
    <small className="text-muted">{label}</small>
    <div className="fw-semibold border-bottom pb-2">{value || '-'}</div>
  </div>
)

export default BasicInfo