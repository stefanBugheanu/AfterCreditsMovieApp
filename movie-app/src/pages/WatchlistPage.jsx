import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import useFetch from "../hooks/useFetch";
import { getWatchlist, removeFromWatchlist } from "../api/movieApis";
import CenterMessage from "../components/helperComponents/CenterMessage";
import SortBar, { sortMovies } from "../components/helperComponents/SortBar";

function formatGenres(movie) {
  if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    return movie.genres.join(" / ");
  }
  return movie.genre ?? "";
}

function WatchlistRow({ index, movie, onRemove, removing }) {
  const genres = formatGenres(movie);
  const duration = movie.duration ? `${movie.duration} min` : null;
  const nrRatings = movie.nrRatings ?? movie.ratingsCount ?? movie.votes;
  const actors = Array.isArray(movie.actors) ? movie.actors : [];

  function handleRemoveClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onRemove(movie.id);
  }

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="flex flex-row gap-5 border-b border-zinc-800/80 py-5 transition hover:bg-zinc-900/40"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="h-36 w-24 shrink-0 rounded-md object-cover"
      />

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-row items-baseline gap-3">
          <span className="font-serif text-xl text-zinc-500">{index}.</span>
          <h2 className="font-serif text-xl text-white">{movie.title}</h2>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          {movie.releaseYear && <span>{movie.releaseYear}</span>}
          {duration && (
            <>
              <span className="text-zinc-700">•</span>
              <span>{duration}</span>
            </>
          )}
          {genres && (
            <>
              <span className="text-zinc-700">•</span>
              <span>{genres}</span>
            </>
          )}
        </div>

        <div className="flex flex-row items-center gap-2 text-sm">
          <FaStar className="text-yellow-400" />
          <span className="font-semibold text-white">
            {movie.rating ?? "—"}
          </span>
          {nrRatings != null && (
            <span className="text-zinc-500">
              ({Number(nrRatings).toLocaleString()})
            </span>
          )}
        </div>

        {movie.director && (
          <div className="text-sm">
            <span className="font-semibold text-zinc-300">Director </span>
            <span className="text-zinc-400">{movie.director}</span>
          </div>
        )}

        {actors.length > 0 && (
          <div className="text-sm">
            <span className="font-semibold text-zinc-300">Stars </span>
            <span className="text-zinc-400">{actors.join(", ")}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleRemoveClick}
        disabled={removing}
        aria-label={`Remove ${movie.title} from watchlist`}
        className="shrink-0 self-start rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-zinc-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-400 hover: cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 mr-2"
      >
        Remove
      </button>
    </Link>
  );
}

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { data: items, loading, error } = useFetch(getWatchlist, []);
  const [sortBy, setSortBy] = useState("rating");
  const [removedIds, setRemovedIds] = useState(() => new Set());
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleRemove = useCallback(async (movieId) => {
    setPendingId(movieId);
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.add(movieId);
      return next;
    });
    try {
      await removeFromWatchlist(movieId);
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
      setRemovedIds((prev) => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
    } finally {
      setPendingId(null);
    }
  }, []);

  const normalized = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items
      .map((item) => {
        const source = item.movie ?? item;
        const id = item.movieId ?? source.id ?? item.id;
        if (!id) return null;
        return {
          id,
          watchlistId: item.watchlistId,
          title: source.title,
          posterUrl: source.posterUrl,
          releaseYear: source.releaseYear,
          duration: source.duration,
          genre: source.genre,
          genres: source.genres,
          rating: source.rating,
          nrRatings: source.nrRatings,
          ratingsCount: source.ratingsCount,
          votes: source.votes,
          director: source.director,
          actors: source.actors,
        };
      })
      .filter(Boolean);
  }, [items]);

  const visibleWatchlist = useMemo(
    () => normalized.filter((m) => !removedIds.has(m.id)),
    [normalized, removedIds],
  );

  const sortedWatchlist = useMemo(
    () => sortMovies(visibleWatchlist, sortBy),
    [visibleWatchlist, sortBy],
  );

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <CenterMessage variant="error">Failed to load watchlist.</CenterMessage>
    );
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-4xl px-6">
      <h1 className="mb-8 font-serif text-4xl text-white">
        My Watchlist{" "}
        <span className="text-zinc-500">{sortedWatchlist.length}</span>
      </h1>

      {sortedWatchlist.length === 0 ? (
        <CenterMessage variant="muted">
          Your watchlist is empty. Add movies from a film&rsquo;s page.
        </CenterMessage>
      ) : (
        <>
          <SortBar value={sortBy} onChange={setSortBy} />
          <div className="flex flex-col">
            {sortedWatchlist.map((movie, idx) => (
              <WatchlistRow
                key={movie.watchlistId ?? movie.id}
                index={idx + 1}
                movie={movie}
                onRemove={handleRemove}
                removing={pendingId === movie.id}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
