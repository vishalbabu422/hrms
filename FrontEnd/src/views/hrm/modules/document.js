import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import api from '../../../api/axios'
import { toast } from 'react-toastify'
import useDocumentUpload from '../../../hooks/useDocumentUpload'
import useEmployeeDocuments from '../../../hooks/fetchDocuments'
import { deleteEmployeeDocument } from '../../../services/employeeDocuments'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { validateDocuments } from '../../../validations/documentValidation'

const SUPPORTED_DOCS = [
  { label: 'Photo', value: 'PHOTO' },
  { label: 'Resume', value: 'RESUME' },
  { label: 'PAN Card', value: 'PAN_FILE' },
  { label: 'Aadhaar Card', value: 'AADHAAR_FILE' },
  { label: 'Voter ID', value: 'VOTER_ID_FILE' },
  { label: 'Birth Certificate', value: 'BIRTH_CERT' },
  { label: 'Driving License', value: 'DRIVING_LICENSE' },
  { label: 'Work Permit', value: 'WORK_PERMIT' },
  { label: 'Policy Document', value: 'POLICY_DOCUMENT' },
  { label: 'Salary Slip', value: 'SALARY_SLIP' },
  { label: 'Form 16', value: 'FORM16' },
  { label: 'Police Verification', value: 'POLICE_VERIFICATION' },
  { label: 'Declaration', value: 'DECLARATION' },
]

const Documents = forwardRef(({ employeeId, isEdit }, ref) => {
  const [selectedDocType, setSelectedDocType] = useState('')
  const [documents, setDocuments] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [fileError, setFileError] = useState('')
  const fileRef = useRef()
  const [loading, setLoading] = useState(false)

  const { uploadDocument, updateDocument } = useDocumentUpload(employeeId)

  const { documents: existingDocs } = useEmployeeDocuments(employeeId)

  // ================= MAP EXISTING =================
  useEffect(() => {
    if (!existingDocs?.length) return

    const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL

    const mapped = existingDocs.map((doc) => ({
      id: doc.id,
      type: doc.doc_type,
      name: doc.file_name,
      file_url: `${FILE_BASE_URL}/${doc.file_path.replace(/\\/g, '/')}`,
    }))

    setDocuments(mapped)
  }, [existingDocs])

  // ================= AVAILABLE TYPES =================
  const usedTypes = documents.map((d) => d.type)

  const availableDocs = SUPPORTED_DOCS.filter((doc) => !usedTypes.includes(doc.value))

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    // if (!allowedTypes.includes(file.type)) {
    //   setFileError('Only PDF and Word files are allowed')
    //   e.target.value = ''
    //   setSelectedFile(null)
    //   return
    // }

    if (selectedDocType === 'PHOTO') {
      const allowedPhotoTypes = ['image/jpeg', 'image/png']

      if (!allowedPhotoTypes.includes(file.type)) {
        setFileError('Only JPG, JPEG and PNG files are allowed for Photo')
        e.target.value = ''
        setSelectedFile(null)
        return
      }
    } else {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]

      if (!allowedTypes.includes(file.type)) {
        setFileError('Only PDF and Word files are allowed')
        e.target.value = ''
        setSelectedFile(null)
        return
      }
    }

    setFileError('')
    setSelectedFile(file)
  }

  // ================= ADD =================
  const handleAdd = () => {
    if (!selectedDocType || !selectedFile) {
      toast.error('Select document type and file')
      return
    }

    setDocuments((prev) => [
      ...prev,
      {
        type: selectedDocType,
        file: selectedFile,
        name: selectedFile.name,
        isNew: true,
      },
    ])

    setSelectedDocType('')
    setSelectedFile(null)

    if (fileRef.current) fileRef.current.value = ''
  }

  // ================= REMOVE =================

  const handleRemove = async (doc, index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this document?')

    if (!confirmDelete) return
    try {
      if (doc.id) {
        await deleteEmployeeDocument(employeeId, doc.id)
        toast.success('Document deleted')
      }

      setDocuments((prev) => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete document')
    }
  }

  // ================= Added =================

  const handleDownload = async (docId, filePath) => {
    try {
      const response = await api.get(`/employee/${employeeId}/documents/${docId}/download`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')

      const disposition = response.headers['content-disposition']
      let filename = filePath?.split('/').pop() || 'document'

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/)
        if (match) filename = match[1]
      }

      link.href = url
      link.download = filename

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      toast.error('Download failed')
    }
  }

  // ================= SUBMIT =================

  submit: async () => {
    try {
      setLoading(true)

      const validationErrors = validateDocuments(documents)
      setErrors(validationErrors)

      const hasError = validationErrors.some((e) => Object.keys(e).length)

      if (hasError) {
        toast.error('Please fix document errors')
        return false
      }

      for (const doc of documents) {
        if (doc.isNew && doc.file) {
          await uploadDocument({
            file: doc.file,
            docType: doc.type,
          })
        }

        if (!doc.isNew && doc.file && doc.id) {
          await updateDocument({
            docId: doc.id,
            file: doc.file,
            docType: doc.type,
          })
        }
      }

      toast.success('Documents saved')
      return true
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to save documents')
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="step-content">
        {/* ADD SECTION */}
        <div className="card p-3 mb-3 shadow-sm">
          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
              >
                <option value="">Select Document</option>
                {availableDocs.map((doc) => (
                  <option key={doc.value} value={doc.value}>
                    {doc.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <input
                ref={fileRef}
                type="file"
                className={`form-control ${fileError ? 'is-invalid' : ''}`}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              {fileError && <div className="invalid-feedback">{fileError}</div>}
            </div>

            <div className="col-12 text-end">
              <button className="btn btn-primary" onClick={handleAdd}>
                Add Document
              </button>
            </div>
          </div>
        </div>

        {/* LIST */}
        {documents.length > 0 && (
          <div className="card shadow-sm p-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>File</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc, index) => {
                  const label = SUPPORTED_DOCS.find((d) => d.value === doc.type)?.label || doc.type

                  return (
                    <tr key={index}>
                      <td>{label}</td>

                      <td>
                        {!doc.file_url ? (
                          doc.name
                        ) : (
                          <>
                            {doc.name}
                            {/* <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="ms-2"
                            >
                              <CIcon icon={cilCloudDownload} size="lg" />
                            </a> */}

                            <button
                              type="button"
                              className="btn btn-link p-0 ms-2"
                              onClick={() => handleDownload(doc.id, doc.file_url)}
                            >
                              <CIcon icon={cilCloudDownload} size="lg" />
                            </button>
                          </>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(doc, index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
})

export default Documents
