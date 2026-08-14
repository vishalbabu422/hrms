import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
} from '@coreui/react'
import api from '../../../api/axios'
import { toast } from 'react-toastify'

import OrganizationSelect from '../../components/organization-select'
import { getDivisions, getDesignations } from '../../../services/employeeBasic'
import { validateBasicInfo } from '../../../validations/basicInfoValidation'
import StateSelect from '../../components/state-dropdown'
import { useSelector } from 'react-redux'
import DesignationSelect from '../../components/designation-select'
import DivisionSelect from '../../components/division-select'

const BasicInfo = forwardRef(({ employeeId, isEdit }, ref) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const user = useSelector((state) => state.auth.user)
  const isOrgAdmin = user?.role?.includes('ORG_ADMIN')

  const [employeeDetails, setEmployeeDetails] = useState({
    organization_id: '',
    employee_code: '',
    salutation: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_no: '',
    employment_type: '',
    designation: '',
    division: '',
    mode_of_working: '',
    state_of_working: '',
    employee_category: '',
    date_of_joining: '',
    probation_end_date: '',
    confirmation_date: '',
    resignation_date: '',
    relieving_date: '',
    retirement_date: '', // ADD
    notice_period_days: '',
    groups: '', // ADD
    hr_verified: true,
    is_gazetted: false,
  })
  const [employeeExtraDetails, setEmployeeExtraDetails] = useState({
    dob: '',
    birth_place: '',
    gender: '',
    marital_status: '',
    marriage_date: '',
    father_name: '',
    mother_name: '',
    religion: '',
    nationality: '',
    alternate_email: '',
    emergency_contact_no: '',
    blood_group: '',
  })

  const [designations, setDesignations] = useState([])
  const [divisions, setDivisions] = useState([])

  const normalizeExtraDetails = (data = {}) => ({
    dob: data.dob || data.date_of_birth || '',
    birth_place: data.birth_place || '',
    gender: data.gender || '',
    marital_status: data.marital_status || '',
    marriage_date: data.marriage_date || '',
    father_name: data.father_name || '',
    mother_name: data.mother_name || '',
    religion: data.religion || '',
    nationality: data.nationality || '',
    alternate_email: data.alternate_email || '',
    emergency_contact_no: data.emergency_contact_no || '',
    blood_group: data.blood_group || '',
  })

  const mapExtraDetailsToApi = (obj) => {
    const { dob, ...rest } = obj
    const payload = { ...rest }

    if (dob !== undefined && dob !== null && dob !== '') {
      payload.date_of_birth = dob
      payload.dob = dob
    }

    return payload
  }

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    const val = type === 'checkbox' ? checked : value

    // fields that go to employee_details
    const detailFields = [
      'dob',
      'birth_place',
      'gender',
      'marital_status',
      'marriage_date',
      'father_name',
      'mother_name',
      'religion',
      'nationality',
      'alternate_email',
      'emergency_contact_no',
      'blood_group',
    ]

    if (detailFields.includes(name)) {
      setEmployeeExtraDetails((prev) => ({
        ...prev,
        [name]: val,
      }))
    } else {
      setEmployeeDetails((prev) => ({
        ...prev,
        [name]: val,
      }))
    }
  }

  // Fetch dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [divisionRes, designationRes] = await Promise.all([getDivisions(), getDesignations()])

        setDivisions(divisionRes.data?.data || [])
        setDesignations(designationRes.data?.data?.DesignationList || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchDropdowns()
  }, [])

  useEffect(() => {
    if (isEdit) return

    const fetchEmployeeCode = async () => {
      try {
        const res = await api.get('/employee/get-emp-code')

        setEmployeeDetails((prev) => ({
          ...prev,
          employee_code: res.data?.data?.employee_code || '',
        }))
      } catch (err) {
        console.error('Failed to fetch employee code', err)
      }
    }

    fetchEmployeeCode()
  }, [isEdit])

  // Fetch existing data (EDIT MODE)
  useEffect(() => {
    if (!employeeId) return

    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employee/${employeeId}`)
        const data = res.data?.data

        setEmployeeDetails((prev) => ({
          ...prev,
          ...data,
        }))
      } catch (err) {
        console.error(err)
      }
    }

    const fetchDetails = async () => {
      try {
        const res = await api.get(`/employee/${employeeId}/details`)
        const data = res.data?.data

        setEmployeeExtraDetails((prev) => ({
          ...prev,
          ...normalizeExtraDetails(data),
        }))
      } catch (err) {
        console.error(err)
      }
    }

    const fetchDesignation = async () => {
      try {
        const res = await api.get(`/employee/${employeeId}/designations`)

        const currentDesignation = res.data?.data?.[0]

        if (currentDesignation) {
          setEmployeeDetails((prev) => ({
            ...prev,
            designation: currentDesignation.designation_id,
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }

    const fetchDivision = async () => {
      try {
        const res = await api.get(`/employee/${employeeId}/divisions`)

        const currentDivision = res.data?.data?.[0]

        if (currentDivision) {
          setEmployeeDetails((prev) => ({
            ...prev,
            division: currentDivision?.division_id || '',
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchEmployee()
    fetchDetails()
    fetchDesignation()
    fetchDivision()
  }, [employeeId])

  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        const isValid = validateForm()
        if (!isValid) return false

        setLoading(true)

        let id = employeeId

        // CLEAN
        const clean = (obj) =>
          Object.fromEntries(
            Object.entries(obj)
              .map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
              .filter(([_, v]) => v !== '' && v !== null && v !== undefined),
          )

        const trim = (obj) =>
          Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
          )

        // const employeePayload = isEdit ? trim(employeeDetails) : clean(employeeDetails)
        const employeePayload = isEdit ? trim(employeeDetails) : clean(employeeDetails)

        if (employeePayload.retirement_date) {
          employeePayload.date_of_retirement = employeePayload.retirement_date
          delete employeePayload.retirement_date
        }

        if (employeePayload.groups) {
          employeePayload.employee_group = employeePayload.groups
          delete employeePayload.groups
        }
        const detailsPayload = mapExtraDetailsToApi(clean(employeeExtraDetails))

        // ========================
        // 1. EMPLOYEE SAVE
        // ========================
        if (!isEdit) {
          const res = await api.post('/employee', employeePayload)
          id = res.data?.data?.id || res.data?.id
        } else {
          await api.patch(`/employee/${employeeId}`, employeePayload)
        }

        // ========================
        // 2. EMPLOYEE DETAILS SAVE
        // ========================
        if (isEdit) {
          try {
            await api.patch(`/employee/${id}/details`, detailsPayload)
          } catch (err) {
            const notFoundError =
              err.response?.status === 404 ||
              err.response?.data?.message?.toLowerCase().includes('not found')

            if (notFoundError) {
              await api.post(`/employee/${id}/details`, detailsPayload)
            } else {
              throw err
            }
          }
        } else {
          await api.post(`/employee/${id}/details`, detailsPayload)
        }

        // ========================
        // 3. DESIGNATION / DIVISION
        // ========================
        const today = new Date().toISOString().split('T')[0]

        if (employeeDetails.designation) {
          await api.post(`/employee/${id}/designations`, {
            designation_id: employeeDetails.designation,
            effective_from: today,
          })
        }

        if (employeeDetails.division) {
          await api.post(`/employee/${id}/divisions`, {
            division_id: employeeDetails.division,
            effective_from: today,
          })
        }

        toast.success(isEdit ? 'Basic info updated' : 'Basic info saved')
        return { employeeId: id }
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Failed to save basic info')
        return false
      } finally {
        setLoading(false)
      }
    },
  }))

  const validateForm = () => {
    const validationErrors = validateBasicInfo(employeeDetails, employeeExtraDetails)
    setErrors(validationErrors)

    return Object.keys(validationErrors).length === 0
  }

  return (
    <CCard>
      <CCardHeader>Basic Information</CCardHeader>

      <CCardBody>
        <CForm>
          <CRow className="g-3">
            {/* Organization */}
            <OrganizationSelect
              name="organization_id"
              value={employeeDetails.organization_id || ''}
              onChange={handleChange}
              label="Organization"
              colSize={12}
            />

            {/* Salutation */}
            <CCol md={2}>
              <CFormLabel>Salutation</CFormLabel>
              <CFormSelect
                name="salutation"
                value={employeeDetails.salutation || ''}
                onChange={handleChange}
                disabled={!isOrgAdmin}
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
              </CFormSelect>
            </CCol>

            {/* Names */}
            <CCol md={4}>
              <CFormLabel>
                First Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                name="first_name"
                value={employeeDetails.first_name || ''}
                onChange={handleChange}
                invalid={!!errors.first_name}
                feedback={errors.first_name}
                placeholder="Enter first name"
                maxLength={50}
                disabled={!isOrgAdmin}
              />
            </CCol>

            <CCol md={3}>
              <CFormLabel>Middle Name</CFormLabel>
              <CFormInput
                name="middle_name"
                value={employeeDetails.middle_name || ''}
                onChange={handleChange}
                maxLength={50}
                placeholder="Enter middle name"
                disabled={!isOrgAdmin}
              />
            </CCol>

            <CCol md={3}>
              <CFormLabel>Last Name</CFormLabel>
              <CFormInput
                name="last_name"
                value={employeeDetails.last_name || ''}
                onChange={handleChange}
                maxLength={50}
                invalid={!!errors.last_name}
                feedback={errors.last_name}
                placeholder="Enter last name"
                disabled={!isOrgAdmin}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>
                Employee Code <span className="text-danger">*</span>
              </CFormLabel>

              <CFormInput
                name="employee_code"
                value={employeeDetails.employee_code || ''}
                onChange={handleChange}
                placeholder="Enter employee code"
                maxLength={30}
                disabled={!isOrgAdmin}
              />
            </CCol>

            {/* Job Info */}
            <CCol md={6}>
              <CFormLabel>Employee Type</CFormLabel>
              <CFormSelect
                name="employment_type"
                value={employeeDetails.employment_type || ''}
                onChange={handleChange}
                disabled={!isOrgAdmin}
              >
                <option value="">Select</option>
                <option value="Contractual">Contractual</option>
                <option value="Payroll">Payroll</option>
              </CFormSelect>
            </CCol>

            <DesignationSelect
              name="designation"
              value={employeeDetails.designation}
              onChange={handleChange}
              options={designations}
              required={false}
            />

            <DivisionSelect
              name="division"
              value={employeeDetails.division}
              onChange={handleChange}
              options={divisions}
              required={false}
            />

            <CCol md={6}>
              <CFormLabel>Mode of Working</CFormLabel>
              <CFormSelect
                name="mode_of_working"
                value={employeeDetails.mode_of_working || ''}
                onChange={handleChange}
                maxLength={100}
                disabled={!isOrgAdmin}
              >
                <option value="">Select</option>
                <option value="Office">Office</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Work From Home">Work From Home</option>
              </CFormSelect>
            </CCol>

            {/* FIXED DROPDOWN */}

            <StateSelect
              name="state_of_working"
              value={employeeDetails.state_of_working || ''}
              onChange={handleChange}
            />

            <CCol md={6}>
              <CFormLabel>Employee Category</CFormLabel>
              <CFormSelect
                name="employee_category"
                value={employeeDetails.employee_category || ''}
                onChange={handleChange}
                maxLength={100}
                disabled={!isOrgAdmin}
              >
                <option value="">Select</option>
                <option value="Skilled">Skilled</option>
                <option value="Semi Skilled">Semi Skilled</option>
                <option value="Unskilled">Unskilled</option>
                <option value="Technical">Technical</option>
              </CFormSelect>
            </CCol>

            {/* Attendance Code */}
            <CCol md={6}>
              <CFormLabel>Attendance Code</CFormLabel>
              <CFormInput
                name="attendance_code"
                value={employeeDetails.attendance_code || ''}
                onChange={handleChange}
                maxLength={20}
                placeholder="Enter attendance code"
              />
            </CCol>

            {/* Contact */}
            <CCol md={6}>
              <CFormLabel>
                Email <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={employeeDetails.email || ''}
                onChange={handleChange}
                required
                maxLength={120}
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                invalid={!!errors.email}
                feedback={errors.email}
                placeholder="Enter email address"
                disabled={!isOrgAdmin}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>
                Contact No <span className="text-danger">*</span>
              </CFormLabel>

              <CFormInput
                name="contact_no"
                value={employeeDetails.contact_no || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '') // ✅ remove non-numbers
                  handleChange({
                    target: { name: 'contact_no', value },
                  })
                }}
                required
                maxLength={15}
                inputMode="numeric"
                pattern="[0-9]{10,15}"
                placeholder="Enter contact number"
                invalid={!!errors.contact_no}
                disabled={!isOrgAdmin}
              />

              {errors.contact_no && <div className="text-danger mt-1">{errors.contact_no}</div>}
            </CCol>

            {/* Personal */}
            <CCol md={6}>
              <CFormLabel>
                Date of Birth <span className="text-danger">*</span>
              </CFormLabel>

              <CFormInput
                type="date"
                name="dob"
                value={employeeExtraDetails.dob || ''}
                onChange={handleChange}
                invalid={!!errors.dob} //
              />

              {errors.dob && <div className="text-danger mt-1">{errors.dob}</div>}
            </CCol>

            <CCol md={6}>
              <CFormLabel>Father's Name</CFormLabel>
              <CFormInput
                name="father_name"
                value={employeeExtraDetails.father_name || ''}
                onChange={handleChange}
                placeholder="Enter father's name"
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Mother's Name</CFormLabel>
              <CFormInput
                name="mother_name"
                value={employeeExtraDetails.mother_name || ''}
                onChange={handleChange}
                placeholder="Enter mother's name"
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Marital Status</CFormLabel>
              <CFormSelect
                name="marital_status"
                value={employeeExtraDetails.marital_status || ''}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormLabel>
                Gender <span className="text-danger">*</span>
              </CFormLabel>

              <CFormSelect
                name="gender"
                value={employeeExtraDetails.gender || ''}
                onChange={handleChange}
                invalid={!!errors.gender}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </CFormSelect>

              {errors.gender && <div className="text-danger mt-1">{errors.gender}</div>}
            </CCol>
            {/* Dates */}
            <CCol md={6}>
              <CFormLabel>
                Date Of Joining <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="date"
                name="date_of_joining"
                value={employeeDetails.date_of_joining || ''}
                onChange={handleChange}
                invalid={!!errors.date_of_joining}
                feedback={errors.date_of_joining}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Probation End Date</CFormLabel>
              <CFormInput
                type="date"
                name="probation_end_date"
                value={employeeDetails.probation_end_date || ''}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Confirmation Date</CFormLabel>
              <CFormInput
                type="date"
                name="confirmation_date"
                value={employeeDetails.confirmation_date || ''}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Resignation Date</CFormLabel>
              <CFormInput
                type="date"
                name="resignation_date"
                value={employeeDetails.resignation_date || ''}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Relieving Date</CFormLabel>
              <CFormInput
                type="date"
                name="relieving_date"
                value={employeeDetails.relieving_date || ''}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Retirement Date</CFormLabel>
              <CFormInput
                type="date"
                name="retirement_date"
                value={employeeDetails.retirement_date || ''}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Notice Period (Days)</CFormLabel>
              <CFormInput
                type="number"
                name="notice_period_days"
                value={employeeDetails.notice_period_days || ''}
                onChange={handleChange}
                min="0"
                max="365"
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Groups</CFormLabel>
              <CFormSelect
                name="groups"
                value={employeeDetails.groups || ''}
                onChange={handleChange}
                maxLength={100}
                disabled={!isOrgAdmin}
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </CFormSelect>
            </CCol>

            {/* Checkbox */}
            <CCol md={6} className="d-flex align-items-center ">
              <CFormCheck
                className="mt-3"
                label="Gazetted"
                name="is_gazetted"
                checked={employeeDetails.is_gazetted || false}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
})

export default BasicInfo
