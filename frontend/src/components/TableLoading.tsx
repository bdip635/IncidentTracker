import styles from '../styles/TableLoading.module.css'

interface TableLoadingProps {
  rows: number
  cols: number
}

export function TableLoading({ rows, cols }: TableLoadingProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}><span className={styles.skeleton} /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {Array.from({ length: cols }).map((_, colIdx) => (
              <td key={colIdx}><span className={styles.skeleton} style={{ width: colIdx === 0 ? '80%' : '60%' }} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
