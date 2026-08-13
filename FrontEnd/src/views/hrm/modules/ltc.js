import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import api from '../../../api/axios'
import { toast } from 'react-toastify'
import { validateLtc } from '../../../validations/ltcValidation'
import StateSelect from '../../components/state-dropdown'
import DistrictSelect from '../../components/district-dropdown'

const Ltc = forwardRef(({ employeeId }, ref) => {
  const [loading, setLoading] = useState(false)
  const [isExisting, setIsExisting] = useState(false)
  const [errors, setErrors] = useState({})

  const [ltcData, setLtcData] = useState({
    hometown: '',
    district: '',
    state: '',
    nearest_railway: '',
    nearest_airport: '',
  })

  // ================= FETCH LTC =================// ================= FETCH LTC =================
  
useEffect(() => {
  if (!employeeId) return

  const fetchLtc = async () => {
    try {
      const res = await api.get(`/employee/${employeeId}/ltc`)

      const data = res.data?.data

      if (data) {
        setLtcData({
          hometown: data.hometown || '',
          district: data.district || '',
          state: data.state || '',
          nearest_railway: data.nearest_railway || '',
          nearest_airport: data.nearest_airport || '',
        })

        // Lock LTC only when required fields are completed
        const isLtcCompleted = Boolean(
          data.hometown &&
          data.state &&
          data.district
        )

        setIsExisting(isLtcCompleted)
      } else {
        // LTC does NOT exist
        setLtcData({
          hometown: '',
          district: '',
          state: '',
          nearest_railway: '',
          nearest_airport: '',
        })

        setIsExisting(false)
      }
    } catch (err) {
      // LTC not found = first-time entry
      if (err.response?.status === 404) {
        setLtcData({
          hometown: '',
          district: '',
          state: '',
          nearest_railway: '',
          nearest_airport: '',
        })

        setIsExisting(false)

        return
      }

      console.error('Fetch LTC error:', err)
    }
  }

  fetchLtc()
}, [employeeId])

  // ================= HANDLE CHANGE =================
 const handleChange = (fieldOrEvent, value) => {
  const field =
    typeof fieldOrEvent === 'string'
      ? fieldOrEvent
      : fieldOrEvent.target.name

  const fieldValue =
    typeof fieldOrEvent === 'string'
      ? value
      : fieldOrEvent.target.value

  // LTC already exists → don't allow changes
  if (isExisting) return

  setLtcData((prev) => ({
    ...prev,
    [field]: fieldValue,

    // State change → clear district
    ...(field === 'state' ? { district: '' } : {}),
  }))

  setErrors((prev) => ({
    ...prev,
    [field]: '',

    ...(field === 'state' ? { district: '' } : {}),
  }))
}

  // ================= SUBMIT =================
  useImperativeHandle(ref, () => ({
    submit: async () => {
      // -----------------------------------------
      // LTC ALREADY EXISTS
      // -----------------------------------------
      if (isExisting) {
        // Don't update LTC again
        return true
      }

      try {
        setLoading(true)

        // -----------------------------------------
        // VALIDATION
        // -----------------------------------------
        const validationErrors = validateLtc(ltcData, 'LTC')

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors)
          return false
        }

        // -----------------------------------------
        // FIRST TIME LTC ENTRY
        // -----------------------------------------
        const url = `/employee/${employeeId}/ltc`

        await api.post(url, ltcData)

        toast.success('LTC saved successfully')

        // Once successfully saved,
        // make LTC read-only
        setIsExisting(true)

        return true
      } catch (error) {
        console.error('LTC save error:', error)

        toast.error(
          error.response?.data?.message || 'Failed to save LTC details',
        )

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

          {/* ================= HOMETOWN ================= */}
          <div className="col-md-6">
            <label className="form-label">
              Hometown <span className="text-danger">*</span>
            </label>

            <input
              className={`form-control ${
                errors.hometown ? 'is-invalid' : ''
              }`}
              placeholder="Enter hometown"
              value={ltcData.hometown || ''}
              onChange={(e) =>
                handleChange('hometown', e.target.value)
              }
              disabled={isExisting}
            />

            <div className="invalid-feedback">
              {errors.hometown}
            </div>
          </div>

          {/* ================= STATE ================= */}
          <StateSelect
            name="state"
            value={ltcData.state}
            onChange={handleChange}
            invalid={!!errors.state}
            feedback={errors.state}
            disabled={isExisting}
          />

          {/* ================= DISTRICT ================= */}
          <DistrictSelect
            stateId={ltcData.state}
            name="district"
            value={ltcData.district}
            onChange={handleChange}
            invalid={!!errors.district}
            feedback={errors.district}
            disabled={isExisting}
          />

          {/* ================= RAILWAY ================= */}
          <div className="col-md-6">
            <label className="form-label">
              Nearest Railway
            </label>

            <input
              className="form-control"
              placeholder="Enter nearest railway"
              value={ltcData.nearest_railway || ''}
              onChange={(e) =>
                handleChange('nearest_railway', e.target.value)
              }
              disabled={isExisting}
            />
          </div>

          {/* ================= AIRPORT ================= */}
          <div className="col-md-6">
            <label className="form-label">
              Nearest Airport
            </label>

            <input
              className="form-control"
              placeholder="Enter nearest airport"
              value={ltcData.nearest_airport || ''}
              onChange={(e) =>
                handleChange('nearest_airport', e.target.value)
              }
              disabled={isExisting}
            />
          </div>

        </div>
      </div>
    </div>
  )
})

export default Ltc