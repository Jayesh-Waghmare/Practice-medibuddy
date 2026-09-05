import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import MedicineList from '../components/MedicineList.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { searchMedicines } from '../services/fdaApi.js'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState([])
  const [retryToken, setRetryToken]=useState(0)

  const query=searchParams.get('q') ?? ''
  const trimmedQuery = useDebounce(query.trim(), 400)

  function handleQueryChange(value) {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  useEffect(() => {
    if (!trimmedQuery) {
      setStatus('idle')
      setResults([])
      return
    }

    const controller = new AbortController()
    setStatus('loading')

    searchMedicines(trimmedQuery, controller.signal)
      .then((medicines) => {
        setResults(medicines)
        setStatus('success')
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
        setStatus('error')
      })

    return () => controller.abort()
  }, [trimmedQuery, retryToken])

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Search medicines</h1>

      <SearchBar query={query} onQueryChange={handleQueryChange} />

      <div className="mt-6">
        {status === 'idle' && (
          <p role="status" className="text-slate-600">
            Search for a medicine by brand name. Try Advil, Tylenol or Motrin.
          </p>
        )}

        {status === 'loading' && (
          <p role="status" className="text-slate-600">
            Searching…
          </p>
        )}

        {status === 'error' && (
          <div role="status">
            <p className="text-red-700">
              Something went wrong while fetching medicines. Please try again.
            </p>
            <button
              type="button"
              onClick={() => setRetryToken(retryToken + 1)}
              className="mt-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'success' && results.length === 0 && (
          <p role="status" className="text-slate-600">
            No results found for “{trimmedQuery}”.
          </p>
        )}

        {status === 'success' && results.length > 0 && (
          <>
            <p role="status" className="mb-3 text-sm text-slate-600">
              {results.length} {results.length === 1 ? 'result' : 'results'} for “{trimmedQuery}”
            </p>
            <MedicineList results={results} />
          </>
        )}
      </div>
    </div>
  )
}
