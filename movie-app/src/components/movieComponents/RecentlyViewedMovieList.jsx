import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  getRecentlyViewed,
  isUserLoggedIn,
} from "../../utils/recentlyViewedUtils";

import "swiper/css";
import "swiper/css/navigation";

export default function RecentlyViewedMovieList() {
  const [movies, setMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const [swiperRef, setSwiperRef] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(isUserLoggedIn());
      const recentMovies = getRecentlyViewed();
      setMovies(recentMovies);
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  useEffect(() => {
    const recentMovies = getRecentlyViewed();
    setMovies(recentMovies);
  }, []);

  function handleNext() {
    if (swiperRef && !isEnd) {
      swiperRef.slideNext();
    }
  }

  function handlePrev() {
    if (swiperRef && !isBeginning) {
      swiperRef.slidePrev();
    }
  }

  if (!isLoggedIn || !movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mx-20 mt-20 relative">
      <h2 className="text-2xl font-bold text-white mb-10">Recently Viewed</h2>

      {!isBeginning && (
        <button
          onClick={handlePrev}
          className="absolute left-[-70px] top-1/2 z-10 -translate-y-1/2"
        >
          <GrFormPrevious className="w-16 h-16 text-white hover:text-gray-400 cursor-pointer" />
        </button>
      )}

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={5}
        slidesPerGroup={3}
        speed={400}
        onSwiper={(swiper) => {
          setSwiperRef(swiper);
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        className="relative"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>

      {!isEnd && (
        <button
          onClick={handleNext}
          className="absolute right-[-70px] top-1/2 z-10 -translate-y-1/2"
        >
          <GrFormNext className="w-16 h-16 text-white hover:text-gray-400 cursor-pointer" />
        </button>
      )}
    </div>
  );
}
