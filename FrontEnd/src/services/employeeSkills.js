import api from "../api/axios";

/* GET SKILLS */
export const getEmployeeSkills = async (employeeId) => {
    return await api.get(`/employee/${employeeId}/skills`)
}


/* CREATE SKILL */
export const createEmployeeSkill = async (employeeId, payload) => {
    return await api.post(`/employee/${employeeId}/skills`, payload)
}

/* UPDATE SKILL */
export const updateEmployeeSkill = async (employeeId, skillId, payload) => {
    return await api.patch(`/employee/${employeeId}/skills/${skillId}`, payload)
}


