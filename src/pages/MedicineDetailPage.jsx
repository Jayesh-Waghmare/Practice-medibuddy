import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import Badge from '../components/Badge.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { errorMessageFor, fetchMedicineById } from '../services/fdaApi.js'
import {
  firstValue,
  formatLabelDate,
  joinValues,
  productTypeClass,
  shortProductType,
  uniqueValues,
} from '../utils/medicine.js'

const LABEL_SECTIONS = [
  { key: 'purpose', title: 'Purpose' },
  { key: 'indications_and_usage', title: 'Indications and usage' },
  { key: 'description', title: 'Description' },
  { key: 'active_ingredient', title: 'Active ingredient' },
  { key: 'dosage_forms_and_strengths', title: 'Dosage forms and strengths' },
  { key: 'dosage_and_administration', title: 'Dosage and administration' },
  { key: 'warnings', title: 'Warnings', warning: true },
  { key: 'warnings_and_cautions', title: 'Warnings and cautions', warning: true },
  { key: 'contraindications', title: 'Contraindications', warning: true },
  { key: 'do_not_use', title: 'Do not use', warning: true },
  { key: 'ask_doctor', title: 'Ask a doctor', warning: true },
  { key: 'ask_doctor_or_pharmacist', title: 'Ask a doctor or pharmacist', warning: true },
  { key: 'when_using', title: 'When using this product', warning: true },
  { key: 'stop_use', title: 'Stop use and ask a doctor', warning: true },
  { key: 'pregnancy_or_breast_feeding', title: 'Pregnancy or breast feeding', warning: true },
  { key: 'pregnancy', title: 'Pregnancy', warning: true },
  { key: 'keep_out_of_reach_of_children', title: 'Keep out of reach of children', warning: true },
  { key: 'adverse_reactions', title: 'Adverse reactions' },
  { key: 'drug_interactions', title: 'Drug interactions' },
  { key: 'use_in_specific_populations', title: 'Use in specific populations' },
  { key: 'overdosage', title: 'Overdosage' },
  { key: 'clinical_pharmacology', title: 'Clinical pharmacology' },
  { key: 'mechanism_of_action', title: 'Mechanism of action' },
  { key: 'inactive_ingredient', title: 'Inactive ingredients' },
  { key: 'how_supplied', title: 'How supplied' },
  { key: 'storage_and_handling', title: 'Storage and handling' },
  { key: 'information_for_patients', title: 'Information for patients' },
]

const GENERIC_ERROR = 'Something went wrong while loading this medicine. Please try again.'

export default function MedicineDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const [status, setStatus] = useState('loading')
  const [medicine, setMedicine] = useState(null)
  const [retryToken, setRetryToken] = useState(0)
  const [errorMessage, setErrorMessage] = useState(GENERIC_ERROR)

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
        setErrorMessage(errorMessageFor(error, GENERIC_ERROR))
        setStatus('error')
      })

    return () => controller.abort()
  }, [id, retryToken])

  return (
    <div>
      <Link
        to={{ pathname: '/', search: location.search }}
        className="inline-flex items-center gap-1 rounded text-sm font-medium text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
      >
        <span aria-hidden="true">&larr;</span> Back to search
      </Link>

      <div className="mt-4">
        {status === 'loading' && (
          <div role="status" className="animate-pulse space-y-4">
            <div className="h-8 w-1/2 rounded bg-slate-200" />
            <div className="h-40 rounded-xl bg-white" />
            <span className="sr-only">Loading medicine details</span>
          </div>
        )}

        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={() => setRetryToken(retryToken + 1)} />
        )}

        {status === 'notfound' && (
          <div role="status" className="max-w-md rounded-xl border border-slate-200 bg-white p-8">
            <h1 className="text-xl font-semibold">Medicine not found</h1>
            <p className="mt-2 text-sm text-slate-600">
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
  const productType = shortProductType(firstValue(openfda.product_type))
  const updatedOn = formatLabelDate(medicine.effective_time)

  const badges = [
    firstValue(openfda.route),
    firstValue(openfda.dosage_form),
    firstValue(openfda.dea_schedule),
  ].filter(Boolean)

  const facts = [
    { label: 'Generic name', value: joinValues(uniqueValues(openfda.generic_name)) },
    { label: 'Manufacturer', value: joinValues(uniqueValues(openfda.manufacturer_name)) },
    { label: 'Active substances', value: joinValues(uniqueValues(openfda.substance_name)) },
    { label: 'Pharmacologic class', value: joinValues(uniqueValues(openfda.pharm_class_epc)) },
    { label: 'Mechanism of action', value: joinValues(uniqueValues(openfda.pharm_class_moa)) },
    { label: 'Chemical structure', value: joinValues(uniqueValues(openfda.pharm_class_cs)) },
    { label: 'Application number', value: joinValues(uniqueValues(openfda.application_number)) },
    { label: 'Product NDC', value: joinValues(uniqueValues(openfda.product_ndc)) },
    { label: 'RxCUI', value: joinValues(uniqueValues(openfda.rxcui)) },
    { label: 'UNII', value: joinValues(uniqueValues(openfda.unii)) },
  ]

  const sections = LABEL_SECTIONS.map((section) => ({
    ...section,
    text: joinValues(medicine[section.key], '\n\n'),
  })).filter((section) => section.text)

  return (
    <article>
      <header className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {joinValues(uniqueValues(openfda.brand_name)) ?? 'Brand name not available'}
          </h1>
          {productType && <Badge className={productTypeClass(productType)}>{productType}</Badge>}
        </div>

        {badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        )}

        {updatedOn && (
          <p className="mt-4 text-xs text-slate-500">Label last updated {updatedOn}</p>
        )}
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {sections.length === 0 && (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              This label has no further sections available.
            </p>
          )}

          {sections.map((section, index) => (
            <details
              key={section.key}
              open={index < 2}
              className={`group rounded-xl border bg-white ${
                section.warning ? 'border-amber-200' : 'border-slate-200'
              }`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-4 font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                <span className={section.warning ? 'text-amber-900' : undefined}>
                  {section.title}
                </span>
                <span aria-hidden="true" className="text-slate-400 transition group-open:rotate-180">
                  &#9662;
                </span>
              </summary>
              <p className="whitespace-pre-line px-5 pb-5 text-sm leading-relaxed text-slate-700">
                {section.text}
              </p>
            </details>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Product details</h2>
            <dl className="mt-4 space-y-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm break-words text-slate-900">
                    {fact.value ?? 'Not available'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </article>
  )
}
