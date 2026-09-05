export default function ErrorState({ message, onRetry }) {
  return (
    <div role="status" className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </div>
  )
}
