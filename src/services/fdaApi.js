const BASE_URL = 'https://api.fda.gov/drug/label.json'

export async function searchMedicines(query, signal) {
  const term = query.replace(/["\\]/g, '')
  const search = `openfda.brand_name:"${term}"`
  const url = `${BASE_URL}?search=${encodeURIComponent(search)}&limit=20`

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
