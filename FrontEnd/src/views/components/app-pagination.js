import { CPagination, CPaginationItem } from '@coreui/react'

const AppPagination = ({
  page,
  totalPages,
  onPageChange,
  className = 'justify-content-end',
  ariaLabel = 'Pagination Navigation',
  maxVisiblePages = 5, // 👈 new prop
}) => {
  if (!totalPages || totalPages <= 1) return null

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

  return (
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
          {startPage > 2 && (
            <CPaginationItem disabled>...</CPaginationItem>
          )}
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
          <CPaginationItem
            onClick={() => handlePageChange(totalPages)}
          >
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
  )
}

export default AppPagination
