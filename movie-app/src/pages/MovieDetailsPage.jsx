import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaPlus, FaCheck } from "react-icons/fa";
import {
  getMovieById,
  addRatingToMovie,
  addReviewToMovie,
  getUserStats,
  addToWatchlist,
  removeFromWatchlist,
} from "../api/movieApis";
import useFetch from "../hooks/useFetch";
import ReviewList from "../components/movieComponents/ReviewList";
import CenterMessage from "../components/helperComponents/CenterMessage";
import { addToRecentlyViewed } from "../utils/recentlyViewedUtils";

const REVIEW_MAX = 2000;

function formatGenres(movie) {
  if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    return movie.genres.join(" / ");
  }
  return movie.genre ?? "";
}

function getCurrentUsername() {
  const stored = localStorage.getItem("username");
  if (stored) return stored;
  const token = localStorage.getItem("token");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username || payload.sub || "";
  } catch {
    return "";
  }
}

function readCachedRating(username, movieId) {
  if (!username) return 0;
  const newKey = `userRating:${username}:${movieId}`;
  const newRaw = localStorage.getItem(newKey);
  if (newRaw != null) {
    const n = parseInt(newRaw, 10);
    return Number.isFinite(n) ? n : 0;
  }
  const legacyKey = `userRating:${movieId}`;
  const legacyRaw = localStorage.getItem(legacyKey);
  if (legacyRaw != null) {
    const n = parseInt(legacyRaw, 10);
    if (Number.isFinite(n) && n > 0) {
      localStorage.setItem(newKey, String(n));
      localStorage.removeItem(legacyKey);
      return n;
    }
  }
  return 0;
}

function writeCachedRating(username, movieId, value) {
  if (!username) return;
  const key = `userRating:${username}:${movieId}`;
  if (value > 0) {
    localStorage.setItem(key, String(value));
  } else {
    localStorage.removeItem(key);
  }
}

function StarRow({ value, onChange, size = "text-xl", disabled = false }) {
  const [hover, setHover] = useState(0);
  const display = (!disabled && hover) || value;

  return (
    <div className="flex flex-row gap-1" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: 10 }, (_, i) => {
        const idx = i + 1;
        const filled = idx <= display;
        const Icon = filled ? FaStar : FaRegStar;
        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onMouseEnter={disabled ? undefined : () => setHover(idx)}
            onClick={
              disabled ? undefined : () => onChange(idx === value ? 0 : idx)
            }
            className={`${size} transition-colors ${
              disabled ? "cursor-default" : "cursor-pointer"
            } ${
              filled
                ? "text-yellow-400"
                : disabled
                  ? "text-zinc-600"
                  : "text-zinc-600 hover:text-zinc-400"
            }`}
            aria-label={`Rate ${idx} out of 10`}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const fetchFn = useCallback(() => getMovieById(id), [id]);
  const {
    data: movie,
    loading,
    error,
    refetch: refetchMovie,
  } = useFetch(fetchFn, [id]);

  const [userRating, setUserRating] = useState(0);
  const [savingRating, setSavingRating] = useState(false);
  const [reviewBody, setReviewBody] = useState("");
  const [postingReview, setPostingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(getCurrentUsername);
  const [onWatchlist, setOnWatchlist] = useState(false);
  const [savingWatchlist, setSavingWatchlist] = useState(false);

  useEffect(() => {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("localReviews:") || key.startsWith("reviewed:"))
      ) {
        toRemove.push(key);
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  }, []);

  const statsFetchFn = useCallback(() => {
    if (!currentUsername) return Promise.resolve(null);
    return getUserStats();
  }, [currentUsername]);
  const {
    data: stats,
    loading: statsLoading,
    refetch: refetchStats,
  } = useFetch(statsFetchFn, [currentUsername]);

  useEffect(() => {
    const handler = () => setCurrentUsername(getCurrentUsername());
    window.addEventListener("authChange", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("authChange", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const allReviews = useMemo(() => movie?.reviews ?? [], [movie?.reviews]);

  const randomReviews = useMemo(() => {
    if (allReviews.length <= 15) return allReviews;
    return [...allReviews].sort(() => Math.random() - 0.5).slice(0, 15);
  }, [allReviews]);

  useEffect(() => {
    if (!movie) return;
    const fromStats = stats?.ratings?.find((r) => r.movie?.id === id)?.value;
    if (fromStats != null && fromStats > 0) {
      setUserRating(fromStats);
      writeCachedRating(currentUsername, id, fromStats);
    } else {
      setUserRating(readCachedRating(currentUsername, id));
    }
  }, [movie, id, currentUsername, stats]);

  useEffect(() => {
    const list = stats?.watchlist ?? stats?.favorites ?? [];
    setOnWatchlist(list.some((w) => (w.movieId ?? w.movie?.id ?? w.id) === id));
  }, [stats, id]);

  useEffect(() => {
    if (movie) {
      addToRecentlyViewed(movie);
    }
  }, [movie]);

  async function handleToggleWatchlist() {
    if (!currentUsername || savingWatchlist) return;
    const prev = onWatchlist;
    setOnWatchlist(!prev);
    setSavingWatchlist(true);
    try {
      if (prev) {
        await removeFromWatchlist(id);
      } else {
        await addToWatchlist(id);
      }
      refetchStats();
    } catch (err) {
      console.error("Failed to update watchlist", err);
      setOnWatchlist(prev);
    } finally {
      setSavingWatchlist(false);
    }
  }

  async function handlePostReview() {
    const content = reviewBody.trim();
    if (userRating === 0 || content.length === 0) return;
    setPostingReview(true);
    setReviewError("");
    try {
      await addReviewToMovie(id, content);
      setShowReviewForm(false);
      setReviewBody("");
      refetchMovie();
    } catch (err) {
      console.error("Failed to post review", err);
      setReviewError(
        err?.response?.data?.message ||
          "Failed to post review. Please try again.",
      );
    } finally {
      setPostingReview(false);
    }
  }

  async function handleRate(next) {
    const prev = userRating;
    setUserRating(next);
    setSavingRating(true);
    try {
      await addRatingToMovie(id, next);
      writeCachedRating(currentUsername, id, next);
      refetchStats();
    } catch (err) {
      console.error("Failed to save rating", err);
      setUserRating(prev);
    } finally {
      setSavingRating(false);
    }
  }

  if (loading || statsLoading) {
    return null;
  }
  if (error || !movie) {
    return <CenterMessage variant="error">Failed to load movie.</CenterMessage>;
  }

  const duration = `${movie.duration} min` || null;
  const genres = formatGenres(movie);
  const reviewCount = allReviews.length;
  const userHasReviewed =
    !!currentUsername &&
    allReviews.some(
      (r) => (r.username ?? r.user?.username) === currentUsername,
    );

  return (
    <div className="relative">
      <div className="relative h-150 object-fit opacity-70 overflow-hidden">
        {movie.backdropUrl && (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#050505]" />

        <div className="absolute bottom-0 left-0 z-10 max-w-2xl px-8 pb-12">
          <div className="mb-4 flex flex-row items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400/90">
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            {duration && (
              <>
                <span className="text-zinc-600">•</span>
                <span>{duration}</span>
              </>
            )}
            {genres && (
              <>
                <span className="text-zinc-600">•</span>
                <span>{genres}</span>
              </>
            )}
          </div>

          <h1 className="mb-6 font-serif text-7xl text-white md:text-8xl">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="font-serif text-xl italic text-zinc-400">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-8 pb-24">
        <div className="flex flex-row gap-12 border-b border-zinc-800/80 pb-8">
          <div>
            <div className="flex items-baseline">
              <span className="font-serif text-4xl text-white">
                {movie.rating ?? "—"}
              </span>
              <span className="text-xs text-zinc-500">/10</span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Average
            </div>
          </div>

          <div>
            <span className="font-serif text-4xl text-white">
              {reviewCount}
            </span>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Reviews
            </div>
          </div>

          <div>
            <div className="flex items-baseline">
              <span className="font-serif text-4xl text-white">
                {userRating || "—"}
              </span>
              <span className="text-xs text-zinc-500">/10</span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Your rating
            </div>
          </div>
        </div>

        {movie.description && (
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-zinc-300">
            {movie.description}
          </p>
        )}

        {(movie.director ||
          (Array.isArray(movie.actors) && movie.actors.length > 0)) && (
          <div className="mt-8 flex flex-col gap-4 max-w-2xl">
            {movie.director && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Director
                </div>
                <div className="mt-1 text-sm text-zinc-200">
                  {movie.director}
                </div>
              </div>
            )}
            {Array.isArray(movie.actors) && movie.actors.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Cast
                </div>
                <div className="mt-1 text-sm leading-relaxed text-zinc-200">
                  {movie.actors.join(", ")}
                </div>
              </div>
            )}
          </div>
        )}

        {currentUsername && (
          <div className="mt-8 flex flex-row flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={handleToggleWatchlist}
              disabled={savingWatchlist}
              className={`flex flex-row items-center gap-2 rounded-md border px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                onWatchlist
                  ? "border-green-500/40 bg-green-500/10 hover:bg-green-500/20"
                  : "border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800"
              }`}
            >
              {onWatchlist ? (
                <FaCheck className="text-xs text-green-400" />
              ) : (
                <FaPlus className="text-xs" />
              )}
              <span>{onWatchlist ? "On Watchlist" : "Add to Watchlist"}</span>
            </button>

            <div
              className={`flex flex-row items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/40 px-4 py-2 ${
                savingRating ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Rate
              </span>
              <StarRow
                value={userRating}
                onChange={handleRate}
                disabled={userRating > 0}
              />
            </div>
          </div>
        )}

        <section className="mt-16">
          <div className="mb-8 flex flex-row items-center justify-between">
            <h2 className="font-serif text-4xl text-white">
              Reviews{" "}
              <span className="text-base text-zinc-500">{reviewCount}</span>
            </h2>

            {currentUsername &&
              (userHasReviewed ? (
                <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  You&rsquo;ve already reviewed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (showReviewForm) {
                      setReviewBody("");
                      setReviewError("");
                    }
                    setShowReviewForm((v) => !v);
                  }}
                  className="flex flex-row items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  <FaPlus
                    className={`text-xs transition-transform duration-300 ${
                      showReviewForm ? "rotate-45" : ""
                    }`}
                  />
                  <span>{showReviewForm ? "Cancel" : "Add Review"}</span>
                </button>
              ))}
          </div>

          {currentUsername && !userHasReviewed && (
            <div
              className={`grid transition-all duration-300 ease-out ${
                showReviewForm
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    Write a review
                  </div>

                  {userRating === 0 && (
                    <div className="mb-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
                      Please rate this movie before posting a review.
                    </div>
                  )}

                  {reviewError && (
                    <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                      {reviewError}
                    </div>
                  )}

                  <textarea
                    value={reviewBody}
                    onChange={(e) =>
                      setReviewBody(e.target.value.slice(0, REVIEW_MAX))
                    }
                    placeholder={`Share your thoughts on ${movie.title}...`}
                    rows={4}
                    disabled={postingReview}
                    className="w-full resize-y rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none disabled:opacity-60"
                  />

                  <div className="mt-3 flex flex-row items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {reviewBody.length} / {REVIEW_MAX}
                    </span>
                    <button
                      type="button"
                      onClick={handlePostReview}
                      disabled={
                        userRating === 0 ||
                        reviewBody.trim().length === 0 ||
                        postingReview
                      }
                      className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {postingReview ? "Posting..." : "Post Review"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {randomReviews.length > 0 ? (
            <ReviewList reviews={randomReviews} />
          ) : currentUsername ? (
            <CenterMessage variant="muted">
              Be the first to write a review.
            </CenterMessage>
          ) : null}
        </section>
      </div>
    </div>
  );
}
