export default function Badge({ children, className = 'bg-slate-50 text-slate-600 ring-slate-200' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  )
}
