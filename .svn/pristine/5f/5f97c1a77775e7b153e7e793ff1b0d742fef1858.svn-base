import api from '../api/axios'
export const getEmployees = async () => {
    return await api.get(`/employee?models=EmployeeRoles.RoleMaster
&fields=id,first_name,email,employee_code
&is_active=true
&modelFilter={
  "EmployeeRoles": { "attributes": ["id", "role_id"] },
  "RoleMaster": { "attributes": ["id","role_name","role_code"],"is_active": true }
}`)
}

export const getEmployeesRoles = async () => {
    return await api.get(`/employee?models=EmployeeRoles.RoleMaster
&fields=id,first_name,email,employee_code
&is_active=true
&modelFilter={
  "EmployeeRoles": { "required": true, "attributes": ["id", "role_id"] },
  "RoleMaster": { "attributes": ["id","role_name","role_code"],"is_active": true }
}`);
}

export const assignRoleToEmployee = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/roles`, payload);
};

export const deleteRoleToEmployee = async (employeeId) => {
    return await api.delete(`/employee/${employeeId}/roles`);
};

