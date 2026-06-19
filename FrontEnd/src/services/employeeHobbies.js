import api from "../api/axios";

export const getEmployeeHobbies = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/hobbies`)
}

export const createEmployeeHobby = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/hobbies`, payload)
}

export const updateEmployeeHobby = async (employeeId, hobbyId, payload) => {
    return await api.patch(`/employee/${employeeId}/hobbies/${hobbyId}`, payload)
}