export default function GenreCard({ name, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group relative h-40 cursor-pointer overflow-hidden rounded-2xl
        border border-zinc-800/70 bg-zinc-900/40
        transition-all duration-300
        hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-zinc-900/70
        hover:shadow-lg hover:shadow-red-500/10
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300
          bg-gradient-to-br from-red-500/15 via-transparent to-transparent
          group-hover:opacity-100
        "
      />

      <div className="absolute inset-x-5 bottom-5">
        <h3 className="truncate font-serif text-2xl text-white">{name}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          {count} {count === 1 ? "film" : "films"}
        </p>
      </div>
    </div>
  );
}
