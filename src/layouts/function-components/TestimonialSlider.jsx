import { useRef, useState } from "react";
import { Star } from "react-feather";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const TestimonialSlider = ({ list }) => {
  SwiperCore.use([Pagination]);
  const [swiper, setSwiper] = useState(null);
  const paginationRef = useRef(null);

  return (
    <div className="reviews-carousel relative py-12 px-4 lg:px-8 bg-gray-50">
      {/* Removed rounded edges and shadow from outer slider container */}

      <Swiper
        pagination={{
          type: "bullets",
          el: paginationRef.current,
          clickable: true,
          dynamicBullets: true,
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          992: { slidesPerView: 2, spaceBetween: 30 },
          1200: { slidesPerView: 3, spaceBetween: 40 },
        }}
      >
        {list.map((item, i) => (
          <SwiperSlide key={`feature-${i}`}>
            <div className="review p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              {/* Adjusted padding and individual testimonial border radius (rounded-lg) */}
              
              <div className="review-author-avatar mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <img src={item.avatar} alt={item.author} className="w-18 h-18 rounded-full border-4 border-white object-cover" />
              </div>
              <h4 className="text-xl font-semibold text-center text-gray-800 mb-1">{item.author}</h4>
              <p className="text-center text-gray-500 mb-4">{item.organization}</p>
              <p className="text-gray-600 text-center leading-relaxed">{item.content}</p>
              <div className="review-rating mt-4 flex items-center justify-center space-x-2 text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} fill={index < item.rating ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="relative flex justify-center mt-8">
        <div
          className="swiper-pagination reviews-carousel-pagination !bottom-0"
          style={{ width: "100%" }}
          ref={paginationRef}
        ></div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
