import { useEffect, useState } from 'react'
import { getEmployeeDocuments } from '../services/employeeDocuments'

const useEmployeeDocuments = (employeeId, docType = null) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!employeeId) return

    const fetchDocuments = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await getEmployeeDocuments(employeeId, docType)

        const data = res.data?.data || []

        setDocuments(data)

      } catch (err) {
        console.error('Fetch documents error:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [employeeId, docType])

  return {
    documents,
    loading,
    error,
    setDocuments, // 🔥 useful if you want manual updates
  }
}

export default useEmployeeDocuments