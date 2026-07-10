export const validateWorkOrderMilestone = (replicas) => {
  const errors = []

  replicas.forEach((r, index) => {
    const err = {}

    if (
      r.deployment_from &&
      r.deployment_to &&
      new Date(r.deployment_from) > new Date(r.deployment_to)
    ) {
      err.deployment_to = 'To date must be after From date'
    }

    if (
      r.deployment_from &&
      r.deployment_to &&
      new Date(r.deployment_from) > new Date(r.deployment_to)
    ) {
      err.deployment_to = 'To date must be after From date'
    }

    if (!r.duration_days) {
      err.duration_days = 'Duration is required'
    }

    errors[index] = err
  })

  return errors
}
