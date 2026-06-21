export default function ReviewCard({ review }) {
  const username = review.username ?? review.user?.username ?? "Anonymous";
  const text = review.body ?? review.content ?? "";

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="flex-1 text-sm leading-relaxed text-zinc-300 line-clamp-6">
        {text}
      </p>

      <div className="mt-4 border-t border-zinc-800 pt-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
        {username}
      </div>
    </div>
  );
}
