import { useEffect, useState } from "react";
import HomePageMovieCard from "./HomePageMovieCard";

const SLIDE_INTERVAL_MS = 5000;
const FADE_DURATION_MS = 500;

export default function HomePageMovieList({ movies, loading, error }) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
        setIsVisible(true);
      }, FADE_DURATION_MS);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [movies]);

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Failed to load movies.</p>;
  if (!movies || movies.length === 0) return <p>No movies found.</p>;

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <HomePageMovieCard movie={movies[currentMovieIndex]} />
    </div>
  );
}
