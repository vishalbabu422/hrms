import api from "../api/axios";

export const getEmployeeLanguages = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/languages`)
}

export const createEmployeeLanguage = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/languages`, payload)
}

export const updateEmployeeLanguage = async (employeeId, languageId, payload) => {
    return await api.patch(`/employee/${employeeId}/languages/${languageId}`, payload)
}