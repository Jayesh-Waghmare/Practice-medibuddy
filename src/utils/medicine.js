export function firstValue(values) {
  return Array.isArray(values) && values.length > 0 ? values[0] : null
}

export function joinValues(values, separator = ', ') {
  return Array.isArray(values) && values.length > 0 ? values.join(separator) : null
}
