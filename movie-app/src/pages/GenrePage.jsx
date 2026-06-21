import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getMoviesByGenre } from "../api/movieApis";
import useFetch from "../hooks/useFetch";
import MovieCard from "../components/movieComponents/MovieCard";
import CenterMessage from "../components/helperComponents/CenterMessage";
import SortBar, { sortMovies } from "../components/helperComponents/SortBar";

export default function GenrePage() {
  const { genreName } = useParams();
  const [sortBy, setSortBy] = useState("rating");

  const fetchFn = useCallback(() => getMoviesByGenre(genreName), [genreName]);

  const { data: movies, loading, error } = useFetch(fetchFn, [genreName]);

  const sortedMovies = useMemo(() => sortMovies(movies, sortBy), [
    movies,
    sortBy,
  ]);

  if (loading) {
    return null;
  }
  if (error) {
    return (
      <CenterMessage variant="error">Failed to load movies.</CenterMessage>
    );
  }

  return (
    <section className="mx-20 mt-10">
      <h1 className="mb-8 font-serif text-4xl text-white">
        {genreName} <span className="text-zinc-500">movies</span>
      </h1>

      {sortedMovies.length === 0 ? (
        <CenterMessage variant="muted">
          No movies found in this genre.
        </CenterMessage>
      ) : (
        <>
          <SortBar value={sortBy} onChange={setSortBy} />
          <div className="grid grid-cols-6 gap-3">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
