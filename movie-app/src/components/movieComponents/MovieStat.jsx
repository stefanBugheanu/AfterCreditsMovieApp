export default function MovieStat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className={"font-serif text-4xl font-light text-white"}>
        {value}
      </span>
      <span className="mt-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}
