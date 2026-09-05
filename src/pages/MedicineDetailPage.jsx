import { useParams, Link } from 'react-router-dom'

export default function MedicineDetailPage() {
  const { id } = useParams()

  return (
    <div>
      <Link to="/" className="text-sm text-blue-700 hover:underline">
        &larr; Back to search
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">Detail page</h1>
      <p className="mt-2 text-slate-600">Medicine id: {id}</p>
    </div>
  )
}
