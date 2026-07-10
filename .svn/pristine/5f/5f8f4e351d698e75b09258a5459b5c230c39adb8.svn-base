import api from "../api/axios";

export const getEmployeeTrainings = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/trainings`)
}

export const createEmployeeTraining = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/trainings`, payload)
}

export const updateEmployeeTraining = async (employeeId, trainingId, payload) => {
    return await api.patch(`/employee/${employeeId}/trainings/${trainingId}`, payload)
}