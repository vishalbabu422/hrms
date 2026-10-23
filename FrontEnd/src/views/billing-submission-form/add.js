
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import BillingSubmissionForm from './form-component'
import api from '../../api/axios'

const BillingSubmissionAdd = () => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (formData) => {
    if (saving) return

    try {
      setSaving(true)

      const response = await api.post('/billing-submission/', formData)

      if (
        response.data?.status &&
        String(response.data.status).toLowerCase() !== 'success'
      ) {
        throw new Error(
          response.data?.message || 'Unable to save Billing Submission',
        )
      }

      toast.success(
        response.data?.message || 'Billing Submission saved successfully',
      )

      navigate('/billing-submission-form')
    } catch (error) {
      console.error(
        'Create Billing Submission API error:',
        error.response?.data || error,
      )

      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to save Billing Submission',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <BillingSubmissionForm
      mode="add"
      onSubmit={handleSubmit}
      saving={saving}
    />
  )
}

export default BillingSubmissionAdd
