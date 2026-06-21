import H1 from "../helperComponents/H1";
import Button from "../helperComponents/Button";
import P from "../helperComponents/P";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HomePageMovieCard({ movie }) {
  if (!movie) return null;

  return (
    <div className="relative">
      <img
        src={movie.backdropUrl}
        alt={movie.title}
        className="h-150 inset-0 w-full object-fit opacity-60"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

      <div className="absolute bottom-10 left-10 flex flex-col gap-4">
        <H1 className="">{movie.title}</H1>
        <div className="flex flex-row items-center gap-1">
          <FaStar className="text-yellow-400 text-2xl" />
          <p className="text-2xl text-yellow-400">{movie.rating}</p>
        </div>

        <div className="flex flex-row gap-3">
          <P>{movie.releaseYear}</P>
          <P>{movie.genre}</P>
          <P>{movie.duration} min</P>
        </div>
        <div className="flex flex-row gap-3">
          <Link to={`/movies/${movie.id}`}>
            <Button className="bg-red-500 hover:bg-red-400  transition duration-300">
              <P>More Details</P>
            </Button>
          </Link>
          <Button className="bg-gray-700 hover:bg-gray-600 transition duration-300">
            <P>Watch Trailer</P>
          </Button>
        </div>
      </div>
    </div>
  );
}
