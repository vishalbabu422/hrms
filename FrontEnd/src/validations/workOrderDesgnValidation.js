export const validateWorkOrderDesgn = (replicas) => {
  const errors = []

  replicas.forEach((r, index) => {
    const err = {}

    if (!r.sac_code) {
      err.sac_code = 'GST Code is required'
    }

    if (!r.desgn_id_fk) {
      err.desgn_id_fk = 'Designation is required'
    }

    if (!r.req_person_count || Number(r.req_person_count) <= 0) {
      err.req_person_count = 'Enter valid persons'
    }

    if (!r.deployment_from) {
      err.deployment_from = 'From date is required'
    }

    if (!r.deployment_to) {
      err.deployment_to = 'To date is required'
    }

    if (r.deployment_from && r.deployment_to) {
      if (new Date(r.deployment_from) > new Date(r.deployment_to)) {
        err.deployment_to = 'To date must be after From'
      }
    }

    if (!r.duration_days || r.duration_days === '') {
      err.duration_days = 'Duration is required'
    }

    errors[index] = err
  })

  return errors
}
