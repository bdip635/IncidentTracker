import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { incidentsApi } from '../api/incidents'
import type { Incident, ListParams, Severity, Status } from '../types/incident'
import { useDebounce } from '../hooks/useDebounce'
import { Pagination } from '../components/Pagination'
import { TableLoading } from '../components/TableLoading'
import styles from '../styles/IncidentList.module.css'

type SortKey = 'title' | 'service' | 'severity' | 'status' | 'createdAt' | 'updatedAt'
const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'createdAt,desc', label: 'Newest first' },
  { value: 'createdAt,asc', label: 'Oldest first' },
  { value: 'updatedAt,desc', label: 'Recently updated' },
  { value: 'title,asc', label: 'Title A–Z' },
  { value: 'severity,asc', label: 'Severity (SEV1 first)' },
  { value: 'status,asc', label: 'Status' },
]

export function IncidentList() {
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

  const handleSortHeader = (key: SortKey) => {
    const dir = sort.startsWith(key) && sort.endsWith('asc') ? 'desc' : 'asc'
    setSort(`${key},${dir}`)
    setPage(0)
  }

  const sortDir = (key: SortKey) => {
    if (!sort.startsWith(key)) return null
    return sort.endsWith('asc') ? 'asc' : 'desc'
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Incidents</h1>
        <Link to="/incidents/new" className={styles.newButton}>New Incident</Link>
      </div>

      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Search title, service, owner, summary..."
          value={searchInput}
          onChange={(e) => { setSearchInput(e.target.value); setPage(0) }}
          className={styles.search}
          aria-label="Search incidents"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter((e.target.value as Status) || ''); setPage(0) }}
          className={styles.select}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="MITIGATED">MITIGATED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => { setSeverityFilter((e.target.value as Severity) || ''); setPage(0) }}
          className={styles.select}
          aria-label="Filter by severity"
        >
          <option value="">All severities</option>
          <option value="SEV1">SEV1</option>
          <option value="SEV2">SEV2</option>
          <option value="SEV3">SEV3</option>
          <option value="SEV4">SEV4</option>
        </select>
        <input
          type="text"
          placeholder="Service name"
          value={serviceFilter}
          onChange={(e) => { setServiceFilter(e.target.value); setPage(0) }}
          className={styles.serviceInput}
          aria-label="Filter by service"
        />
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(0) }}
          className={styles.select}
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.tableWrap}>
        {loading ? (
          <TableLoading rows={size} cols={7} />
        ) : data ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><button type="button" onClick={() => handleSortHeader('title')} className={styles.thBtn}>Title {sortDir('title') === 'asc' && '↑'}{sortDir('title') === 'desc' && '↓'}</button></th>
                  <th><button type="button" onClick={() => handleSortHeader('service')} className={styles.thBtn}>Service {sortDir('service') === 'asc' && '↑'}{sortDir('service') === 'desc' && '↓'}</button></th>
                  <th><button type="button" onClick={() => handleSortHeader('severity')} className={styles.thBtn}>Severity {sortDir('severity') === 'asc' && '↑'}{sortDir('severity') === 'desc' && '↓'}</button></th>
                  <th><button type="button" onClick={() => handleSortHeader('status')} className={styles.thBtn}>Status {sortDir('status') === 'asc' && '↑'}{sortDir('status') === 'desc' && '↓'}</button></th>
                  <th>Owner</th>
                  <th><button type="button" onClick={() => handleSortHeader('createdAt')} className={styles.thBtn}>Created {sortDir('createdAt') === 'asc' && '↑'}{sortDir('createdAt') === 'desc' && '↓'}</button></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr><td colSpan={7} className={styles.empty}>No incidents found.</td></tr>
                ) : (
                  data.content.map((inc) => (
                    <tr key={inc.id}>
                      <td className={styles.cellTitle}>{inc.title}</td>
                      <td>{inc.service}</td>
                      <td><span className={styles[`sev_${inc.severity}`]}>{inc.severity}</span></td>
                      <td><span className={styles[`status_${inc.status}`]}>{inc.status}</span></td>
                      <td>{inc.owner ?? '—'}</td>
                      <td className={styles.cellDate}>{new Date(inc.createdAt).toLocaleString()}</td>
                      <td><Link to={`/incidents/${inc.id}`} className={styles.viewLink}>View</Link></td>
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
