import { CPagination, CPaginationItem, CFormSelect } from '@coreui/react'

const AppPagination = ({
  page,
  totalPages,
  onPageChange,
  className = 'justify-content-end',
  ariaLabel = 'Pagination Navigation',
  maxVisiblePages = 5,

  //  ADDED
  totalRecords = 0,
  pageSize = Number(import.meta.env.VITE_DEFAULT_LIMIT) || 50,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
}) => {
  if (!totalPages || totalPages < 1) return null

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return
    onPageChange(newPage)
  }

  // Calculate visible page range
  const half = Math.floor(maxVisiblePages / 2)
  let startPage = Math.max(1, page - half)
  let endPage = Math.min(totalPages, page + half)

  if (page <= half) {
    endPage = Math.min(totalPages, maxVisiblePages)
  }

  if (page + half >= totalPages) {
    startPage = Math.max(1, totalPages - maxVisiblePages + 1)
  }

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  //  ADDED
  const startRecord = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1

  const endRecord = Math.min(page * pageSize, totalRecords)

  return (
    // <div className="d-flex align-items-center w-100">
    //   {/* Left */}
    //   <div
    //     className="d-flex align-items-center"
    //     style={{
    //       width: 'fit-content',
    //       gap: '12px',
    //       flexShrink: 0,
    //       whiteSpace: 'nowrap',
    //     }}
    //   >
    //     <span>Result per page</span>

    //     <CFormSelect
    //       size="sm"
    //       value={pageSize}
    //       style={{ width: '60px' }}
    //       onChange={(e) => onPageSizeChange(Number(e.target.value))}
    //     >
    //       {pageSizeOptions.map((size) => (
    //         <option key={size} value={size}>
    //           {size}
    //         </option>
    //       ))}
    //     </CFormSelect>
    //   </div>

    //   {/* Center */}
    //    <div
    //     style={{
    //       flex: 1,
    //       textAlign: 'center',
    //       whiteSpace: 'nowrap',
    //     }}
    //   >
    //     Displaying{' '}
    //     <strong>
    //       {startRecord}-{endRecord}
    //     </strong>{' '}
    //     of <strong>{totalRecords.toLocaleString()}</strong> records
    //   </div>

    //   {/* Right */}
    //   <div className="d-flex justify-content-end" style={{ minWidth: '260px', marginTop: '5px' }}>
    //     <CPagination className={className} aria-label={ariaLabel}>
    //       {/* Previous */}
    //       <CPaginationItem disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
    //         &laquo;
    //       </CPaginationItem>

    //       {/* First page + ellipsis */}
    //       {startPage > 1 && (
    //         <>
    //           <CPaginationItem onClick={() => handlePageChange(1)}>1</CPaginationItem>

    //           {startPage > 2 && <CPaginationItem disabled>...</CPaginationItem>}
    //         </>
    //       )}

    //       {/* Visible pages */}
    //       {pages.map((pageNumber) => (
    //         <CPaginationItem
    //           key={pageNumber}
    //           active={page === pageNumber}
    //           onClick={() => handlePageChange(pageNumber)}
    //         >
    //           {pageNumber}
    //         </CPaginationItem>
    //       ))}

    //       {/* Last page + ellipsis */}
    //       {endPage < totalPages && (
    //         <>
    //           {endPage < totalPages - 1 && <CPaginationItem disabled>...</CPaginationItem>}

    //           <CPaginationItem onClick={() => handlePageChange(totalPages)}>
    //             {totalPages}
    //           </CPaginationItem>
    //         </>
    //       )}

    //       {/* Next */}
    //       <CPaginationItem
    //         disabled={page === totalPages}
    //         onClick={() => handlePageChange(page + 1)}
    //       >
    //         &raquo;
    //       </CPaginationItem>
    //     </CPagination>
    //   </div>
    // </div>

    <div className="d-flex align-items-center w-100">
  {/* Left */}
  <div
    className="d-flex align-items-center"
    style={{
      flex: 1,
      justifyContent: 'flex-start',
      gap: '12px',
    }}
  >
    <span>Result per page</span>

    <CFormSelect
      size="sm"
      value={pageSize}
      style={{ width: '60px' }}
      onChange={(e) => onPageSizeChange(Number(e.target.value))}
    >
      {pageSizeOptions.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </CFormSelect>
  </div>

  {/* Center */}
  <div
    style={{
      flex: 1,
      textAlign: 'center',
    }}
  >
    Displaying <strong>{startRecord}-{endRecord}</strong> of{' '}
    <strong>{totalRecords.toLocaleString()}</strong> records
  </div>

 {/* Right */}
<div
  style={{
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  }}
>
  <CPagination className={className} aria-label={ariaLabel}>
    {/* Previous */}
    <CPaginationItem
      disabled={page === 1}
      onClick={() => handlePageChange(page - 1)}
    >
      &laquo;
    </CPaginationItem>

    {/* First page + ellipsis */}
    {startPage > 1 && (
      <>
        <CPaginationItem onClick={() => handlePageChange(1)}>
          1
        </CPaginationItem>

        {startPage > 2 && <CPaginationItem disabled>...</CPaginationItem>}
      </>
    )}

    {/* Visible pages */}
    {pages.map((pageNumber) => (
      <CPaginationItem
        key={pageNumber}
        active={page === pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </CPaginationItem>
    ))}

    {/* Last page + ellipsis */}
    {endPage < totalPages && (
      <>
        {endPage < totalPages - 1 && (
          <CPaginationItem disabled>...</CPaginationItem>
        )}

        <CPaginationItem onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </CPaginationItem>
      </>
    )}

    {/* Next */}
    <CPaginationItem
      disabled={page === totalPages}
      onClick={() => handlePageChange(page + 1)}
    >
      &raquo;
    </CPaginationItem>
  </CPagination>
</div>





      
    
  </div>
  )
}

export default AppPagination
