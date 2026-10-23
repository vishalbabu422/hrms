
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
  CSpinner,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilDescription,
} from '@coreui/icons'

import SimpleBar from 'simplebar-react'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import api from '../../api/axios'

import SortableHeaderCell from '../components/sort-table-header'
import AppPagination from '../components/app-pagination'
import TableEmptyState from '../components/table-empty'
import PageHeader from '../components/form-header'
import ActionButton from '../components/action-button'

import { formatDate } from '../../utils/dateUtils'

const Index = () => {
  const navigate = useNavigate()
  const LIMIT = Number(import.meta.env.VITE_DEFAULT_LIMIT) || 10

  const [billingSubmissionList, setBillingSubmissionList] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({
    key: 'id',
    order: 'desc',
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(LIMIT)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // ================= FETCH LIST =================

  const fetchBillingSubmissionList = useCallback(async () => {
    try {
      setLoading(true)

      const params = {
        sort: `${sort.key} ${sort.order}`,
        page,
        limit,
      }

      if (search.trim().length >= 3) {
        params.search = search.trim()
      }

      const response = await api.get('/billing-submission/index', {
        params,
      })

      const body = response?.data

      const records =
        body?.data?.billingSubmissions ??
        body?.data?.billingSubmissionList ??
        body?.billingSubmissions ??
        []

      if (!Array.isArray(records)) {
        console.error('Unexpected API response:', body)
        setBillingSubmissionList([])
        setTotalRecords(0)
        setTotalPages(1)
        toast.error('Unexpected Billing Submission API response')
        return
      }

      setBillingSubmissionList(records)
      setTotalRecords(Number(body?.total ?? records.length))
      setTotalPages(Number(body?.totalPages ?? 1))
    } catch (error) {
      console.error(
        'Failed to fetch Billing Submission list:',
        error.response?.data || error,
      )

      setBillingSubmissionList([])
      setTotalRecords(0)
      setTotalPages(1)

      toast.error(
        error.response?.data?.message ||
          'Failed to fetch Billing Submission list',
      )
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, sort])

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.trim().length === 0 || search.trim().length >= 3) {
      fetchBillingSubmissionList()
    }
  }, [fetchBillingSubmissionList, search])

  // ================= SORT =================

  const handleSort = (key) => {
    setSort((previous) => ({
      key,
      order:
        previous.key === key && previous.order === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  // ================= DELETE - INDEX PAGE ONLY =================

  const confirmDelete = (id) => {
    if (!id) {
      toast.error('Billing Submission ID not found')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this Billing Submission?',
    )

    if (confirmed) {
      handleDelete(id)
    }
  }

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)

      await api.delete(`/billing-submission/${id}`)

      toast.success('Billing Submission deleted successfully')

      // If the last record on a page was deleted,
      // move to the previous page.
      if (billingSubmissionList.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1)
      } else {
        await fetchBillingSubmissionList()
      }
    } catch (error) {
      console.error(
        'Delete Billing Submission error:',
        error.response?.data || error,
      )

      toast.error(
        error.response?.data?.message ||
          'Failed to delete Billing Submission',
      )
    } finally {
      setDeletingId(null)
    }
  }

  // ================= FORMAT AMOUNT =================

  const formatAmount = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  // ================= EXPORT PDF =================

  const handleExportPDF = () => {
    try {
      if (!billingSubmissionList.length) {
        toast.info('No Billing Submission records to export')
        return
      }

      const doc = new jsPDF()
      let y = 18

      doc.setFontSize(16)
      doc.text('Billing Submission List', 14, y)

      y += 10
      doc.setFontSize(9)

      billingSubmissionList.forEach((item, index) => {
        const line = [
          `${index + 1}.`,
          `Invoice No: ${item.invoice_no || '-'}`,
          `Invoice Date: ${
            item.invoice_date ? formatDate(item.invoice_date) : '-'
          }`,
          `Billing Amount: ${formatAmount(item.billing_amount)}`,
          `Total Amount: ${formatAmount(item.total_amount)}`,
        ].join(' | ')

        const wrapped = doc.splitTextToSize(line, 180)
        const requiredHeight = wrapped.length * 5

        if (y + requiredHeight > 280) {
          doc.addPage()
          y = 18
        }

        doc.text(wrapped, 14, y)
        y += requiredHeight + 3
      })

      doc.save('billing-submission-list.pdf')
      toast.success('Billing Submission PDF exported successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to export PDF')
    }
  }

  // ================= EXPORT EXCEL =================

  const handleExportExcel = () => {
    try {
      if (!billingSubmissionList.length) {
        toast.info('No Billing Submission records to export')
        return
      }

      const formattedData = billingSubmissionList.map((item, index) => ({
        'Sr No': index + 1,
        'Invoice No': item.invoice_no || '-',
        'Invoice Date': item.invoice_date
          ? formatDate(item.invoice_date)
          : '-',
        'Billing Amount': Number(item.billing_amount || 0),
        'Total Amount': Number(item.total_amount || 0),
        Status: item.is_active === false ? 'Inactive' : 'Active',
      }))

      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Billing Submissions',
      )

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      const fileData = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      })

      saveAs(fileData, 'billing-submission-list.xlsx')
      toast.success('Billing Submission Excel exported successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to export Excel')
    }
  }

  // ================= UI =================

  return (
    <CContainer fluid>
      <PageHeader
        title="Billing Submission Form"
        searchValue={search}
        onSearchChange={setSearch}
        onAddClick={() => navigate('/billing-submission-form/add')}
        addLabel="Add Billing Submission"
        showExport
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar autoHide>
            <CTable hover responsive align="middle">
              <CTableHead style={{ backgroundColor: '#f8f9fc' }}>
                <CTableRow>
                  <SortableHeaderCell
                    label="Invoice No"
                    sortKey="invoice_no"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Invoice Date"
                    sortKey="invoice_date"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Billing Amount"
                    sortKey="billing_amount"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Status"
                    sortKey="is_active"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <CTableHeaderCell className="text-center">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={5}
                      className="text-center py-4"
                    >
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : billingSubmissionList.length > 0 ? (
                  billingSubmissionList.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>
                        {item.invoice_no || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.invoice_date
                          ? formatDate(item.invoice_date)
                          : '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {formatAmount(item.billing_amount)}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.is_active === false ? (
                          <CTooltip content="Inactive" placement="top">
                            <span>
                              <CIcon
                                icon={cilXCircle}
                                className="text-danger"
                              />
                            </span>
                          </CTooltip>
                        ) : (
                          <CTooltip content="Active" placement="top">
                            <span>
                              <CIcon
                                icon={cilCheckCircle}
                                className="text-success"
                              />
                            </span>
                          </CTooltip>
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div
                          className="d-flex justify-content-center align-items-center gap-2"
                          style={{ minWidth: '120px' }}
                        >
                          {/* VIEW */}
                          <CTooltip content="View" placement="top">
                            <span style={{ display: 'inline-block' }}>
                              <ActionButton
                                color="primary"
                                icon={cilDescription}
                                onClick={() =>
                                  navigate(
                                    `/billing-submission-form/preview/${item.id}`,
                                  )
                                }
                              />
                            </span>
                          </CTooltip>

                          {/* EDIT */}
                          <CTooltip content="Edit" placement="top">
                            <span style={{ display: 'inline-block' }}>
                              <ActionButton
                                color="primary"
                                icon={cilPencil}
                                onClick={() =>
                                  navigate(
                                    `/billing-submission-form/edit/${item.id}`,
                                  )
                                }
                              />
                            </span>
                          </CTooltip>

                          {/* DELETE - ONLY ON INDEX */}
                          <CTooltip content="Delete" placement="top">
                            <span style={{ display: 'inline-block' }}>
                              <ActionButton
                                color="danger"
                                icon={cilTrash}
                                disabled={deletingId === item.id}
                                onClick={() => confirmDelete(item.id)}
                              />
                            </span>
                          </CTooltip>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <TableEmptyState colSpan={5} />
                )}
              </CTableBody>
            </CTable>
          </SimpleBar>

          <AppPagination
            page={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={limit}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setLimit(size)
              setPage(1)
            }}
          />
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Index
