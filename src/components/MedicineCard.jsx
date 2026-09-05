import { firstValue } from '../utils/medicine.js'

export default function MedicineCard({ openfda }) {
  const brandName = firstValue(openfda.brand_name)
  const genericName = firstValue(openfda.generic_name)
  const manufacturer = firstValue(openfda.manufacturer_name)
  const productType = firstValue(openfda.product_type)
  const route = firstValue(openfda.route)

  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400">
      <h2 className="font-semibold text-slate-900">
        {brandName ?? 'Brand name not available'}
      </h2>

      {genericName && (
        <p className="mt-1 text-sm text-slate-600">{genericName}</p>
      )}

      {manufacturer && (
        <p className="mt-2 text-sm text-slate-500">{manufacturer}</p>
      )}

      {(productType || route) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {productType && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              {productType}
            </span>
          )}
          {route && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              {route}
            </span>
          )}
        </div>
      )}
    </article>
  )
}
