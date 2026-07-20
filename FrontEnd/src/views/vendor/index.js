import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CSpinner,
  CTooltip,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilDescription, cilCheckCircle, cilXCircle } from '@coreui/icons'

import SimpleBar from 'simplebar-react'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'

import ActionButton from '../components/action-button'
import PageHeader from '../components/form-header'
import SortableHeaderCell from '../components/sort-table-header'
import TableEmptyState from '../components/table-empty'
import AppPagination from '../components/app-pagination'
import api from '../../api/axios'

const Index = () => {
  const navigate = useNavigate()

  const [sort, setSort] = useState({ key: 'id', order: 'desc' })
  const LIMIT = Number(import.meta.env.VITE_DEFAULT_LIMIT) || 10

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(LIMIT)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [vendor, setVendor] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH ================= */

  const fetchVendors = async () => {
    try {
      setLoading(true)

      const params = {
        sort: `${sort.key} ${sort.order}`,
        page,
        limit,
      }

      if (search.length >= 3) params.search = search

      const response = await api.get('/admin/vendor/index', { params })

      setVendor(response.data?.data?.vendorList ?? [])
      setTotalPages(response.data?.totalPages ?? 1)
      setTotalRecords(response.data?.total ?? 0)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch Vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      fetchVendors()
    }
  }, [search, sort, page, limit])

  /* ================= SORT ================= */

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, order: prev.order === 'asc' ? 'desc' : 'asc' }
        : { key, order: 'asc' },
    )
  }

  /* ================= DELETE ================= */

  const confirmDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this Vendor?')) return
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/vendor/delete/${id}`)
      toast.success('Vendor deleted successfully')
      fetchVendors()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to delete Vendor')
    }
  }

  /* ================= EXPORT ================= */

  const handleExportPDF = () => {
    const doc = new jsPDF()
    let y = 15

    doc.setFontSize(14)
    doc.text('Vendor List', 10, 10)

    vendor.forEach((v, index) => {
      doc.text(`${index + 1}. ${v.vendor_name} - ${v.vendor_code} - ${v.contact_email}`, 10, y)
      y += 8
    })

    doc.save('vendor-list.pdf')
  }

  const handleExportExcel = () => {
    const formattedData = vendor.map((v, index) => ({
      'Sr No': index + 1,
      Name: v.vendor_name,
      Code: v.vendor_code,
      Type: v.vendor_type,
      'Contact Person': v.contact_person,
      Email: v.contact_email,
      Phone: v.contact_phone,
      Status: v.is_active ? 'Active' : 'Inactive',
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(fileData, 'vendor-list.xlsx')
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid>
      <PageHeader
        title="Vendor"
        searchValue={search}
        onSearchChange={setSearch}
        onAddClick={() => navigate('/vendor/add')}
        addLabel="Add Vendor"
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
                    label="Name"
                    sortKey="vendor_name"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Code"
                    sortKey="vendor_code"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Type"
                    sortKey="vendor_type"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Contact Person"
                    sortKey="contact_person"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Contact Email"
                    sortKey="contact_email"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeaderCell
                    label="Contact Phone"
                    sortKey="contact_phone"
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
                ) : vendor.length > 0 ? (
                  vendor.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item.vendor_name}</CTableDataCell>
                      <CTableDataCell>{item.vendor_code}</CTableDataCell>
                      <CTableDataCell>{item.vendor_type}</CTableDataCell>
                      <CTableDataCell>{item.contact_person}</CTableDataCell>
                      <CTableDataCell>{item.contact_email}</CTableDataCell>
                      <CTableDataCell>{item.contact_phone}</CTableDataCell>

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
                              onClick={() => navigate(`/vendor/preview/${item.id}`)}
                            >
                              <ActionButton color="primary" icon={cilDescription} />
                            </div>
                          </CTooltip>

                          {/* EDIT */}
                          <CTooltip content="Edit" placement="top">
                            <div
                              style={{ display: 'inline-block', cursor: 'pointer' }}
                              onClick={() => navigate(`/vendor/edit/${item.id}`)}
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
