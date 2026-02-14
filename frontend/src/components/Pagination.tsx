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

export function Pagination({ page, totalPages, totalElements, size, onPageChange, onSizeChange }: PaginationProps) {
  const from = totalElements === 0 ? 0 : page * size + 1
  const to = Math.min((page + 1) * size, totalElements)

  return (
    <div className={styles.wrap}>
      <div className={styles.info}>
        Showing {from}–{to} of {totalElements}
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
            First
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className={styles.btn}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className={styles.pageNum}>
            Page {page + 1} of {totalPages || 1}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className={styles.btn}
            aria-label="Next page"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
            className={styles.btn}
            aria-label="Last page"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}
