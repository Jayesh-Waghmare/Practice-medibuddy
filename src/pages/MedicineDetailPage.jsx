import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { fetchMedicineById } from '../services/fdaApi.js'
import { joinValues } from '../utils/medicine.js'

export default function MedicineDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const [status, setStatus] = useState('loading')
  const [medicine, setMedicine] = useState(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    fetchMedicineById(id, controller.signal)
      .then((result) => {
        setMedicine(result)
        setStatus(result ? 'success' : 'notfound')
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
        setStatus('error')
      })

    return () => controller.abort()
  }, [id, retryToken])

  return (
    <div>
      <Link
        to={{ pathname: '/', search: location.search }}
        className="text-sm text-blue-700 hover:underline"
      >
        &larr; Back to search
      </Link>

      <div className="mt-4">
        {status === 'loading' && (
          <p role="status" className="text-slate-600">
            Loading medicine details…
          </p>
        )}

        {status === 'error' && (
          <div role="status">
            <p className="text-red-700">
              Something went wrong while loading this medicine. Please try again.
            </p>
            <button
              type="button"
              onClick={() => setRetryToken(retryToken + 1)}
              className="mt-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'notfound' && (
          <div role="status">
            <h1 className="text-xl font-semibold">Medicine not found</h1>
            <p className="mt-2 text-slate-600">
              We could not find a medicine for this link. It may be incorrect or no longer
              available.
            </p>
          </div>
        )}

        {status === 'success' && <MedicineDetail medicine={medicine} />}
      </div>
    </div>
  )
}

function MedicineDetail({ medicine }) {
  const openfda = medicine.openfda ?? {}

  const details = [
    { label: 'Generic name', value: joinValues(openfda.generic_name) },
    { label: 'Manufacturer', value: joinValues(openfda.manufacturer_name) },
    { label: 'Product type', value: joinValues(openfda.product_type) },
    { label: 'Route', value: joinValues(openfda.route) },
    { label: 'Dosage form', value: joinValues(openfda.dosage_form) },
    { label: 'Active substances', value: joinValues(openfda.substance_name) },
    { label: 'Pharmacologic class', value: joinValues(openfda.pharm_class_epc) },
    { label: 'Application number', value: joinValues(openfda.application_number) },
    { label: 'RxCUI', value: joinValues(openfda.rxcui) },
  ]

  const sections = [
    { title: 'Purpose', text: joinValues(medicine.purpose, '\n\n') },
    { title: 'Indications and usage', text: joinValues(medicine.indications_and_usage, '\n\n') },
    { title: 'Dosage and administration', text: joinValues(medicine.dosage_and_administration, '\n\n') },
    { title: 'Active ingredient', text: joinValues(medicine.active_ingredient, '\n\n') },
    { title: 'Inactive ingredient', text: joinValues(medicine.inactive_ingredient, '\n\n') },
    { title: 'Warnings', text: joinValues(medicine.warnings, '\n\n') },
  ].filter((section) => section.text)

  return (
    <article>
      <h1 className="text-2xl font-semibold">
        {joinValues(openfda.brand_name) ?? 'Brand name not available'}
      </h1>

      <dl className="mt-4 grid gap-x-6 gap-y-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="text-xs uppercase tracking-wide text-slate-500">{detail.label}</dt>
            <dd className="mt-0.5 text-sm text-slate-900">{detail.value ?? 'Not available'}</dd>
          </div>
        ))}
      </dl>

      {sections.map((section) => (
        <section key={section.title} className="mt-6">
          <h2 className="font-semibold text-slate-900">{section.title}</h2>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {section.text}
          </p>
        </section>
      ))}
    </article>
  )
}
