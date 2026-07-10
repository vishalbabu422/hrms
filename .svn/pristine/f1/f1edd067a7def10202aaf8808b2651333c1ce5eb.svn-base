import SalaryAddonFormComponent from './form-component'
import api from '../../api/axios'

import { toast } from 'react-toastify'

import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()

  const initialData = {
    name: '',
    code: '',
    description: '',
    addon_type: '',
    taxable: true,
    affects_pf: false,
    affects_esi: false,
    recurring_allowed: true,
    is_active: true,
  }

 const handleSubmit = async (payload) => {
  try {
    console.log('PAYLOAD : ', payload)

    const normalizedPayload = {
      ...payload,
    }

    await api.post(
      '/salary-addon-master/create',
      normalizedPayload,
    )

    toast.success('Salary Addon created successfully')

    navigate('/salary-addon')
  } catch (error) {
    console.error(error)

    console.log(error.response?.data)

    toast.error(
      error.response?.data?.message ||
        'Failed to create Salary Addon',
    )
  }
}

  return (
    <SalaryAddonFormComponent
      initialData={initialData}
      mode="create"
      onSubmit={handleSubmit}
    />
  )
}

export default Add