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
  const [company, setCompany] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

  const fetchCompany = async () => {
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

      const response = await api.get('/admin/company/index', { params })

      setCompany(response.data?.data?.companyList ?? [])
      setTotalPages(response.data?.totalPages ?? 1)
      setTotalRecords(response.data?.total ?? 0)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch Company list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchCompany()
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
    if (!window.confirm('Are you sure you want to delete this Company?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/company/delete/${id}`)
      toast.success('Company deleted successfully')
      fetchCompany()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to delete Company')
    }
  }

  /* ================= EXPORT ================= */

  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 15

    doc.setFontSize(14)
    doc.text('Company List', 10, 10)

    organization.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.org_name} - ${item.org_code} - ${item.contact_email}`, 10, y)
      y += 8
    })

    doc.save('company-list.pdf')
  }

  const handleExportExcel = () => {
    const formattedData = organization.map((item, index) => ({
      'Sr No': index + 1,
      Organisation: item.org_name,
      'Organisation Code': item.org_code,
      Email: item.contact_email,
      Phone: item.contact_phone,
      Address: item.address,
      Status: item.is_active ? 'Active' : 'Inactive',
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Companies')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'company-list.xlsx')
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid>
      <PageHeader
        title="Company"
        searchValue={search}
        onSearchChange={setSearch}
        onAddClick={() => navigate('/company/add')}
        addLabel="Add Company"
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
                    label="Organisation"
                    sortKey="org_name"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Name"
                    sortKey="company_name"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Code"
                    sortKey="company_code"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Email"
                    sortKey="official_email"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Phone"
                    sortKey="official_phone"
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
                    <CTableDataCell colSpan={8} className="text-center py-4">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : company.length > 0 ? (
                  company.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item?.Organization?.org_name}</CTableDataCell>
                      <CTableDataCell>{item.company_name}</CTableDataCell>
                      <CTableDataCell>{item.company_code}</CTableDataCell>
                      <CTableDataCell>{item.official_email}</CTableDataCell>
                      <CTableDataCell>{item.official_phone}</CTableDataCell>

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
                          style={{ minWidth: '120px' }}
                        >
                          {/* VIEW */}
                          <CTooltip content="View" placement="top">
                            <div
                              style={{ display: 'inline-block', cursor: 'pointer' }}
                              onClick={() => navigate(`/company/preview/${item.id}`)}
                            >
                              <ActionButton color="primary" icon={cilDescription} />
                            </div>
                          </CTooltip>

                          {/* EDIT */}
                          <CTooltip content="Edit" placement="top">
                            <div
                              style={{ display: 'inline-block', cursor: 'pointer' }}
                              onClick={() => navigate(`/company/edit/${item.id}`)}
                            >
                              <ActionButton color="primary" icon={cilPencil} />
                            </div>
                          </CTooltip>

                          {/* DELETE */}
                          <div
                            style={{
                              width: '32px',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            {item.is_active ? (
                              <CTooltip content="Delete" placement="top">
                                <div
                                  style={{ display: 'inline-block', cursor: 'pointer' }}
                                  onClick={() => confirmDelete(item.id)}
                                >
                                  <ActionButton color="danger" icon={cilTrash} />
                                </div>
                              </CTooltip>
                            ) : (
                              <span style={{ visibility: 'hidden' }}>X</span>
                            )}
                          </div>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <TableEmptyState colSpan={8} />
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
