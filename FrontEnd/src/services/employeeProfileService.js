import api from '../api/axios'

export const getEmployeeById = async (id) => {
  return await api.get(`/employee/${id}`, {
    params: {
      models:
        'EmployeeDetail,EmployeeFamilyMembers,employeeDesignations.designation,employeeDivisions.division,Documents',
    },
  })
}