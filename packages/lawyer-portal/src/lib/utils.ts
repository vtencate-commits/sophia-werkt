export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}u`
  return `${hours}u ${mins}m`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    open: 'sophia-badge-info',
    inprogress: 'sophia-badge-warning',
    pending: 'sophia-badge-warning',
    completed: 'sophia-badge-success',
    closed: 'sophia-badge-success',
    archived: 'sophia-badge-secondary',
    error: 'sophia-badge-error',
  }
  return statusMap[status.toLowerCase()] || 'sophia-badge-info'
}

export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    open: 'Open',
    inprogress: 'In behandeling',
    pending: 'In afwachting',
    completed: 'Voltooid',
    closed: 'Gesloten',
    archived: 'Gearchiveerd',
  }
  return statusMap[status] || status
}
