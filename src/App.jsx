import { Routes, Route, Link } from 'react-router-dom'
import SearchPage from './pages/SearchPage.jsx'
import MedicineDetailPage from './pages/MedicineDetailPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M9 3h2v6h6v2h-6v6H9v-6H3V9h6z" />
              </svg>
            </span>
            Medicine Search
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/medicine/:id" element={<MedicineDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
          Data from the openFDA Drug Label API. Not medical advice.
        </div>
      </footer>
    </div>
  )
}
