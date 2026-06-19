import api from '../api/axios'

export const getEmployeeQualifications = async (employeeId) => {
  return await api.get(
    `/employee/${employeeId}?models=EmployeeQualifications&modelFilter={}`
  )
}