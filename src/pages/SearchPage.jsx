import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import MedicineList from '../components/MedicineList.jsx'
import { searchMedicines } from '../services/fdaApi.js'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState([])

  const trimmedQuery = query.trim()

  useEffect(() => {
    if (!trimmedQuery) {
      setStatus('idle')
      setResults([])
      return
    }

    setStatus('loading')

    searchMedicines(trimmedQuery)
      .then((medicines) => {
        setResults(medicines)
        setStatus('success')
      })
      .catch((error) => {
        console.error(error)
        setStatus('error')
      })
  }, [trimmedQuery])

  return (
    <div>
      <SearchBar query={query} onQueryChange={setQuery} />

      <div className="mt-6">
        {status === 'idle' && (
          <p className="text-slate-600">Search for a medicine by brand name.</p>
        )}

        {status === 'loading' && <p className="text-slate-600">Searching…</p>}

        {status === 'error' && (
          <p className="text-red-700">
            Something went wrong while fetching medicines. Please try again.
          </p>
        )}

        {status === 'success' && results.length === 0 && (
          <p className="text-slate-600">No results found for “{trimmedQuery}”.</p>
        )}

        {status === 'success' && results.length > 0 && (
          <>
            <p className="mb-3 text-sm text-slate-600">
              {results.length} {results.length === 1 ? 'result' : 'results'} for “{trimmedQuery}”
            </p>
            <MedicineList results={results} />
          </>
        )}
      </div>
    </div>
  )
}
