import { useState, useEffect } from 'react'
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
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilDescription } from '@coreui/icons'

import SimpleBar from 'simplebar-react'
import { toast } from 'react-toastify'
import api from '../../api/axios'

import SortableHeaderCell from '../components/sort-table-header'
import AppPagination from '../components/app-pagination'
import TableEmptyState from '../components/table-empty'
import PageHeader from '../components/form-header'
import ActionButton from '../components/action-button'

const Index = () => {
  const navigate = useNavigate()

  const [sort, setSort] = useState({
    key: 'id',
    order: 'desc',
  })

  const LIMIT = Number(import.meta.env.VITE_DEFAULT_LIMIT) || 10
  const [page, setPage] = useState(1)
  const [limit] = useState(LIMIT)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [workOrderDesgn, setWorkOrderDesgn] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

  const fetchWorkOrderDesgn = async () => {
    try {
      setLoading(true)

      const params = {
        sort: `${sort.key} ${sort.order}`,
        page,
        limit,
      }

      if (search.length >= 3) {
        params.search = search
      }

      const response = await api.get('/admin/workorder-desgn/index', { params })

      setWorkOrderDesgn(response.data?.data?.workOrderDesgnList || [])
      setTotalPages(response.data?.totalPages || 1)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch Work Order Designation')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchWorkOrderDesgn()
    }
  }, [search, sort, page])

  /* ================= SORT ================= */

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === 'asc' ? 'desc' : 'asc' }
      }
      return { key, order: 'asc' }
    })
  }

  /* ================= DELETE ================= */

  const confirmDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this Work Order Designations?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/workorder-desgn/delete/${id}`)
      toast.success('Work Order Designation deleted successfully')
      fetchWorkOrderDesgn()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  /* ================= EXPORT ================= */

  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 15

    doc.setFontSize(14)
    doc.text('Organization List', 10, 10)

    organization.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.org_name} - ${item.org_code} - ${item.contact_email}`, 10, y)
      y += 8
    })

    doc.save('organization-list.pdf')
  }

  const handleExportExcel = () => {
    const formattedData = organization.map((item, index) => ({
      'Sr No': index + 1,
      Organization: item.org_name,
      'Organization Code': item.org_code,
      Email: item.contact_email,
      Phone: item.contact_phone,
      Address: item.address,
      Status: item.is_active ? 'Active' : 'Inactive',
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Organizations')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'organization-list.xlsx')
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid className="py-4">
      {/* ================= PAGE HEADER ================= */}
      <PageHeader
        title="Work Order Designation"
        onSearchChange={setSearch}
        onAddClick={() => navigate('/work-order-desgn/add')}
        addLabel="Add"
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        showExport
      />

      {/* ================= TABLE CARD ================= */}
      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar>
            <CTable hover responsive align="middle" className="rounded overflow-hidden">
              <CTableHead style={{ backgroundColor: '#f8f9fc' }}>
                <CTableRow>
                  <SortableHeaderCell
                    label="Work Order"
                    sortKey="work_order_id"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="GST Code"
                    sortKey="sac_code"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Deployment From"
                    sortKey="deployment_from"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Deployment To"
                    sortKey="deployment_to"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Status"
                    sortKey="is_active"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center py-4">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : workOrderDesgn.length > 0 ? (
                  workOrderDesgn.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell className="fw-semibold">
                        {item?.WorkOrder.work_order_no}
                      </CTableDataCell>
                      <CTableDataCell>{item.code}</CTableDataCell>
                      <CTableDataCell>{item.sac_code}</CTableDataCell>
                      <CTableDataCell>{item.deployment_from}</CTableDataCell>
                      <CTableDataCell>{item.deployment_to}</CTableDataCell>

                      <CTableDataCell className="text-center">
                        {item.is_active ? (
                          <CIcon icon={cilCheckCircle} className="text-success" size="lg" />
                        ) : (
                          <CIcon icon={cilXCircle} className="text-danger" size="lg" />
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex justify-content-center gap-2">
                          <CTooltip content="Preview">
                            <div>
                              <ActionButton
                                color="primary"
                                icon={cilDescription}
                                onClick={() => navigate(`/work-order-desgn/preview/${item.id}`)}
                              />
                            </div>
                          </CTooltip>

                          <CTooltip content="Edit">
                            <div>
                              <ActionButton
                                color="primary"
                                icon={cilPencil}
                                onClick={() => navigate(`/work-order-desgn/edit/${item.id}`)}
                              />
                            </div>
                          </CTooltip>

                          {item.is_active && (
                            <CTooltip content="Delete">
                              <div>
                                <ActionButton
                                  color="danger"
                                  icon={cilTrash}
                                  onClick={() => confirmDelete(item.id)}
                                />
                              </div>
                            </CTooltip>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <TableEmptyState colSpan={7} />
                )}
              </CTableBody>
            </CTable>
          </SimpleBar>
          <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Index
