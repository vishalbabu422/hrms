import api from "../api/axios";

export const getEmployeeAchievements = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/achievements`)
}

export const createEmployeeAchievement = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/achievements`, payload)
}

export const updateEmployeeAchievement = async (employeeId, achievementId, payload) => {
    return await api.patch(`/employee/${employeeId}/achievements/${achievementId}`, payload)
}