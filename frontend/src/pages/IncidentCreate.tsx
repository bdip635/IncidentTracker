import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { incidentsApi } from '../api/incidents'
import type { IncidentCreate as IncidentCreateType, Severity, Status } from '../types/incident'
import { SERVICE_OPTIONS } from '../constants/services'
import styles from '../styles/IncidentCreate.module.css'

const SEVERITIES: Severity[] = ['SEV1', 'SEV2', 'SEV3', 'SEV4']

const initial: IncidentCreateType = {
  title: '',
  service: '',
  severity: 'SEV1',
  status: 'OPEN',
  owner: '',
  summary: '',
}

export function IncidentCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState<IncidentCreateType>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    incidentsApi
      .create({
        ...form,
        title: form.title.trim(),
        service: form.service.trim(),
        status: form.status || undefined,
        owner: form.owner?.trim() || null,
        summary: form.summary?.trim() || null,
      })
      .then((created) => navigate(`/incidents/${created.id}`))
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Create failed')
        setSaving(false)
      })
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>← Back to list</Link>

      <div className={styles.card}>
        <h1 className={styles.title}>Create New Incident</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={styles.input}
              placeholder="Issue Title..."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Service</label>
            <select
              required
              value={form.service}
              onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              className={styles.select}
            >
              <option value="">Select Service</option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Severity</label>
            <div className={styles.radioGroup}>
              {SEVERITIES.map((sev) => (
                <label key={sev} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="severity"
                    value={sev}
                    checked={form.severity === sev}
                    onChange={() => setForm((f) => ({ ...f, severity: sev }))}
                    className={styles.radio}
                  />
                  {sev}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              value={form.status ?? 'OPEN'}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
              className={styles.select}
            >
              <option value="">Select Status</option>
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Assigned To</label>
            <input
              value={form.owner ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
              className={styles.input}
              placeholder="Optional"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Summary</label>
            <textarea
              value={form.summary ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              className={styles.textarea}
              rows={4}
              placeholder="Describe the incident..."
            />
          </div>
          <div className={styles.actions}>
            <Link to="/" className={styles.cancelLink}>Cancel</Link>
            <button type="submit" disabled={saving} className={styles.submitBtn}>
              {saving ? 'Creating…' : 'Create Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
