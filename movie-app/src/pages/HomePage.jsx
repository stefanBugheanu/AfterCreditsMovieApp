import { getMovies, getTopRatedMovies, getAllGenres } from "../api/movieApis";
import HomePageMovieList from "../components/movieComponents/HomePageMovieList";
import MovieList from "../components/movieComponents/MovieList";
import PopularInterests from "../components/genreComponents/PopularInterests";
import RecentlyViewedMovieList from "../components/movieComponents/RecentlyViewedMovieList";
import useFetch from "../hooks/useFetch";
import HomePageLayout from "../layouts/HomePageLayout";
import CenterMessage from "../components/helperComponents/CenterMessage";

export default function HomePage() {
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(getMovies);

  const {
    data: topRatedMovies,
    loading: topRatedLoading,
    error: topRatedError,
  } = useFetch(getTopRatedMovies);

  const {
    data: genres,
    loading: genresLoading,
    error: genresError,
  } = useFetch(getAllGenres);

  const loading = moviesLoading || topRatedLoading || genresLoading;
  const error = moviesError || topRatedError || genresError;

  if (loading) {
    return null;
  }
  if (error) {
    return <CenterMessage variant="error">Failed to load page.</CenterMessage>;
  }

  return (
    <div>
      <HomePageMovieList movies={movies ?? []} />
      <HomePageLayout>
        <MovieList movies={topRatedMovies ?? []} />
        <PopularInterests genres={genres ?? []} />
        <RecentlyViewedMovieList />
      </HomePageLayout>
    </div>
  );
}
