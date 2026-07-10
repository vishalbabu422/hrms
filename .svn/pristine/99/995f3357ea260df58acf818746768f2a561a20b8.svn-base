import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import api from '../../../api/axios'
import { toast } from 'react-toastify'
import useDocumentUpload from '../../../hooks/useDocumentUpload'
import useEmployeeDocuments from '../../../hooks/fetchDocuments'
import { validateScreening } from '../../../validations/screeningValidation'

const Screening = forwardRef(({ employeeId, isEdit }, ref) => {
  const [loading, setLoading] = useState(false)
  const [isExisting, setIsExisting] = useState(false)
  const [screeningFile, setScreeningFile] = useState(null)
  const [errors, setErrors] = useState({})

  const [screening, setScreening] = useState({
    test_scheduled_date: '',
    test_given_date: '',
    marks_secured: '',
    result: '',
    screening_mail: null,
  })

  const { uploadDocument, updateDocument } = useDocumentUpload(employeeId)

  // fetch existing doc
  const { documents } = useEmployeeDocuments(employeeId, 'SCREENING_MAIL_COPY')

  const screeningDoc = documents?.find((d) => d.doc_type === 'SCREENING_MAIL_COPY')

  // ================= FETCH =================
  useEffect(() => {
    if (!employeeId) return

    const fetchScreening = async () => {
      try {
        const res = await api.get(`/employee/${employeeId}/screeningtest`)
        const data = res.data?.data?.[0]

        if (data) {
          setScreening(data)
          setIsExisting(true)
        }
      } catch (err) {
        console.error('Fetch screening error', err)
      }
    }

    fetchScreening()
  }, [employeeId])

  // ================= HANDLERS =================
  const handleChange = (field, value) => {
    setScreening((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))
  }
  const handleFile = (e) => {
    const file = e.target.files[0]
    setScreeningFile(file)
  }

  // ================= SUBMIT =================
  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        setLoading(true)

        // ✅ ADD HERE
        const validationErrors = validateScreening(screening, 'Screening')

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors)
          return false
        }

        const url = `/employee/${employeeId}/screeningtest`

        // 🔥 SAVE SCREENING DATA
        if (isExisting) {
          await api.patch(url, screening)
        } else {
          await api.post(url, screening)
        }

        // 🔥 HANDLE DOCUMENT
        if (screeningFile) {
          if (screeningDoc?.id) {
            await updateDocument({
              docId: screeningDoc.id,
              file: screeningFile,
              docType: 'SCREENING_MAIL_COPY',
              remarks: 'Screening mail copy',
            })
          } else {
            await uploadDocument({
              file: screeningFile,
              docType: 'SCREENING_MAIL_COPY',
              remarks: 'Screening mail copy',
            })
          }
        }

        toast.success('Screening saved')
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Failed to save screening')
        return false
      } finally {
        setLoading(false)
      }
    },
  }))

  return (
    <div className="step-content">
  <div className="border rounded p-3 mb-3">
    <div className="row g-3">

      {/* Test Scheduled Date */}
      <div className="col-md-6">
        <label className="form-label">Test Scheduled Date</label>
        <input
          type="date"
          className="form-control"
          value={screening.test_scheduled_date || ''}
          onChange={(e) =>
            handleChange('test_scheduled_date', e.target.value)
          }
        />
      </div>

      {/* Test Given Date */}
      <div className="col-md-6">
        <label className="form-label">
          Test Given Date <span className="text-danger">*</span>
        </label>

        <input
          type="date"
          className={`form-control ${
            errors.test_given_date ? 'is-invalid' : ''
          }`}
          value={screening.test_given_date || ''}
          onChange={(e) =>
            handleChange('test_given_date', e.target.value)
          }
        />

        <div className="invalid-feedback">
          {errors.test_given_date}
        </div>
      </div>

      {/* Marks Secured */}
      <div className="col-md-6">
        <label className="form-label">
          Marks Secured
          {screening.result === 'PASS' && (
            <span className="text-danger"> *</span>
          )}
        </label>

        <input
          type="number"
          className={`form-control ${
            errors.marks_secured ? 'is-invalid' : ''
          }`}
          value={screening.marks_secured || ''}
          placeholder="Enter marks"
          onChange={(e) =>
            handleChange('marks_secured', e.target.value)
          }
        />

        <div className="invalid-feedback">
          {errors.marks_secured}
        </div>
      </div>

      {/* Result */}
      <div className="col-md-6">
        <label className="form-label">
          Result <span className="text-danger">*</span>
        </label>

        <select
          className={`form-select ${
            errors.result ? 'is-invalid' : ''
          }`}
          value={screening.result || ''}
          onChange={(e) =>
            handleChange('result', e.target.value)
          }
        >
          <option value="">Select Result</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>

        <div className="invalid-feedback">{errors.result}</div>
      </div>

      {/* File Upload */}
      <div className="col-md-6">
        <label className="form-label">Screening Mail Copy</label>

        <input
          type="file"
          className="form-control"
          onChange={handleFile}
        />

        {/* Existing */}
        {!screeningFile && screeningDoc && (
          <div className="mt-2">
            <a
              href={screeningDoc.file_url}
              target="_blank"
              rel="noreferrer"
            >
              {screeningDoc.file_name}
            </a>
          </div>
        )}

        {/* New */}
        {screeningFile && (
          <small className="text-success">
            {screeningFile.name}
          </small>
        )}
      </div>

    </div>
  </div>
</div>
  )
})

export default Screening
