import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link to="/" className="mt-3 inline-block text-sm text-blue-700 hover:underline">
        Go to search
      </Link>
    </div>
  )
}
