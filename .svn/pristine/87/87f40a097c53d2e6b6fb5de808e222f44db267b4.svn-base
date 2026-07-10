import api from '../api/axios'

export const getDivisions = async () => {
  return await api.get('/division?is_active=true&sort=division_name&fields=id%2Cdivision_name')
}

export const getDesignations = async () => {
  return await api.get(
    '/designation?is_active=true&sort=designation_name&fields=id%2Cdesignation_name',
  )
}

export const createEmployee = async (payload) => {
  return await api.post('/employee', payload)
}
