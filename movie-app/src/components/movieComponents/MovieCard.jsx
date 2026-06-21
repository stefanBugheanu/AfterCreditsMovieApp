import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="flex flex-col overflow-hidden w-full rounded-2xl hover:cursor-pointer hover:scale-[1.03] transition-transform duration-300 mt-3"
    >
      <div className="relative ">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded  bg-amber-50 px-2 py-1">
          <FaStar className="text-yellow-400 text-xl" />
          <span className="text-yellow-400 text-xl font-semibold">
            {movie.rating}
          </span>
        </div>
      </div>

      <div className="p-2">
        <h2 className="text-sm text-white font-bold truncate">{movie.title}</h2>
        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">
          {movie.releaseYear} · {movie.genre}
        </p>
      </div>
    </Link>
  );
}
