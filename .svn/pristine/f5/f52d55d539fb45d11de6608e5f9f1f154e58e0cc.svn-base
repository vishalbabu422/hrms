import api from '../api/axios'

export const getEmployeeVaccinations = async (employeeId) => {
  return await api.get(`/employee/${employeeId}/vaccination`)
}

export const createEmployeeVaccination = async (employeeId, payload) => {
  return await api.post(`/employee/${employeeId}/vaccination`, payload)
}

export const updateEmployeeVaccination = async (employeeId, vaccinationId, payload) => {
  return await api.patch(`/employee/${employeeId}/vaccination/${vaccinationId}`, payload)
}


