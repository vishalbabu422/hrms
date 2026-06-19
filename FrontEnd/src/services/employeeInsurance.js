import api from '../api/axios'

export const getEmployeeInsurance = async (employeeId) => {
  return await api.get(`/employee/${employeeId}/insurance`)
}