import { Link, useLocation } from 'react-router-dom'
import MedicineCard from './MedicineCard.jsx'

export default function MedicineList({ results }) {
  const location = useLocation()

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <li key={result.id}>
          <Link
            to={{ pathname: `/medicine/${result.id}`, search: location.search }}
            className="group block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <MedicineCard openfda={result.openfda ?? {}} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
