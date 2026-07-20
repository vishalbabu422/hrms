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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons'

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
  const LIMIT = Number(import.meta.env.VITE_DEFAULT_LIMIT) || 10
  const [sort, setSort] = useState({ key: 'id', order: 'desc' })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(LIMIT)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [salaryList, setSalaryList] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

  const fetchSalary = async () => {
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

      const res = await api.get('salary-component', { params })

      setSalaryList(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotalRecords(res.data?.total || 0)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch salary components')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchSalary()
    }
  }, [search, sort, page, limit])

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
    if (!window.confirm('Are you sure you want to delete this component?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`salary-component/${id}`)
      toast.success('Deleted successfully')
      fetchSalary()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid>
      <PageHeader
        title="Salary Component"
        onSearchChange={setSearch}
        onAddClick={() => navigate('/salary-component/add')}
        addLabel="Add Salary Component"
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar>
            <CTable hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <SortableHeaderCell label="Name" sortKey="name" sort={sort} onSort={handleSort} />
                  <SortableHeaderCell label="Code" sortKey="code" sort={sort} onSort={handleSort} />
                  <SortableHeaderCell label="Type" sortKey="type" sort={sort} onSort={handleSort} />
                  <SortableHeaderCell
                    label="Value Type"
                    sortKey="value_type"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Amount"
                    sortKey="amount"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Percentage"
                    sortKey="percentage"
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
                    <CTableDataCell colSpan={9} className="text-center py-4">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : salaryList.length > 0 ? (
                  salaryList.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>{item.code}</CTableDataCell>
                      <CTableDataCell>{item.type}</CTableDataCell>
                      <CTableDataCell>{item.value_type}</CTableDataCell>
                      <CTableDataCell>{item.amount || '-'}</CTableDataCell>
                      <CTableDataCell>{item.percentage || '-'}</CTableDataCell>

                      <CTableDataCell>
                        {item.is_active ? (
                          <CIcon icon={cilCheckCircle} className="text-success" />
                        ) : (
                          <CIcon icon={cilXCircle} className="text-danger" />
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex justify-content-center gap-2">
                          <ActionButton
                            color="primary"
                            icon={cilPencil}
                            onClick={() => navigate(`/salary-component/edit/${item.id}`)}
                          />
                          <ActionButton
                            color="danger"
                            icon={cilTrash}
                            onClick={() => confirmDelete(item.id)}
                          />
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <TableEmptyState colSpan={9} />
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
