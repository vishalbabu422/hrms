
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { toast } from 'react-toastify'

import BillingSubmissionForm from './form-component'
import api from '../../api/axios'

const getRecord = (response) => {
  const body = response?.data

  return (
    body?.data?.billingSubmission ??
    body?.data?.billing_submission ??
    body?.data?.billingSubmissionDetails ??
    body?.data?.billing_submission_details ??
    body?.data
  )
}

const BillingSubmissionEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRecord = useCallback(async () => {
    try {
      setLoading(true)

      const response = await api.get(`/billing-submission/${id}`)
      const record = getRecord(response)

      if (!record || typeof record !== 'object' || record.id == null) {
        toast.error('Billing Submission not found')
        navigate('/billing-submission-form')
        return
      }

      console.log('Billing Submission record:', record)

      setInitialData({
        ...record,

        // Work Order
        work_order_id: String(record.work_order_id ?? record.wo_id ?? ''),
        work_order_no:
          record.work_order_no ??
          record.workOrder?.work_order_no ??
          '',

        // Month and dates
        year: String(record.year ?? ''),
        month: record.month ?? '',
        invoice_date: record.invoice_date
          ? String(record.invoice_date).slice(0, 10)
          : '',
        pbg_submission_date: record.pbg_submission_date
          ? String(record.pbg_submission_date).slice(0, 10)
          : '',

        // GST reference
        gst_code_fk: String(
          record.gst_code_fk ??
          record.gst_code_id ??
          record.gstCode?.id ??
          '',
        ),
        gst_code:
          record.gst_code ??
          record.gstCode?.code ??
          '',

        // GST amounts
        igst: record.igst ?? record.billing_igst_amt ?? 0,
        cgst: record.cgst ?? record.billing_cgst_amt ?? 0,
        sgst: record.sgst ?? record.billing_sgst_amt ?? 0,

        // PBG
        pbg_id: String(record.pbg_id ?? ''),
        pbg_no: record.pbg_no ?? record.pbg?.pbg_no ?? '',
      })
    } catch (error) {
      console.error(
        'Failed to fetch Billing Submission:',
        error.response?.data || error,
      )

      toast.error(
        error.response?.data?.message ||
          'Unable to load Billing Submission',
      )

      navigate('/billing-submission-form')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    if (!id) {
      toast.error('Billing Submission ID is missing')
      navigate('/billing-submission-form')
      return
    }

    fetchRecord()
  }, [id, fetchRecord, navigate])

  const handleSubmit = async (payload) => {
    try {
      await api.patch(`/billing-submission/${id}`, payload)

      toast.success('Billing Submission updated successfully')
      navigate('/billing-submission-form')
    } catch (error) {
      console.error(
        'Failed to update Billing Submission:',
        error.response?.data || error,
      )

      toast.error(
        error.response?.data?.message ||
          'Unable to update Billing Submission',
      )
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <CSpinner />
      </div>
    )
  }

  if (!initialData) return null

  return (
    <BillingSubmissionForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  )
}

export default BillingSubmissionEdit
