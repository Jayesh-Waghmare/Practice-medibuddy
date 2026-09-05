import { Link, useLocation } from 'react-router-dom'
import MedicineCard from './MedicineCard.jsx'

export default function MedicineList({ results }) {
  const location = useLocation()

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {results.map((result) => (
        <li key={result.id}>
          <Link
            to={{ pathname: `/medicine/${result.id}`, search: location.search }}
            className="block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <MedicineCard openfda={result.openfda ?? {}} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
