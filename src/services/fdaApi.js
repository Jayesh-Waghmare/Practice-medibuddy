const BASE_URL = 'https://api.fda.gov/drug/label.json'

function buildUrl(search, limit) {
  return `${BASE_URL}?search=${encodeURIComponent(search)}&limit=${limit}`
}
function escapeTerm(term) {
  return term.replace(/["\\]/g, '')
}

export async function searchMedicines(query, signal) {
  const url = buildUrl(`openfda.brand_name:"${escapeTerm(query)}"`, 20)
  const response = await fetch(url, { signal })

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    throw new Error(`FDA API responded with status ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data.results) ? data.results : []
}

export async function fetchMedicineById(id, signal) {
  const url = buildUrl(`id:"${escapeTerm(id)}"`, 1)
  const response = await fetch(url, { signal })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`FDA API responded with status ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data.results) ? (data.results[0] ?? null) : null
}
