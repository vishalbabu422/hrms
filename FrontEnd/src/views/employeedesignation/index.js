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
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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
  const [limit, setLimit] = useState(LIMIT)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [designation, setDesignation] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

  const fetchDesignation = async () => {
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

      const response = await api.get('/designation', { params })

      setDesignation(response.data?.data?.DesignationList ?? [])
      setTotalPages(response.data?.totalPages ?? 1)
      setTotalRecords(response.data?.total ?? 0)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch designation list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchDesignation()
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
    if (!window.confirm('Are you sure you want to delete this Designation?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/designation/${id}`)
      toast.success('Designation deleted successfully')
      fetchDesignation()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to delete Designation')
    }
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid>
      <PageHeader
        title="Designation List"
        onSearchChange={setSearch}
        onAddClick={() => navigate('/employeedesignation/add')}
        addLabel="Add Designation"
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar autoHide>
            <CTable hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <SortableHeaderCell
                    label="Designation Name"
                    sortKey="designation"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Designation Code"
                    sortKey="designation_code"
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
                    <CTableDataCell colSpan={3} className="text-center py-4">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : designation.length > 0 ? (
                  designation.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item.designation_name}</CTableDataCell>

                      <CTableDataCell>{item.designation_code || '-'}</CTableDataCell>

                      <CTableDataCell>
                        {item.is_active ? (
                          <CIcon icon={cilCheckCircle} className="text-success" />
                        ) : (
                          <CIcon icon={cilXCircle} className="text-danger" />
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex justify-content-center gap-2">
                          {/* <ActionButton
                            color="primary"
                            icon={cilDescription}
                            onClick={() => navigate(`/employeedesignation/preview/${item.id}`)}
                          /> */}
                          <ActionButton
                            color="primary"
                            icon={cilPencil}
                            onClick={() => navigate(`/employeedesignation/edit/${item.id}`)}
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
                  <TableEmptyState colSpan={4} />
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
