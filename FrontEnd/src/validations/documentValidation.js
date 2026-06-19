export const validateDocuments = (documents) => {
  const errors = []

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  documents.forEach((doc, index) => {
    const err = {}

    // ✅ REQUIRED
    if (!doc.type) {
      err.type = 'Document type is required'
    }

    if (!doc.file && !doc.file_url) {
      err.file = 'File is required'
    }

    // ✅ FILE TYPE VALIDATION (🔥 ADD THIS)

    if (doc.type === 'PHOTO') {
      const allowedPhotoTypes = ['image/jpeg', 'image/png']

      if (doc.file && !allowedPhotoTypes.includes(doc.file.type)) {
        err.file = 'Only JPG, JPEG and PNG files are allowed'
      }
    } else {
      if (doc.file && !allowedTypes.includes(doc.file.type)) {
        err.file = 'Only PDF and Word files are allowed'
      }
    }

    // ✅ VARCHAR CHECKS
    if (doc.type && doc.type.length > 50) {
      err.type = 'Max 50 characters allowed'
    }

    if (doc.mime_type && doc.mime_type.length > 100) {
      err.mime_type = 'Max 100 characters allowed'
    }

    if (doc.file_hash && doc.file_hash.length !== 64) {
      err.file_hash = 'Invalid file hash'
    }

    errors[index] = err
  })

  return errors
}
