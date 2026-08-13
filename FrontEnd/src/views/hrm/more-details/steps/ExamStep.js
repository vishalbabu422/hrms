import { CButton, CFormInput, CFormSelect } from '@coreui/react'
import { useEffect } from 'react'

import {
  getExaminations,
  getEmployeeExaminations,
  createEmployeeExamination,
  updateEmployeeExamination,
} from '../../../../services/employeeExaminations'

const ExamStep = ({ state, dispatch, employeeId }) => {
  const { examinations, examOptions } = state

  useEffect(() => {
    const loadData = async () => {
      try {
        const examList = await getExaminations()
        const activeExams = (examList.data.data || []).filter((exam) => exam.is_active === true)
        dispatch({
          type: 'SET_EXAM_OPTIONS',
          payload: activeExams,
        })

        const res = await getEmployeeExaminations(employeeId)
        dispatch({
          type: 'SET_EXAMINATIONS',
          payload: res.data.data?.length ? res.data.data : state.examinations,
        })
      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [employeeId])

  const saveExam = async (exam) => {
    try {
        console.log(exam)
      await createEmployeeExamination(employeeId, {
        examination_id: exam?.examination_id,
        exam_date: exam.exam_date,
        marks_obtained: exam.marks_obtained,
        result_status: exam.result_status,
        certificate_number: exam.certificate_number,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const updateExam = async (exam) => {
    try {
      await updateEmployeeExamination(employeeId, exam.id, {
        examination_id: exam.examination_id,
        exam_date: exam.exam_date,
        marks_obtained: exam.marks_obtained,
        result_status: exam.result_status,
        certificate_number: exam.certificate_number,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (exam) => {
    if (exam.id) {
      await updateExam(exam)
    } else {
      await saveExam(exam)
    }
  }

  const handleNext = async () => {
    for (const exam of examinations) {
    //   console.log(exam)
      await handleSave(exam)
    }

    dispatch({
      type: 'SET_STEP',
      payload: state.step + 1,
    })
  }

  return (
    <div className="step-content">
      <h5 className="mb-3">Examinations</h5>

      {examinations.map((exam, index) => (
        <div key={index} className="border rounded p-3 mb-3">
          <div className="row g-3">
            <div className="col-md-6">
              <CFormSelect
                label="Examination"
                value={exam.examination_id}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_ITEM',
                    section: 'examinations',
                    index,
                    field: 'examination_id',
                    value: e.target.value,
                  })
                }
              >
                <option value="">Select Exam</option>

                {examOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.exam_name}
                  </option>
                ))}
              </CFormSelect>
            </div>

            <div className="col-md-6">
              <CFormInput
                type="date"
                label="Exam Date"
                value={exam.exam_date}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_ITEM',
                    section: 'examinations',
                    index,
                    field: 'exam_date',
                    value: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-4">
              <CFormInput
                label="Marks Obtained"
                type="number"
                value={exam.marks_obtained}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_ITEM',
                    section: 'examinations',
                    index,
                    field: 'marks_obtained',
                    value: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-4">
              <CFormSelect
                label="Result Status"
                value={exam.result_status}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_ITEM',
                    section: 'examinations',
                    index,
                    field: 'result_status',
                    value: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
              </CFormSelect>
            </div>

            <div className="col-md-4">
              <CFormInput
                label="Certificate Number"
                value={exam.certificate_number}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_ITEM',
                    section: 'examinations',
                    index,
                    field: 'certificate_number',
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {examinations.length > 1 && (
            <div className="text-end mt-2">
              <CButton
                color="danger"
                size="sm"
                onClick={() =>
                  dispatch({
                    type: 'REMOVE_ITEM',
                    section: 'examinations',
                    index,
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
            section: 'examinations',
            payload: {
              examination_id: '',
              exam_date: '',
              marks_obtained: '',
              result_status: '',
              certificate_number: '',
            },
          })
        }
      >
        + Add Examination
      </CButton>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <CButton
          className="btn btn-outline-secondary"
          color="light"
          disabled={state.step === 0}
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

export default ExamStep
