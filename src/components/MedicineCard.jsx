import Badge from './Badge.jsx'
import { firstValue, productTypeClass, shortProductType, uniqueValues } from '../utils/medicine.js'

export default function MedicineCard({ openfda }) {
  const brandName = firstValue(openfda.brand_name)
  const genericName = firstValue(openfda.generic_name)
  const manufacturer = firstValue(openfda.manufacturer_name)
  const productType = shortProductType(firstValue(openfda.product_type))
  const substances = uniqueValues(openfda.substance_name).slice(0, 3)
  const meta = [firstValue(openfda.route), firstValue(openfda.dosage_form)].filter(Boolean)

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition group-hover:border-teal-500 group-hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold leading-snug text-slate-900">
          {brandName ?? 'Brand name not available'}
        </h2>
        {productType && <Badge className={productTypeClass(productType)}>{productType}</Badge>}
      </div>

      {genericName && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{genericName}</p>}

      {substances.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {substances.map((substance) => (
            <Badge key={substance}>{substance}</Badge>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4">
        {meta.length > 0 && (
          <p className="text-xs uppercase tracking-wide text-slate-500">{meta.join(' · ')}</p>
        )}
        {manufacturer && <p className="mt-1 truncate text-sm text-slate-500">{manufacturer}</p>}
      </div>
    </article>
  )
}
