import WorkOrderDesgnFormComponent from './form-component'

const Edit = () => {
  const initialData = {
    workOrderId: '',
    deployments: [],
  }

  const handleSubmit = (payload) => {
    console.log(payload)
  }

  return <WorkOrderDesgnFormComponent initialData={initialData} mode="edit" onSubmit={handleSubmit} />
}

export default Edit
