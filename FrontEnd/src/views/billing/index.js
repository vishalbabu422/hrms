import { useEffect, useState } from 'react'
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

  const LIMIT =
    Number(import.meta.env.VITE_DEFAULT_LIMIT) || 10

  const [pbgList, setPbgList] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')

  const [sort, setSort] = useState({
    key: 'id',
    order: 'desc',
  })

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(LIMIT)

  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  /* ================= FETCH ================= */

  const fetchPBGList = async () => {
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

      const response = await api.get(
        '/pbg-master/index',
        { params },
      )

      const data = response.data

      setPbgList(
        data?.data?.pbgList ||
          data?.data?.pbgMasterList ||
          data?.data ||
          [],
      )

      setTotalRecords(data?.total ?? 0)
      setTotalPages(data?.totalPages ?? 1)
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
          'Failed to fetch PBG list',
      )

      setPbgList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (
      search.length === 0 ||
      search.length >= 3
    ) {
      fetchPBGList()
    }
  }, [search, sort, page, limit])

  /* ================= SORT ================= */

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return {
          key,
          order:
            prev.order === 'asc'
              ? 'desc'
              : 'asc',
        }
      }

      return {
        key,
        order: 'asc',
      }
    })
  }

  /* ================= DELETE ================= */

  const confirmDelete = (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this PBG?',
      )
    ) {
      return
    }

    handleDelete(id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pbg-master/${id}`)

      toast.success('PBG deleted successfully')

      fetchPBGList()
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
          'Failed to delete PBG',
      )
    }
  }

  /* ================= EXPORT PDF ================= */

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF()

      let y = 15

      doc.setFontSize(16)
      doc.text('PBG List', 10, 10)

      doc.setFontSize(10)

      pbgList.forEach((item, index) => {
        const line = [
          `${index + 1}.`,
          `PBG No: ${item.pbg_no || '-'}`,
          `Start: ${formatDate(item.start_date)}`,
          `End: ${formatDate(item.end_date)}`,
          `NICSI Reg. No: ${
            item.nicsi_reg_no || '-'
          }`,
          `NICSI Date: ${formatDate(
            item.nicsi_reg_date,
          )}`,
          `Status: ${
            item.is_active
              ? 'Active'
              : 'Inactive'
          }`,
        ].join(' | ')

        doc.text(line, 10, y)

        y += 8

        if (y > 280) {
          doc.addPage()
          y = 15
        }
      })

      doc.save('pbg-list.pdf')

      toast.success(
        'PBG PDF exported successfully',
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to export PDF',
      )
    }
  }

  /* ================= EXPORT EXCEL ================= */

  const handleExportExcel = () => {
    try {
      const formattedData = pbgList.map(
        (item, index) => ({
          'Sr No': index + 1,
          'PBG No': item.pbg_no || '-',
          'Start Date': formatDate(
            item.start_date,
          ),
          'End Date': formatDate(
            item.end_date,
          ),
          'NICSI Reg. No':
            item.nicsi_reg_no || '-',
          'NICSI Date': formatDate(
            item.nicsi_reg_date,
          ),
          Status: item.is_active
            ? 'Active'
            : 'Inactive',
        }),
      )

      const worksheet =
        XLSX.utils.json_to_sheet(
          formattedData,
        )

      const workbook =
        XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'PBG',
      )

      const excelBuffer = XLSX.write(
        workbook,
        {
          bookType: 'xlsx',
          type: 'array',
        },
      )

      const fileData = new Blob(
        [excelBuffer],
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        },
      )

      saveAs(
        fileData,
        'pbg-list.xlsx',
      )

      toast.success(
        'PBG Excel exported successfully',
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to export Excel',
      )
    }
  }

  /* ================= UI ================= */

  return (
    <CContainer fluid>
      <PageHeader
        title="PBG"
        searchValue={search}
        onSearchChange={setSearch}
        onAddClick={() =>
          navigate('/pbg/add')
        }
        addLabel="Add PBG"
        showExport
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      <CCard className="shadow border-0 rounded-4">
        <CCardBody>
          <SimpleBar autoHide>
            <CTable
              hover
              responsive
              align="middle"
            >
              <CTableHead
                style={{
                  backgroundColor:
                    '#f8f9fc',
                }}
              >
                <CTableRow>
                  <SortableHeaderCell
                    label="PBG No"
                    sortKey="pbg_no"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="Start Date"
                    sortKey="start_date"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="End Date"
                    sortKey="end_date"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="NICSI Reg. No"
                    sortKey="nicsi_reg_no"
                    sort={sort}
                    onSort={handleSort}
                  />

                  <SortableHeaderCell
                    label="NICSI Date"
                    sortKey="nicsi_reg_date"
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
                      colSpan={7}
                      className="text-center py-4"
                    >
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : pbgList.length > 0 ? (
                  pbgList.map((item) => (
                    <CTableRow
                      key={item.id}
                    >
                      <CTableDataCell>
                        {item.pbg_no || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {formatDate(
                          item.start_date,
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        {formatDate(
                          item.end_date,
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.nicsi_reg_no ||
                          '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {formatDate(
                          item.nicsi_reg_date,
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.is_active ? (
                          <CIcon
                            icon={
                              cilCheckCircle
                            }
                            className="text-success"
                          />
                        ) : (
                          <CIcon
                            icon={
                              cilXCircle
                            }
                            className="text-danger"
                          />
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div
                          className="d-flex justify-content-center align-items-center gap-2"
                          style={{
                            minWidth:
                              '120px',
                          }}
                        >
                          <CTooltip
                            content="View"
                            placement="top"
                          >
                            <div
                              style={{
                                display:
                                  'inline-block',
                                cursor:
                                  'pointer',
                              }}
                              onClick={() =>
                                navigate(
                                  `/pbg/preview/${item.id}`,
                                )
                              }
                            >
                              <ActionButton
                                color="primary"
                                icon={
                                  cilDescription
                                }
                              />
                            </div>
                          </CTooltip>

                          <CTooltip
                            content="Edit"
                            placement="top"
                          >
                            <div
                              style={{
                                display:
                                  'inline-block',
                                cursor:
                                  'pointer',
                              }}
                              onClick={() =>
                                navigate(
                                  `/pbg/edit/${item.id}`,
                                )
                              }
                            >
                              <ActionButton
                                color="primary"
                                icon={
                                  cilPencil
                                }
                              />
                            </div>
                          </CTooltip>

                          <CTooltip
                            content="Delete"
                            placement="top"
                          >
                            <div
                              style={{
                                display:
                                  'inline-block',
                                cursor:
                                  'pointer',
                              }}
                              onClick={() =>
                                confirmDelete(
                                  item.id,
                                )
                              }
                            >
                              <ActionButton
                                color="danger"
                                icon={
                                  cilTrash
                                }
                              />
                            </div>
                          </CTooltip>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <TableEmptyState
                    colSpan={7}
                  />
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