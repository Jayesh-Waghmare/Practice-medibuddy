import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import MedicineList from '../components/MedicineList.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { errorMessageFor, searchMedicines } from '../services/fdaApi.js'

const GENERIC_ERROR = 'Something went wrong while fetching medicines. Please try again.'

const EXAMPLE_QUERIES = ['Advil', 'Tylenol', 'Motrin', 'Zyrtec', 'Lipitor']

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState([])
  const [retryToken, setRetryToken] = useState(0)
  const [errorMessage, setErrorMessage] = useState(GENERIC_ERROR)

  const query = searchParams.get('q') ?? ''
  const [trimmedQuery, setTrimmedQuery] = useDebounce(query.trim(), 400)

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
        setErrorMessage(errorMessageFor(error, GENERIC_ERROR))
        setStatus('error')
      })

    return () => controller.abort()
  }, [trimmedQuery, retryToken])

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Search medicines
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Look up a brand name to see its ingredients, uses, dosage and warnings from official FDA
          drug labels.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-2xl">
        <SearchBar
          query={query}
          onQueryChange={handleQueryChange}
          onSubmit={() => setTrimmedQuery(query.trim())}
        />

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500">Try</span>
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleQueryChange(example)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {status === 'idle' && (
          <p role="status" className="text-center text-slate-500">
            Search for a medicine by brand name.
          </p>
        )}

        {status === 'loading' && (
          <>
            <p role="status" className="sr-only">
              Searching
            </p>
            <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((placeholder) => (
                <li
                  key={placeholder}
                  className="animate-pulse space-y-3 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                  <div className="h-5 w-24 rounded bg-slate-100" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                </li>
              ))}
            </ul>
          </>
        )}

        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={() => setRetryToken(retryToken + 1)} />
        )}

        {status === 'success' && results.length === 0 && (
          <div role="status" className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-medium text-slate-900">No results found</p>
            <p className="mt-1 text-sm text-slate-600">
              Nothing matched “{trimmedQuery}”. Try a different brand name.
            </p>
          </div>
        )}

        {status === 'success' && results.length > 0 && (
          <>
            <p role="status" className="mb-4 text-sm text-slate-600">
              {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
              <span className="font-medium text-slate-900">{trimmedQuery}</span>
            </p>
            <MedicineList results={results} />
          </>
        )}
      </div>
    </div>
  )
}
