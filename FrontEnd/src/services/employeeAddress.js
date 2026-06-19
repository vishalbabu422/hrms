import api from '../api/axios'

export const getEmployeeAddresses = async (employeeId) => {
  return await api.get(
    `/employee/${employeeId}?models=EmployeeAddresses&modelFilter={}`
  )
}