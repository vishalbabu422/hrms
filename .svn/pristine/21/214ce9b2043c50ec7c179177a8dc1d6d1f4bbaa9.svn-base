import api from "../api/axios";

export const getEmployeeAssets = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/assets`)
}

export const createEmployeeAsset = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/assets`, payload)
}

export const updateEmployeeAsset = async (employeeId, assetId, payload) => {
    return await api.patch(`/employee/${employeeId}/assets/${assetId}`, payload)
}