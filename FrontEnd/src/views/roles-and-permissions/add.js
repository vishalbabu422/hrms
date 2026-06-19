import ModuleFormComponent from './form-component'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const existingModules =
        JSON.parse(localStorage.getItem('modules')) || []

      const normalizedModuleCode = payload.module_code
        .trim()
        .toUpperCase()

      // Check duplicate module_code (UNIQUE constraint simulation)
      const duplicate = existingModules.find(
        (m) => m.module_code === normalizedModuleCode
      )

      if (duplicate) {
        toast.error('Module Code already exists')
        return
      }

      const newModule = {
        id: Date.now(),
        module_name: payload.module_name.trim(),
        module_code: normalizedModuleCode,
        description: payload.description?.trim() || '',
        is_active: payload.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem(
        'modules',
        JSON.stringify([...existingModules, newModule])
      )

      toast.success('Module created successfully')
      navigate('/module')
    } catch (error) {
      console.error(error)
      toast.error('Failed to create Module')
    }
  }

  const initialData = {
    module_name: '',
    module_code: '',
    description: '',
    is_active: true,
  }

  return (
    <ModuleFormComponent
      initialData={initialData}
      mode="create"
      onSubmit={handleSubmit}
    />
  )
}

export default Add