import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import GenreCard from "./GenreCard";

export default function PopularInterests({ genres, loading, error }) {
  const navigate = useNavigate();

  return (
    <section className="mx-20 mt-20">
      <button className="mb-6 flex items-center gap-2 border-l-4 border-red-500 pl-3 text-white hover:text-zinc-300">
        <span className="text-sm font-semibold">Popular interests</span>
        <FiChevronRight className="text-red-500" />
      </button>

      {loading && <p className="text-zinc-500">Loading genres...</p>}
      {error && <p className="text-zinc-500">Failed to load genres.</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <GenreCard
              key={genre.name}
              name={genre.name}
              count={genre.count}
              onClick={() => navigate(`/movies/genre/${genre.name}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
