import api from "../api/axios";

export const getEmployeeDiscipline = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/discipline`)
}

export const createEmployeeDiscipline = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/discipline`, payload)
}

export const updateEmployeeDiscipline = async (employeeId, disciplineId, payload) => {
    return await api.patch(`/employee/${employeeId}/discipline/${disciplineId}`, payload)
}