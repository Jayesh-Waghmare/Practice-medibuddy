# Medicine Search

## Overview

Search medicines by brand name using the openFDA Drug Label API. Results show as cards,
and clicking a card opens a detail page with more information about that medicine.

## Features

- Search by brand name, with example searches to click
- Result cards built from the `openfda` fields
- Detail page on its own URL, works on refresh and direct links
- Detail page shows the full label as collapsible sections, covering both OTC and
  prescription labels, plus a product details panel
- Loading skeletons, no results and error states
- Enter searches straight away instead of waiting for the debounce
- Try again button when a request fails, with a separate message for rate limiting
- Debounced input
- Caching of previous searches
- Request cancellation with AbortController
- Responsive layout

## Tech Stack

- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- fetch
- openFDA Drug Label API

## Getting Started

```
npm install
npm run dev
```

Runs at http://localhost:5173

## Production Build

```
npm run build
npm run preview
```

## Implementation Decisions

**Quoted search terms.** The API uses Lucene syntax where a space acts as OR.
`openfda.brand_name:advil pm` returns over 10,000 results, `openfda.brand_name:"advil pm"`
returns 6. So every term is quoted, and quotes the user types are stripped first.

**404 means no results.** The API returns 404 when a brand name matches nothing, so the
service returns an empty array for that and only throws on real failures. Otherwise a typo
would look like a broken app. Other bad statuses throw an error carrying the status code, so
a 429 can show a rate limit message while everything else falls back to the generic one.

**Cards only get `openfda`.** `MedicineCard` receives `result.openfda` and nothing else, so
it cannot read a top level field by accident. The detail page does use top level fields
because that is where the label text is.

**Missing fields.** Cards show a fallback for the brand name and hide other missing fields.
The detail page shows "Not available" instead, because a spec list with rows missing is
confusing.

**One status string** per page instead of separate loading and error booleans, so the two
cannot both be true.

**Label sections are a list, filtered by what exists.** OTC and prescription labels use
completely different fields, so `LABEL_SECTIONS` lists the known ones in reading order and the
page keeps only those present on the record. Each section is a native `<details>` element, so
long prescription text stays collapsed without any open/closed state in React.

**Query lives in the URL.** `SearchPage` reads it with `useSearchParams`. This keeps the
search shareable and brings it back when you return from a detail page, without storing it
twice.

**Detail page refetches by id.** The route is `/medicine/:id` using the label's own `id`,
and the page fetches `search=id:"<id>"&limit=1`. Passing the record through router state
would be faster but empty after a refresh, so it would need a fetch fallback anyway.

## Performance Decisions

**Debounce (400ms).** Typing "advil" used to send 5 requests. Now it sends 1. The value is
trimmed before being debounced, and the hook starts with the current value so opening
`/?q=advil` searches straight away. `useDebounce` also returns its setter, so submitting the
form with Enter can skip the remaining delay instead of the key doing nothing.

**Cache.** A `Map` in `fdaApi.js` keyed on `query.trim().toLowerCase()`, so repeats and
different casing reuse the same entry. `Map` because `.has()` tells the difference between a
cached empty array and a query never run. Empty results are cached, errors are not.

**Cancellation.** Each fetch effect makes an `AbortController` and aborts it on cleanup.
Without it, searching "tylenol" then "aspirin" could let the slower tylenol response land
last and overwrite the aspirin results. `AbortError` is checked first in the catch so a
cancelled request never shows as an error.

**No memoization.** The API returns at most 20 results and the cards are plain text, so
there is nothing slow to memoize. Nothing is wrapped in `React.memo`, so a `useCallback`
would be a stable reference that nothing compares. It would be cost with no benefit.

## Trade-offs

- The cache has no expiry or size limit and is lost on reload, since it lives in module
  scope. Fine for data that does not change during a session.
- The detail page refetches every visit instead of reusing a cached record. One code path
  that is correct on refresh was worth more than the saved request.
- `npm run lint` shows two `set-state-in-effect` warnings for `setStatus('loading')` before
  each fetch. That is the normal pattern for fetching in an effect and the rule suggests
  using a data fetching library, which I did not add. Left visible rather than silenced.

## Deployment

Deployed on Vercel as a static Vite build. `vercel.json` rewrites all paths to `index.html`
so that `/medicine/:id` still works on refresh and on direct links. `public/_redirects` does
the same thing for Netlify.

## Future Improvements

- Cache detail responses too
- Pagination, since the API reports a total larger than the 20 results requested
- Filter or sort results by product type or route
- Tests for the API service and the missing field handling

## Data Source

openFDA Drug Label API. openFDA states the data is not validated and should not be used to
make decisions about medical care.
