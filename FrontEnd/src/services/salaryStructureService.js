import api from '../api/axios'

export const getActiveSalaryStructures = () => {
  return api.get('/salary-structure?is_active=true')
}

export const getSalaryStructureById = (id) => {
  const modelFilter = encodeURIComponent(
    JSON.stringify({
      empSalaryStructures: {
        effective_to: null,
      },
    }),
  )

  return api.get(
    `/salary-structure/${id}?models=empSalaryStructures.employee&sort=employee.first_name&modelFilter=${modelFilter}`,
  )
}
