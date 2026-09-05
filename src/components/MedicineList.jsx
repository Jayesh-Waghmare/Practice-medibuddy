import MedicineCard from './MedicineCard.jsx'

export default function MedicineList({ results }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {results.map((result) => (
        <li key={result.id}>
          <MedicineCard openfda={result.openfda ?? {}} />
        </li>
      ))}
    </ul>
  )
}
