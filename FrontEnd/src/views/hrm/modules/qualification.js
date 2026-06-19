import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import api from '../../../api/axios'
import { toast } from 'react-toastify'
import { validateQualifications } from '../../../validations/qualificationValidation'

const Qualification = forwardRef(({ employeeId }, ref) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  const emptyQualification = {
    id: null,
    qualification_type: '',
    qualification_name: '',
    specialization: '',
    institute_name: '',
    board_university: '',
    year_of_passing: '',
    grade: '',
    percentage: '',
    document: null,
  }

  const [employeeQualification, setEmployeeQualification] = useState([{ ...emptyQualification }])

  // ================= FETCH =================
  useEffect(() => {
    if (!employeeId) return

    const fetchQualifications = async () => {
      try {
        const res = await api.get(`/employee/${employeeId}/qualification`)
        const data = res.data?.data || res.data

        if (data?.length) {
          setEmployeeQualification(data)
        }
      } catch (err) {
        console.error('Fetch qualification error', err)
      }
    }

    fetchQualifications()
  }, [employeeId])

  // ================= HANDLE CHANGE =================
  const handleChange = (index, field, value) => {
    const updated = [...employeeQualification]
    updated[index][field] = value
    setEmployeeQualification(updated)
  }

  // remove qualification

  const removeQualification = async (exp, index) => {
    try {
      // delete qualification
      if (exp.id) {
        const confirmDelete = window.confirm('Are you sure you want to delete this qualification?')

        if (!confirmDelete) return
        await api.delete(`/employee/${employeeId}/qualification/${exp.id}`)
        toast.success('Qualification deleted')
      }

      // 🔥 REMOVE FROM UI
      setEmployeeQualification((prev) => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete qualification')
    }
  }

  // ================= SUBMIT =================
  // useImperativeHandle(ref, () => ({
  //   submit: async () => {
  //     try {
  //       setLoading(true)

  //       const baseUrl = `/employee/${employeeId}/qualification`

  //       for (const qual of employeeQualification) {
  //         // skip empty
  //         if (!qual.qualification_name) continue

  //         // 🔥 PATCH if id exists
  //         if (qual.id) {
  //           await api.patch(`${baseUrl}/${qual.id}`, qual)
  //         }

  //         // 🔥 POST if new
  //         else {
  //           await api.post(baseUrl, qual)
  //         }
  //       }

  //       toast.success('Qualification saved')
  //       return true
  //     } catch (error) {
  //       console.error(error)
  //       toast.error(error.response?.data?.message || 'Failed to save qualification')
  //       return false
  //     } finally {
  //       setLoading(false)
  //     }
  //   },
  // }))

useImperativeHandle(ref, () => ({
  submit: async () => {
    try {
      setLoading(true)

      const validationErrors = validateQualifications(employeeQualification)
      setErrors(validationErrors)

      const hasError = validationErrors.some((e) => Object.keys(e).length)

      if (hasError) {
        return false   // ❌ remove toast if you want inline only
      }

      const baseUrl = `/employee/${employeeId}/qualification`

      for (const qual of employeeQualification) {
        if (!qual.qualification_name) continue

        if (qual.id) {
          await api.patch(`${baseUrl}/${qual.id}`, qual)
        } else {
          await api.post(baseUrl, qual)
        }
      }

      toast.success('Qualification saved successfully')

      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setLoading(false)
    }
  },
}))

  return (
    <div className="step-content">
      {employeeQualification.map((q, index) => (
        <div key={index} className="border rounded p-3 mb-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Qualification Type</label>
              <select
                className="form-select"
                value={q.qualification_type}
                onChange={(e) => handleChange(index, 'qualification_type', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Degree">Degree</option>
                <option value="Certification">Certification</option>
                <option value="Diploma">Diploma</option>
                <option value="Training">Training</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Qualification Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors[index]?.qualification_name ? 'is-invalid' : ''}`}
                value={q.qualification_name}
                placeholder="Enter qualification name"
              
                onChange={(e) => handleChange(index, 'qualification_name', e.target.value)}
              />
              <div className="invalid-feedback">{errors[index]?.qualification_name}</div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Specialization</label>
              <input
                className="form-control"
                value={q.specialization}
                onChange={(e) => handleChange(index, 'specialization', e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Institute Name</label>
              <input
                className="form-control"
                value={q.institute_name}
                onChange={(e) => handleChange(index, 'institute_name', e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Board / University</label>
              <input
                className="form-control"
                value={q.board_university}
                onChange={(e) => handleChange(index, 'board_university', e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Year of Passing</label>
              <input
                type="number"
                className="form-control"
                value={q.year_of_passing}
                onChange={(e) => handleChange(index, 'year_of_passing', e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Grade</label>
              <input
                className="form-control"
                value={q.grade}
                onChange={(e) => handleChange(index, 'grade', e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Percentage (%)</label>
              <input
                type="number"
                className={`form-control ${errors[index]?.percentage ? 'is-invalid' : ''}`}
                value={q.percentage}
                placeholder="Enter percentage"
                min="0"
                max="100"
                step="0.01"
                onChange={(e) => handleChange(index, 'percentage', e.target.value)}
              />
              <div className="invalid-feedback">{errors[index]?.percentage}</div>
            </div>
          </div>

          {employeeQualification.length > 1 && (
            <div className="text-end mt-3">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeQualification(q, index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() =>
          setEmployeeQualification([...employeeQualification, { ...emptyQualification }])
        }
      >
        + Add Qualification
      </button>
    </div>
  )
})

export default Qualification
