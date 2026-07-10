import { CButton, CFormInput, CFormTextarea, CFormCheck } from '@coreui/react'

import { useState, useEffect } from 'react'

import {
  getEmployeeHealth,
  createEmployeeHealth,
  updateEmployeeHealth,
} from '../../../../services/employeeHealth'

import {
  getEmployeeVaccinations,
  createEmployeeVaccination,
  updateEmployeeVaccination,
} from '../../../../services/employeeVaccination'
import { validateHealth } from '../../../../validations/healthValidation'

const HealthStep = ({ state, dispatch, employeeId }) => {
  const [errors, setErrors] = useState({})
  const { health, vaccinations } = state

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const res = await getEmployeeHealth(employeeId)

        dispatch({
          type: 'SET_HEALTH',
          payload: res.data.data || {},
        })
      } catch (err) {
        console.error(err)
      }
    }

    const loadVaccinations = async () => {
      try {
        const res = await getEmployeeVaccinations(employeeId)

        dispatch({
          type: 'SET_VACCINATIONS',
          payload: res.data.data?.length
            ? res.data.data
            : [{ vaccination_name: '', vaccination_date: '' }],
        })
      } catch (err) {
        console.error(err)
      }
    }

    loadHealth()
    loadVaccinations()
  }, [employeeId])

  const saveHealth = async () => {
    try {
      if (health.id) {
        await updateEmployeeHealth(employeeId, health)
      } else {
        await createEmployeeHealth(employeeId, health)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const saveVaccination = async (vaccine) => {
    try {
      if (vaccine.id) {
        await updateEmployeeVaccination(employeeId, vaccine.id, vaccine)
      } else {
        await createEmployeeVaccination(employeeId, vaccine)
      }
    } catch (err) {
      console.error(err)
    }
  }

  //   const handleNext = async () => {
  //     await saveHealth()

  //     const validVaccinations = vaccinations.filter((v) => v.vaccination_name || v.vaccination_date)

  //     for (const v of validVaccinations) {
  //       await saveVaccination(v)
  //     }

  //     dispatch({
  //       type: 'SET_STEP',
  //       payload: state.step + 1,
  //     })
  //   }

  const handleNext = async () => {
    const validationErrors = validateHealth(health)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fill required health details')
      return
    }

    await saveHealth()

    const validVaccinations = vaccinations.filter((v) => v.vaccination_name || v.vaccination_date)

    for (const v of validVaccinations) {
      await saveVaccination(v)
    }

    dispatch({
      type: 'SET_STEP',
      payload: state.step + 1,
    })
  }

  return (
    <div className="step-content">
      {/* ================= HEALTH SECTION ================= */}

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light fw-semibold">Health Details</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <CFormInput
                label="Height (cm)"
                type="number"
                value={health.height_cm || ''}
                placeholder="Enter height in cm"
                min="0"
                step="0.01"
                className={errors?.height_cm ? 'is-invalid' : ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    section: 'health',
                    field: 'height_cm',
                    value: e.target.value,
                  })
                }
              />
            </div>
          
            <div className="col-md-6">
              <CFormInput
                label="Weight (kg)"
                type="number"
                value={health.weight_kg || ''}
                 placeholder="Enter weight"
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    section: 'health',
                    field: 'weight_kg',
                    value: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <CFormCheck
                label="Has Health Issues"
                checked={health.has_health_issues || false}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    section: 'health',
                    field: 'has_health_issues',
                    value: e.target.checked,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <CFormCheck
                label="Is Physically Handicapped"
                checked={health.is_handicapped || false}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    section: 'health',
                    field: 'is_handicapped',
                    value: e.target.checked,
                  })
                }
              />
            </div>

            {health.isHandicapped && (
              <div className="col-md-6">
                <CFormInput
                  label="Disability Category"
                  value={health.physical_disability_category || ''}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_FIELD',
                      section: 'health',
                      field: 'physical_disability_category',
                      value: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {health.hasHealthIssues && (
              <div className="col-md-12">
                <CFormTextarea
                  label="Health Issue Remarks"
                  rows={3}
                  value={health.health_issue_remarks || ''}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_FIELD',
                      section: 'health',
                      field: 'health_issue_remarks',
                      value: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="col-md-12">
              <CFormTextarea
                label="Identification Mark"
                rows={2}
                value={health.identification_mark || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    section: 'health',
                    field: 'identification_mark',
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= VACCINATION SECTION ================= */}

      <div className="card shadow-sm">
        <div className="card-header bg-light fw-semibold">Vaccination Details</div>

        <div className="card-body">
          {vaccinations.map((v, index) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <CFormInput
                    label="Vaccination Name"
                    value={v.vaccination_name}
                     placeholder="Enter vaccination name "
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_ITEM',
                        section: 'vaccinations',
                        index: index,
                        field: 'vaccination_name',
                        value: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <CFormInput
                    label="Vaccination Date"
                    type="date"
                    value={v.vaccination_date}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_ITEM',
                        section: 'vaccinations',
                        index: index,
                        field: 'vaccination_date',
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {vaccinations.length > 1 && (
                <div className="text-end mt-2">
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() =>
                      dispatch({
                        type: 'REMOVE_ITEM',
                        section: 'vaccinations',
                        index: index,
                      })
                    }
                  >
                    Remove
                  </CButton>
                </div>
              )}
            </div>
          ))}

          <CButton
            className="btn btn-outline-primary"
            onClick={() =>
              dispatch({
                type: 'ADD_ITEM',
                section: 'vaccinations',
                payload: {
                  vaccination_name: '',
                  vaccination_date: '',
                },
              })
            }
          >
            + Add Vaccination
          </CButton>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <CButton
          color="light"
          className="btn btn-outline-secondary"
          onClick={() =>
            dispatch({
              type: 'SET_STEP',
              payload: state.step - 1,
            })
          }
        >
          Previous
        </CButton>

        <CButton color="primary" className="btn btn-primary" onClick={handleNext}>
          Save & Next
        </CButton>
      </div>
    </div>
  )
}

export default HealthStep
