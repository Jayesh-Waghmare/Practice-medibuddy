function usableValues(values) {
  if (!Array.isArray(values)) return []
  return values.filter((value) => value !== null && value !== undefined && value !== '')
}

export function firstValue(values) {
  return usableValues(values)[0] ?? null
}

export function joinValues(values, separator = ', ') {
  const usable = usableValues(values)
  return usable.length > 0 ? usable.join(separator) : null
}

export function uniqueValues(values) {
  return [...new Set(usableValues(values))]
}

export function shortProductType(productType) {
  if (!productType) return null
  if (productType.includes('OTC')) return 'OTC'
  if (productType.includes('PRESCRIPTION')) return 'Prescription'
  return productType
}

export function productTypeClass(productType) {
  if (productType === 'OTC') return 'bg-emerald-50 text-emerald-800 ring-emerald-200'
  if (productType === 'Prescription') return 'bg-violet-50 text-violet-800 ring-violet-200'
  return 'bg-slate-50 text-slate-600 ring-slate-200'
}

export function formatLabelDate(value) {
  if (typeof value !== 'string' || value.length !== 8) return null

  const date = new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
