import { Routes, Route, Link } from 'react-router-dom'
import SearchPage from './pages/SearchPage.jsx'
import MedicineDetailPage from './pages/MedicineDetailPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <Link
            to="/"
            className="rounded text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Medicine Search
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/medicine/:id" element={<MedicineDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}
