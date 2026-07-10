import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CRow,
  CCol,
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
  CButton,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilDescription,
  cilPlus,
} from '@coreui/icons'

import { toast } from 'react-toastify'
import api from '../../api/axios'

import SortableHeaderCell from '../components/sort-table-header'
import PageHeader from '../components/form-header'
import AppPagination from '../components/app-pagination'

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
  const [hrm, setHrm] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

  const fetchHrm = async () => {
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

      const response = await api.get('/employee', { params })

      setHrm(response.data?.data ?? [])
      setTotalPages(response.data?.totalPages ?? 1)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch employee list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchHrm()
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
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employee/${id}`)
      toast.success('Employee deleted successfully')
      fetchHrm()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to delete employee')
    }
  }

  return (
    <CContainer fluid>
      <PageHeader
        title="Employee Listing"
        searchValue={search}
        onSearchChange={setSearch}
        onAddClick={() => navigate('/hrm/add')}
        addLabel="Add Employee"
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <SortableHeaderCell label="S.No" sortKey="id" sort={sort} onSort={handleSort} />

                <SortableHeaderCell
                  label="Emp Code"
                  sortKey="employee_code"
                  sort={sort}
                  onSort={handleSort}
                />

                <SortableHeaderCell
                  label="Full Name"
                  sortKey="full_name"
                  sort={sort}
                  onSort={handleSort}
                />

                <SortableHeaderCell label="Email" sortKey="email" sort={sort} onSort={handleSort} />

                <SortableHeaderCell
                  label="Contact"
                  sortKey="contact_no"
                  sort={sort}
                  onSort={handleSort}
                />

                <SortableHeaderCell
                  label="HR Verified"
                  sortKey="hr_verified"
                  sort={sort}
                  onSort={handleSort}
                />

                <SortableHeaderCell
                  label="Onboarded On"
                  sortKey="onboarded_on"
                  sort={sort}
                  onSort={handleSort}
                />

                <SortableHeaderCell
                  label="Status"
                  sortKey="status"
                  sort={sort}
                  onSort={handleSort}
                />

                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center">
                    <CSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : hrm.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center">
                    No Employees Found
                  </CTableDataCell>
                </CTableRow>
              ) : (
                hrm.map((item, index) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{(page - 1) * limit + index + 1}</CTableDataCell>

                    <CTableDataCell>{item.employee_code}</CTableDataCell>

                    <CTableDataCell>
                      {item.first_name} {item.middle_name ? item.middle_name + ' ' : ''}
                      {item.last_name}
                    </CTableDataCell>

                    <CTableDataCell>{item.email}</CTableDataCell>

                    <CTableDataCell>{item.contact_no}</CTableDataCell>

                    <CTableDataCell className="text-center">
                      {item.hr_verified ? (
                        <CIcon icon={cilCheckCircle} className="text-success" />
                      ) : (
                        <CIcon icon={cilXCircle} className="text-danger" />
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.date_of_joining
                        ? new Date(item.date_of_joining).toLocaleDateString('en-GB')
                        : '-'}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.is_active ? (
                        <span className="text-success">
                          <CIcon icon={cilCheckCircle} className="me-1" />
                        </span>
                      ) : (
                        <span className="text-danger">
                          <CIcon icon={cilXCircle} className="me-1" />
                        </span>
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="d-flex gap-2">
                        <CTooltip content="Edit">
                          <CButton
                            color="primary"
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/hrm/${item.id}`)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                        </CTooltip>

                        <CTooltip content="Add Additional Details">
                          <CButton
                            color="primary"
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/hrm/${item.id}/more-details`)}
                          >
                            <CIcon icon={cilPlus} />
                          </CButton>
                        </CTooltip>

                        <CTooltip content="View">
                          <CButton
                            color="info"
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/hrm/${item.id}/preview`)}
                          >
                            <CIcon icon={cilDescription} />
                          </CButton>
                        </CTooltip>

                        <CTooltip content="Delete">
                          <CButton
                            color="danger"
                            size="sm"
                            variant="ghost"
                            onClick={() => confirmDelete(item.id)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTooltip>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>

          <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Index
