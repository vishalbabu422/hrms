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
  CSpinner,
  CTooltip,
  CButton,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons'

import SimpleBar from 'simplebar-react'
import { toast } from 'react-toastify'

import SortableHeaderCell from '../components/sort-table-header'
import AppPagination from '../components/app-pagination'
import TableEmptyState from '../components/table-empty'
import PageHeader from '../components/form-header'
import ActionButton from '../components/action-button'
import api from '../../api/axios'

const Index = () => {
  const navigate = useNavigate()

  const [sort, setSort] = useState({ key: 'id', order: 'desc' })
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {
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

      const response = await api.get(`/employee-salary-structure?models=salaryStructure,employee`, {
        params,
      })

      const data = response?.data?.data || []

      setList(data)
      setTotalPages(response?.data?.meta?.total_pages || 1)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    fetchData()
  }, [search, sort, page])

  /* ================= DELETE ================= */

  const confirmDelete = (id) => {
    if (!window.confirm('Delete this record?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employee-salary-structure/${id}`)

      toast.success('Deleted successfully')
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error('Delete failed')
    }
  }

  /* ================= SORT ================= */

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === 'asc' ? 'desc' : 'asc' }
      }
      return { key, order: 'asc' }
    })
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid>
      <PageHeader
        title="Employee Salary Structure"
        onSearchChange={setSearch}
        onAddClick={() => navigate('/emp-salary-structure/add')}
        addLabel="Add Structure"
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar>
            <CTable hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Employee</CTableHeaderCell>
                  <CTableHeaderCell>Structure</CTableHeaderCell>

                  <SortableHeaderCell label="CTC" sortKey="ctc" sort={sort} onSort={handleSort} />

                  <SortableHeaderCell
                    label="Effective From"
                    sortKey="effective_from"
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
                    <CTableDataCell colSpan={6} className="text-center py-4">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : list.length > 0 ? (
                  list.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{`${item?.employee?.first_name} ${item?.employee?.middle_name ?? ''} ${item?.employee?.last_name ?? ''}`}</CTableDataCell>

                      <CTableDataCell>{item?.salaryStructure?.name}</CTableDataCell>

                      <CTableDataCell>{item.ctc}</CTableDataCell>

                      <CTableDataCell>{item.effective_from}</CTableDataCell>

                      <CTableDataCell>
                        {item.is_active ? (
                          <CIcon icon={cilCheckCircle} className="text-success" />
                        ) : (
                          <CIcon icon={cilXCircle} className="text-danger" />
                        )}
                      </CTableDataCell>

                    <CTableDataCell>
  <div
    className="d-flex justify-content-center align-items-center gap-2"
    style={{ minWidth: '100px' }}
  >
    {/* EDIT */}
    <CTooltip
      content="Edit"
      placement="top"
    >
      <div
        style={{
          display: 'inline-block',
          cursor: 'pointer',
        }}
        onClick={() =>
          navigate(
            `/emp-salary-structure/edit/${item.id}`,
          )
        }
      >
        <ActionButton
          color="primary"
          icon={cilPencil}
        />
      </div>
    </CTooltip>

    {/* DELETE */}
    <CTooltip
      content="Delete"
      placement="top"
    >
      <div
        style={{
          display: 'inline-block',
          cursor: 'pointer',
        }}
        onClick={() =>
          confirmDelete(item.id)
        }
      >
        <ActionButton
          color="danger"
          icon={cilTrash}
        />
      </div>
    </CTooltip>
  </div>
</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <TableEmptyState colSpan={6} />
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
