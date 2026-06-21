import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ReviewCard from "./ReviewCard";

import "swiper/css";
import "swiper/css/navigation";

export default function ReviewList({ reviews }) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="relative mt-8">
      {!isBeginning && (
        <button
          onClick={() => swiperRef?.slidePrev()}
          className="absolute left-[-50px] top-1/2 z-10 -translate-y-1/2"
        >
          <GrFormPrevious className="h-12 w-12 cursor-pointer text-white hover:text-gray-400" />
        </button>
      )}

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={3}
        slidesPerGroup={2}
        speed={400}
        onSwiper={(s) => {
          setSwiperRef(s);
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        onSlideChange={(s) => {
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        className="w-full"
      >
        {reviews.map((review, i) => (
          <SwiperSlide key={review.id ?? i} className="!h-auto">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      {!isEnd && (
        <button
          onClick={() => swiperRef?.slideNext()}
          className="absolute right-[-50px] top-1/2 z-10 -translate-y-1/2"
        >
          <GrFormNext className="h-12 w-12 cursor-pointer text-white hover:text-gray-400" />
        </button>
      )}
    </div>
  );
}
