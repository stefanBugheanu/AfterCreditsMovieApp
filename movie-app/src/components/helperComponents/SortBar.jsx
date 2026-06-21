const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "nrRatings", label: "Most Rated" },
  { value: "alphabetical", label: "A–Z" },
];

export default function SortBar({ value, onChange }) {
  return (
    <div className="mb-6 flex flex-row items-center gap-2">
      <span className="mr-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        Sort by
      </span>
      {SORT_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              active
                ? "border-red-500/60 bg-red-500/10 text-white"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function sortMovies(movies, sortBy) {
  if (!Array.isArray(movies)) return [];
  const copy = [...movies];
  if (sortBy === "rating") {
    copy.sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
  } else if (sortBy === "nrRatings") {
    const count = (m) => m?.nrRatings ?? m?.ratingsCount ?? m?.votes ?? 0;
    copy.sort((a, b) => count(b) - count(a));
  } else if (sortBy === "alphabetical") {
    copy.sort((a, b) =>
      (a?.title ?? "").localeCompare(b?.title ?? "", undefined, {
        sensitivity: "base",
      }),
    );
  }
  return copy;
}
