export type Severity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4'
export type Status = 'OPEN' | 'MITIGATED' | 'RESOLVED'

export interface Incident {
  id: string
  title: string
  service: string
  severity: Severity
  status: Status
  owner?: string | null
  summary?: string | null
  createdAt: string
  updatedAt: string
}

export interface IncidentCreate {
  title: string
  service: string
  severity: Severity
  status?: Status
  owner?: string | null
  summary?: string | null
}

export interface IncidentUpdate {
  title: string
  service: string
  severity: Severity
  status: Status
  owner?: string | null
  summary?: string | null
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface ListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
  status?: Status
  severity?: Severity
  service?: string
}
