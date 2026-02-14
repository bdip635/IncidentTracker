import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { incidentsApi } from '../api/incidents'
import type { Incident, IncidentUpdate, Severity, Status } from '../types/incident'
import styles from '../styles/IncidentDetail.module.css'

export function IncidentDetail() {
  const { id } = useParams<{ id: string }>()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<IncidentUpdate | null>(null)
  const [services, setServices] = useState<string[]>([])

  useEffect(() => {
    incidentsApi.getServices().then(setServices).catch(() => setServices([]))
  }, [])

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
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Update failed'))
      .finally(() => setSaving(false))
  }

  const handleCancel = () => {
    if (incident && form) {
      setForm({ ...incident, owner: incident.owner ?? '', summary: incident.summary ?? '' })
    }
    setError(null)
  }

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
        <input
          value={form.title}
          onChange={(e) => setForm((f) => f ? { ...f, title: e.target.value } : f)}
          className={styles.incidentTitleInput}
          placeholder="Incident title"
        />

        {error && <div className={styles.errorInline}>{error}</div>}

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Service</label>
            <select
              value={form.service ?? ''}
              onChange={(e) => setForm((f) => f ? { ...f, service: e.target.value } : f)}
              className={styles.select}
            >
              <option value="">Select Service</option>
              {[
                ...(form.service && !services.includes(form.service) ? [form.service] : []),
                ...services,
              ].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
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
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => f ? { ...f, status: e.target.value as Status } : f)}
              className={styles.select}
            >
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Assigned To</label>
            <input
              value={form.owner ?? ''}
              onChange={(e) => setForm((f) => f ? { ...f, owner: e.target.value } : f)}
              className={styles.input}
              placeholder="Optional"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Summary</label>
            <textarea
              value={form.summary ?? ''}
              onChange={(e) => setForm((f) => f ? { ...f, summary: e.target.value } : f)}
              className={styles.textarea}
              rows={4}
              placeholder="Describe the incident..."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Occurred At</label>
            <div className={styles.plainValue}>{formatDateTime(incident.createdAt)}</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Updated At</label>
            <div className={styles.plainValue}>{formatDateTime(incident.updatedAt)}</div>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={handleSave} disabled={saving} className={styles.saveBtn}>{saving ? 'Saving…' : 'Save Changes'}</button>
            <button type="button" onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
