import api from "../api/axios";

export const getEmployeeHealth = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/health`)
}

export const createEmployeeHealth = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/health`, payload)
}

export const updateEmployeeHealth = async (employeeId, payload) => {
    return await api.patch(`/employee/${employeeId}/health`, payload)
}
