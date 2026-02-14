import styles from '../styles/Pagination.module.css'

const SIZES = [5, 10, 20, 50]

interface PaginationProps {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

function getPageNumbers(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }
  const pages: (number | 'ellipsis')[] = []
  if (page <= 3) {
    for (let i = 0; i < 5; i++) pages.push(i)
    pages.push('ellipsis')
    pages.push(totalPages - 1)
  } else if (page >= totalPages - 4) {
    pages.push(0)
    pages.push('ellipsis')
    for (let i = totalPages - 5; i < totalPages; i++) pages.push(i)
  } else {
    pages.push(0)
    pages.push('ellipsis')
    for (let i = page - 1; i <= page + 1; i++) pages.push(i)
    pages.push('ellipsis')
    pages.push(totalPages - 1)
  }
  return pages
}

export function Pagination({ page, totalPages, totalElements, size, onPageChange, onSizeChange }: PaginationProps) {
  const from = totalElements === 0 ? 0 : page * size + 1
  const to = Math.min((page + 1) * size, totalElements)
  const pageNumbers = getPageNumbers(page, totalPages || 1)

  return (
    <div className={styles.wrap}>
      <div className={styles.info}>
        Page {page + 1} of {totalPages || 1}
      </div>
      <div className={styles.controls}>
        <label className={styles.sizeLabel}>
          Per page
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className={styles.sizeSelect}
            aria-label="Items per page"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => onPageChange(0)}
            disabled={page === 0}
            className={styles.btn}
            aria-label="First page"
          >
            &laquo;
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className={styles.btn}
            aria-label="Previous page"
          >
            &lsaquo;
          </button>
          {pageNumbers.map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`e-${i}`} className={styles.pageNum}>...</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={p === page ? `${styles.btn} ${styles.btnCurrent}` : styles.btn}
                aria-label={`Page ${p + 1}`}
              >
                {p + 1}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className={styles.btn}
            aria-label="Next page"
          >
            &rsaquo;
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
            className={styles.btn}
            aria-label="Last page"
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  )
}
