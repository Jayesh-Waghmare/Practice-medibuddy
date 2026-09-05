export default function SearchBar({ query, onQueryChange }) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="medicine-search" className="block text-sm font-medium text-slate-700">
        Medicine brand name
      </label>

      <div className="relative mt-1">
        <input
          id="medicine-search"
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by brand name, for example Advil"
          autoComplete="off"
          enterKeyHint="search"
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-base outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />

        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 px-3 text-xl leading-none text-slate-500 hover:text-slate-800"
          >
            &times;
          </button>
        )}
      </div>
    </form>
  )
}
