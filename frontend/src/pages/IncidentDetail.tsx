import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { incidentsApi } from '../api/incidents'
import type { Incident, IncidentUpdate, Severity, Status } from '../types/incident'
import styles from '../styles/IncidentDetail.module.css'

export function IncidentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<IncidentUpdate | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    incidentsApi
      .getById(id)
      .then((data) => {
        setIncident(data)
        setForm({
          title: data.title,
          service: data.service,
          severity: data.severity,
          status: data.status,
          owner: data.owner ?? '',
          summary: data.summary ?? '',
        })
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = () => {
    if (!id || !form) return
    setSaving(true)
    incidentsApi
      .update(id, { ...form, owner: form.owner || null, summary: form.summary || null })
      .then((updated) => {
        setIncident(updated)
        setForm({ ...updated, owner: updated.owner ?? '', summary: updated.summary ?? '' })
        setEditMode(false)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Update failed'))
      .finally(() => setSaving(false))
  }

  if (loading || !id) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  if (error && !incident) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error}</div>
        <Link to="/" className={styles.backLink}>← Back to list</Link>
      </div>
    )
  }

  if (!incident || !form) return null

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>← Back to list</Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{editMode ? 'Edit Incident' : incident.title}</h1>
          {!editMode ? (
            <button type="button" onClick={() => setEditMode(true)} className={styles.editBtn}>Edit</button>
          ) : (
            <div className={styles.actions}>
              <button type="button" onClick={() => { setEditMode(false); setForm({ ...incident, owner: incident.owner ?? '', summary: incident.summary ?? '' }) }} className={styles.cancelBtn}>Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving} className={styles.saveBtn}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          )}
        </div>

        {error && editMode && <div className={styles.errorInline}>{error}</div>}

        {editMode ? (
          <div className={styles.form}>
            <label className={styles.label}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => f ? { ...f, title: e.target.value } : f)}
              className={styles.input}
            />
            <label className={styles.label}>Service</label>
            <input
              value={form.service}
              onChange={(e) => setForm((f) => f ? { ...f, service: e.target.value } : f)}
              className={styles.input}
            />
            <label className={styles.label}>Severity</label>
            <select
              value={form.severity}
              onChange={(e) => setForm((f) => f ? { ...f, severity: e.target.value as Severity } : f)}
              className={styles.select}
            >
              {(['SEV1', 'SEV2', 'SEV3', 'SEV4'] as const).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label className={styles.label}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => f ? { ...f, status: e.target.value as Status } : f)}
              className={styles.select}
            >
              <option value="OPEN">OPEN</option>
              <option value="MITIGATED">MITIGATED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
            <label className={styles.label}>Owner (optional)</label>
            <input
              value={form.owner ?? ''}
              onChange={(e) => setForm((f) => f ? { ...f, owner: e.target.value } : f)}
              className={styles.input}
              placeholder="e.g. email@example.com"
            />
            <label className={styles.label}>Summary (optional)</label>
            <textarea
              value={form.summary ?? ''}
              onChange={(e) => setForm((f) => f ? { ...f, summary: e.target.value } : f)}
              className={styles.textarea}
              rows={4}
              placeholder="Brief summary or notes"
            />
          </div>
        ) : (
          <dl className={styles.dl}>
            <dt>Title</dt>
            <dd>{incident.title}</dd>
            <dt>Service</dt>
            <dd>{incident.service}</dd>
            <dt>Severity</dt>
            <dd><span className={styles[`sev_${incident.severity}`]}>{incident.severity}</span></dd>
            <dt>Status</dt>
            <dd><span className={styles[`status_${incident.status}`]}>{incident.status}</span></dd>
            <dt>Owner</dt>
            <dd>{incident.owner ?? '—'}</dd>
            <dt>Summary</dt>
            <dd>{incident.summary ?? '—'}</dd>
            <dt>Created</dt>
            <dd>{new Date(incident.createdAt).toLocaleString()}</dd>
            <dt>Updated</dt>
            <dd>{new Date(incident.updatedAt).toLocaleString()}</dd>
          </dl>
        )}
      </div>
    </div>
  )
}
