import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { incidentsApi } from '../api/incidents'
import type { IncidentCreate as IncidentCreateType, Severity } from '../types/incident'
import styles from '../styles/IncidentCreate.module.css'

const initial: IncidentCreateType = {
  title: '',
  service: '',
  severity: 'SEV3',
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
        <h1 className={styles.title}>New Incident</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={styles.input}
            placeholder="Short description of the incident"
          />

          <label className={styles.label}>Service *</label>
          <input
            required
            value={form.service}
            onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
            className={styles.input}
            placeholder="e.g. Payment-Gateway"
          />

          <label className={styles.label}>Severity *</label>
          <select
            value={form.severity}
            onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Severity }))}
            className={styles.select}
          >
            <option value="SEV1">SEV1</option>
            <option value="SEV2">SEV2</option>
            <option value="SEV3">SEV3</option>
            <option value="SEV4">SEV4</option>
          </select>

          <label className={styles.label}>Owner (optional)</label>
          <input
            value={form.owner ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
            className={styles.input}
            placeholder="e.g. email@example.com"
          />

          <label className={styles.label}>Summary (optional)</label>
          <textarea
            value={form.summary ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            className={styles.textarea}
            rows={4}
            placeholder="Brief summary or notes"
          />

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
