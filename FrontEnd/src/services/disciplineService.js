import api from '../api/axios'

export const getEmployeeDiscipline = (employeeId) => {
  return api.get(`/employee/${employeeId}/discipline`)
}
