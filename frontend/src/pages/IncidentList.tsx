import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { incidentsApi } from '../api/incidents'
import type { Incident, ListParams, Severity, Status } from '../types/incident'
import { useDebounce } from '../hooks/useDebounce'
import { Pagination } from '../components/Pagination'
import { TableLoading } from '../components/TableLoading'
import { SERVICE_OPTIONS } from '../constants/services'
import styles from '../styles/IncidentList.module.css'

const SEVERITIES: Severity[] = ['SEV1', 'SEV2', 'SEV3', 'SEV4']
const STATUS_LABEL: Record<Status, string> = { OPEN: 'Open', MITIGATED: 'Mitigated', RESOLVED: 'Resolved' }
type SortKey = 'title' | 'service' | 'severity' | 'status' | 'createdAt' | 'updatedAt'

export function IncidentList() {
  const navigate = useNavigate()
  const [data, setData] = useState<{ content: Incident[]; totalElements: number; totalPages: number; page: number; size: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('createdAt,desc')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | ''>('')
  const [severityFilter, setSeverityFilter] = useState<Severity | ''>('')
  const [serviceFilter, setServiceFilter] = useState('')

  const debouncedSearch = useDebounce(searchInput, 350)

  const params: ListParams = {
    page,
    size,
    sort,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    severity: severityFilter || undefined,
    service: serviceFilter.trim() || undefined,
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    incidentsApi
      .list(params)
      .then((res) => {
        setData({
          content: res.content,
          totalElements: res.totalElements,
          totalPages: res.totalPages,
          page: res.page,
          size: res.size,
        })
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [page, size, sort, debouncedSearch, statusFilter, severityFilter, serviceFilter])

  const handleFilterClick = () => setPage(0)

  const handleSortHeader = (key: SortKey) => {
    const dir = sort.startsWith(key) && sort.endsWith('asc') ? 'desc' : 'asc'
    setSort(`${key},${dir}`)
    setPage(0)
  }

  const sortDir = (key: SortKey) => {
    if (!sort.startsWith(key)) return null
    return sort.endsWith('asc') ? 'asc' : 'desc'
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Service</label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className={styles.select}
            aria-label="Filter by service"
          >
            <option value="">All services</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Severity</label>
          <div className={styles.severityCheckboxes}>
            {SEVERITIES.map((sev) => (
              <label key={sev} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={severityFilter === sev}
                  onChange={(e) => setSeverityFilter(e.target.checked ? sev : '')}
                  className={styles.checkbox}
                />
                {sev}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter((e.target.value as Status) || '')}
            className={styles.select}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="MITIGATED">Mitigated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        <div className={styles.searchRow}>
          <input
            type="search"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.search}
            aria-label="Search incidents"
          />
          <button type="button" onClick={handleFilterClick} className={styles.filterBtn}>Filter</button>
        </div>
      </div>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.tableWrap}>
        {loading ? (
          <TableLoading rows={size} cols={5} />
        ) : data ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><button type="button" onClick={() => handleSortHeader('title')} className={styles.thBtn}>Title {sortDir('title') === 'asc' && '↑'}{sortDir('title') === 'desc' && '↓'}</button></th>
                  <th><button type="button" onClick={() => handleSortHeader('severity')} className={styles.thBtn}>Severity {sortDir('severity') === 'asc' && '↑'}{sortDir('severity') === 'desc' && '↓'}</button></th>
                  <th><button type="button" onClick={() => handleSortHeader('status')} className={styles.thBtn}>Status {sortDir('status') === 'asc' && '↑'}{sortDir('status') === 'desc' && '↓'}</button></th>
                  <th><button type="button" onClick={() => handleSortHeader('createdAt')} className={styles.thBtn}>Created At {sortDir('createdAt') === 'asc' && '↑'}{sortDir('createdAt') === 'desc' && '↓'}</button></th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr><td colSpan={5} className={styles.empty}>No incidents found.</td></tr>
                ) : (
                  data.content.map((inc) => (
                    <tr key={inc.id} onClick={() => navigate(`/incidents/${inc.id}`)} className={styles.rowLink}>
                      <td className={styles.cellTitle}><Link to={`/incidents/${inc.id}`} className={styles.titleLink} onClick={(e) => e.stopPropagation()}>{inc.title}</Link></td>
                      <td><span className={styles[`sev_${inc.severity}`]}>{inc.severity}</span></td>
                      <td><span className={styles[`status_${inc.status}`]}>{STATUS_LABEL[inc.status]}</span></td>
                      <td className={styles.cellDate}>{formatDate(inc.createdAt)}</td>
                      <td>{inc.owner ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              size={data.size}
              onPageChange={setPage}
              onSizeChange={(s) => { setSize(s); setPage(0) }}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
