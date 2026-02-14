import type {
  Incident,
  IncidentCreate,
  IncidentUpdate,
  ListParams,
  PageResponse,
} from '../types/incident'
import { api } from './client'

function buildQuery(params: ListParams): string {
  const q = new URLSearchParams()
  if (params.page != null) q.set('page', String(params.page))
  if (params.size != null) q.set('size', String(params.size))
  if (params.sort != null) q.set('sort', params.sort)
  if (params.search != null && params.search.trim()) q.set('search', params.search.trim())
  if (params.status != null) q.set('status', params.status)
  if (params.severity != null) q.set('severity', params.severity)
  if (params.service != null && params.service.trim()) q.set('service', params.service.trim())
  const s = q.toString()
  return s ? `?${s}` : ''
}

export const incidentsApi = {
  list: (params: ListParams = {}) =>
    api.get<PageResponse<Incident>>(`/incidents${buildQuery(params)}`),

  getServices: () =>
    api.get<string[]>('/incidents/services'),

  getById: (id: string) =>
    api.get<Incident>(`/incidents/${id}`),

  create: (body: IncidentCreate) =>
    api.post<Incident>('/incidents', body),

  update: (id: string, body: IncidentUpdate) =>
    api.patch<Incident>(`/incidents/${id}`, body),
}
