export const validateBulkTransactions = ({
  salaryData,
  selectedEmployees,
  employeeTransactions,
}) => {
  const selectedEmployeeData = salaryData.filter((item) => selectedEmployees.includes(item.id))

  for (const employee of selectedEmployeeData) {
    const transaction = employeeTransactions?.[employee.id]

    if (!transaction?.transaction_number) {
      return {
        isValid: false,

        message: `Transaction Number missing for ${employee.first_name} ${employee.middle_name || ''} ${employee.last_name || ''}`,
      }
    }

    if (!transaction?.transaction_date) {
      return {
        isValid: false,

        message: `Transaction Date missing for ${employee.first_name} ${employee.middle_name || ''} ${employee.last_name || ''}`,
      }
    }
  }

  return {
    isValid: true,

    message: '',
  }
}
