import api from "../api/axios";

export const getEmployeePassportVisa = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/passport-visa`)
}

export const createEmployeePassportVisa = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/passport-visa`, payload)
}

export const updateEmployeePassportVisa = async (employeeId, passportVisaeId, payload) => {
    return await api.patch(`/employee/${employeeId}/passport-visa/${passportVisaeId}`, payload)
}