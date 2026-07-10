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
  const [limit] = useState(LIMIT)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [examination, setExamination] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

  const fetchExamination= async () => {
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

      const response = await api.get('/examinations', { params })

      setExamination(response.data?.data?? [])
      setTotalPages(response.data?.totalPages ?? 1)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch Examination list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchExamination()
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
    if (!window.confirm('Are you sure you want to delete this Examination?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/examinations/${id}`)
      toast.success('Examination deleted successfully')
      fetchExamination()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to delete Examination')
    }
  }

 
  return (
    <CContainer fluid>
      <PageHeader
        title="Examinations"
        onSearchChange={setSearch}
        onAddClick={() => navigate('/examination/add')}
        addLabel="Add Exam"
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar autoHide>
            <CTable hover responsive align="middle">
              <CTableHead style={{ backgroundColor: '#f8f9fc' }}>
                <CTableRow>
                  <SortableHeaderCell
                    label="Examination Name"
                    sortKey="examination_name"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Exam Type"
                    sortKey="exam_type"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Passing Marks"
                    sortKey="passing_marks"
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
                    <CTableDataCell colSpan={5} className="text-center py-4">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : examination.length > 0 ? (
                  examination.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item.examination_name || item.exam_name}</CTableDataCell>
                      <CTableDataCell>{item.exam_type || '-'}</CTableDataCell>
                      <CTableDataCell>{item.passing_marks || '-'}</CTableDataCell>

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
                            onClick={() => navigate(`/examination/preview/${item.id}`)}
                          /> */}
                          <ActionButton
                            color="primary"
                            icon={cilPencil}
                            onClick={() => navigate(`/examination/edit/${item.id}`)}
                          />
                          {item.is_active && (
                            <ActionButton
                              color="danger"
                              icon={cilTrash}
                              onClick={() => confirmDelete(item.id)}
                            />
                          )}
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
