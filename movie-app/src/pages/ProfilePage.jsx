import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import useFetch from "../hooks/useFetch";
import { getUserStats } from "../api/movieApis";
import MovieStat from "../components/movieComponents/MovieStat";
import CenterMessage from "../components/helperComponents/CenterMessage";

function formatGenres(movie) {
  if (Array.isArray(movie?.genres) && movie.genres.length > 0) {
    return movie.genres.join(" / ");
  }
  return movie?.genre ?? "";
}

function StarStrip({ value }) {
  return (
    <div className="flex flex-row gap-0.5">
      {Array.from({ length: 10 }, (_, i) => {
        const filled = i < value;
        const Icon = filled ? FaStar : FaRegStar;
        return (
          <Icon
            key={i}
            className={`text-sm ${
              filled ? "text-yellow-400" : "text-zinc-700"
            }`}
          />
        );
      })}
    </div>
  );
}

function MovieRowLeft({ movie }) {
  const genres = formatGenres(movie);
  return (
    <>
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="h-16 w-16 shrink-0 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-white">{movie.title}</span>
        <span className="text-xs uppercase tracking-wide text-zinc-500">
          {movie.releaseYear}
          {genres && ` · ${genres}`}
        </span>
      </div>
    </>
  );
}

function RatingRow({ rating }) {
  const movie = rating.movie;
  if (!movie) return null;
  const value = rating.value ?? rating.rating ?? 0;
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="flex flex-row items-center gap-4 rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-3 transition hover:border-zinc-700 hover:bg-zinc-900/60"
    >
      <MovieRowLeft movie={movie} />
      <div className="flex flex-row items-center gap-4">
        <StarStrip value={value} />
        <span className="w-12 text-right text-sm font-semibold text-yellow-400">
          {value}/10
        </span>
      </div>
    </Link>
  );
}

function ReviewRow({ review }) {
  const movie = review.movie;
  if (!movie) return null;
  const content = review.content ?? review.body ?? "";
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="flex flex-col gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/60"
    >
      <div className="flex flex-row items-center gap-4">
        <MovieRowLeft movie={movie} />
      </div>
      {content && (
        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-300">
          {content}
        </p>
      )}
    </Link>
  );
}

function WatchlistRow({ item }) {
  const movie = item.movie ?? {
    id: item.movieId ?? item.id,
    title: item.title,
    posterUrl: item.posterUrl,
    releaseYear: item.releaseYear,
    genre: item.genre,
    genres: item.genres,
  };
  if (!movie.id) return null;
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="flex flex-row items-center gap-4 rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-3 transition hover:border-zinc-700 hover:bg-zinc-900/60"
    >
      <MovieRowLeft movie={movie} />
    </Link>
  );
}

function TabButton({ active, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-3 text-sm transition ${
        active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {label}
      {count != null && (
        <span className="ml-2 text-xs text-zinc-500">{count}</span>
      )}
      {active && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" />
      )}
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: stats, loading, error } = useFetch(getUserStats, []);
  const [activeTab, setActiveTab] = useState("ratings");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <CenterMessage variant="error">
        Failed to load profile. Please try again.
      </CenterMessage>
    );
  }

  const username = stats?.username ?? "";
  const initials = username ? username.slice(0, 2).toUpperCase() : "??";
  const location = stats?.location ?? "";
  const ratings = stats?.ratings ?? [];
  const reviews = stats?.reviews ?? [];
  const watchlist = stats?.watchlist ?? stats?.favorites ?? [];

  return (
    <section className="mx-auto mt-16 w-full max-w-5xl px-6">
      <div className="flex items-start gap-8">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-amber-300 ext-2xl font-bold tracking-wider text-white shadow-lg">
          {initials}
        </div>

        <div className="flex-1">
          <h1 className="mt-2 font-serif text-4xl font-normal text-white">
            {username || "Unknown User"}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {location && (
              <>
                <span className="mx-2 text-zinc-600">·</span>
                <span>{location}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-800/80" />

      <div className="flex flex-row justify-between py-3.5">
        <MovieStat label="Films Rated" value={stats?.filmsRated ?? 0} />
        <MovieStat label="Reviews Written" value={stats?.reviewsWritten ?? 0} />
        <MovieStat label="On Watchlist" value={stats?.watchlistCount ?? 0} />
      </div>

      <div className="border-t border-zinc-800/80" />

      <div className="mt-8 flex flex-row gap-8 border-b border-zinc-800/80">
        <TabButton
          active={activeTab === "ratings"}
          label="My Ratings"
          count={ratings.length}
          onClick={() => setActiveTab("ratings")}
        />
        <TabButton
          active={activeTab === "reviews"}
          label="My Reviews"
          count={reviews.length}
          onClick={() => setActiveTab("reviews")}
        />
        <TabButton
          active={activeTab === "watchlist"}
          label="On Watchlist"
          count={watchlist.length}
          onClick={() => setActiveTab("watchlist")}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {activeTab === "ratings" &&
          (ratings.length === 0 ? (
            <CenterMessage variant="muted">
              You haven&rsquo;t rated any films yet.
            </CenterMessage>
          ) : (
            ratings.map((r) => (
              <RatingRow key={r.id ?? r.movie?.id} rating={r} />
            ))
          ))}

        {activeTab === "reviews" &&
          (reviews.length === 0 ? (
            <CenterMessage variant="muted">
              You haven&rsquo;t written any reviews yet.
            </CenterMessage>
          ) : (
            reviews.map((r) => (
              <ReviewRow key={r.id ?? r.movie?.id} review={r} />
            ))
          ))}

        {activeTab === "watchlist" &&
          (watchlist.length === 0 ? (
            <CenterMessage variant="muted">
              Your watchlist is empty.
            </CenterMessage>
          ) : (
            watchlist.map((item) => (
              <WatchlistRow
                key={
                  item.watchlistId ??
                  item.id ??
                  item.movieId ??
                  item.movie?.id
                }
                item={item}
              />
            ))
          ))}
      </div>
    </section>
  );
}
