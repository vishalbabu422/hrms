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
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilPlus } from '@coreui/icons'

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

  const [sort, setSort] = useState({ key: 'id', order: 'desc' })
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

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

      const res = await api.get('/salary-structure?models=structureComponents.salaryComponent', {
        params,
      })

      setList(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch Salary Structure')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchData()
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
    if (!window.confirm('Are you sure you want to delete this record?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/salary-structure/${id}`)
      toast.success('Deleted successfully')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid>
      <PageHeader
        title="Salary Structure"
        onSearchChange={setSearch}
        onAddClick={() => navigate('/salary-structure/add')}
        addLabel="Add Structure"
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar>
            <CTable hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <SortableHeaderCell label="Name" sortKey="name" sort={sort} onSort={handleSort} />

                  <SortableHeaderCell
                    label="Description"
                    sortKey="description"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <CTableHeaderCell>Components</CTableHeaderCell>

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
                    <CTableDataCell colSpan={5} className="text-center py-4">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : list.length > 0 ? (
                  list.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item.name}</CTableDataCell>

                      <CTableDataCell>{item.description || '-'}</CTableDataCell>

                      <CTableDataCell>
                        {item?.structureComponents?.length > 0
                          ? item.structureComponents
                              .map((comps) => {
                                return comps?.salaryComponent?.code
                              })
                              .join(', ')
                          : '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item?.is_active ? (
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
                            onClick={() => navigate(`/salary-structure/edit/${item.id}`)}
                          />
                          <ActionButton
                            color="primary"
                            icon={cilPlus}
                            onClick={() => navigate(`/salary-structure/${item.id}/add-employee`)}
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
                  <TableEmptyState colSpan={5} />
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
