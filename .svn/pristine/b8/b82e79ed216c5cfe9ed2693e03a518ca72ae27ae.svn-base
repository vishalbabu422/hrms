import { validateFields } from '../utils/validator'

export const validateEmployeeSalaryRegister = (
  data,
  type = 'Employee Salary Register',
) => {
  const errors = {}

  // EMPLOYEE
  if (!data.employee_id) {
    errors.employee_id = `${type}: Employee is required`
  }

  // YEAR
  if (!data.year) {
    errors.year = `${type}: Year is required`
  } else if (data.year < 2020 || data.year > 2100) {
    errors.year = `${type}: Invalid year`
  }

  // MONTH
  if (!data.month) {
    errors.month = `${type}: Month is required`
  } else if (data.month < 1 || data.month > 12) {
    errors.month = `${type}: Month must be between 1-12`
  }

  // GROSS
  if (
    data.gross_earnings === '' ||
    data.gross_earnings === null ||
    data.gross_earnings === undefined
  ) {
    errors.gross_earnings = `${type}: Gross earnings is required`
  } else if (Number(data.gross_earnings) < 0) {
    errors.gross_earnings = `${type}: Gross earnings cannot be negative`
  }

  // DEDUCTIONS
  if (
    data.total_deductions === '' ||
    data.total_deductions === null ||
    data.total_deductions === undefined
  ) {
    errors.total_deductions = `${type}: Total deductions is required`
  } else if (Number(data.total_deductions) < 0) {
    errors.total_deductions = `${type}: Total deductions cannot be negative`
  }

  // NET SALARY
  if (
    data.net_salary === '' ||
    data.net_salary === null ||
    data.net_salary === undefined
  ) {
    errors.net_salary = `${type}: Net salary is required`
  } else if (Number(data.net_salary) < 0) {
    errors.net_salary = `${type}: Net salary cannot be negative`
  }

  // WORKING DAYS
  if (!data.working_days && data.working_days !== 0) {
    errors.working_days = `${type}: Working days is required`
  } else if (data.working_days < 0 || data.working_days > 31) {
    errors.working_days = `${type}: Working days must be between 0-31`
  }

  // PAID DAYS
  if (!data.paid_days && data.paid_days !== 0) {
    errors.paid_days = `${type}: Paid days is required`
  } else if (data.paid_days < 0 || data.paid_days > 31) {
    errors.paid_days = `${type}: Paid days must be between 0-31`
  }

  // LOP DAYS
  if (!data.lop_days && data.lop_days !== 0) {
    errors.lop_days = `${type}: LOP days is required`
  } else if (data.lop_days < 0 || data.lop_days > 31) {
    errors.lop_days = `${type}: LOP days must be between 0-31`
  }

  // STATUS
  if (!data.status) {
    errors.status = `${type}: Status is required`
  } else {
    const allowedStatus = ['PENDING', 'DISPATCHED', 'GENERATED']

    if (!allowedStatus.includes(data.status)) {
      errors.status = `${type}: Invalid status`
    }
  }

  // TRANSACTION NUMBER
  if (
    data.transaction_no &&
    data.transaction_no.length > 50
  ) {
    errors.transaction_no = `${type}: Transaction number too long`
  }

  return errors
}