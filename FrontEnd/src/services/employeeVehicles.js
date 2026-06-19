import api from "../api/axios";

export const getEmployeeVehicles = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/vehicles`)
}

export const createEmployeeVehicle = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/vehicles`, payload)
}

export const updateEmployeeVehicle = async (employeeId, vehicleId, payload) => {
    return await api.patch(`/employee/${employeeId}/vehicles/${vehicleId}`, payload)
}