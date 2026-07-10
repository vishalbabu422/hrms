
class EmployeeMprUtils {
  /**
   * Get employee designation for MPR
   * Prefers: employeeWorkOrderDeployment -> WoDesgnMapping -> EmpanelmentDesignation
   * Returns "-" if not found
   *
   * @param {Object} employee - Sequelize Employee instance
   * @returns {string}
   */
 static getDesignation(employee) {
  if (!employee) return "-";
  console.log(
  "CATEGORY =>",
  designation
);

console.log(
  "EMPLOYEE DEPLOYMENT =>",
  JSON.stringify(
    emp.employeeWorkOrderDeployment,
    null,
    2
  )
);
  return (
    employee?.employeeWorkOrderDeployment
      ?.WoDesgnMapping
      ?.Designation
      ?.designation || "-"
  );
}
  
}
  module.exports = EmployeeMprUtils;