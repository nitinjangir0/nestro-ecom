'use client';

import React from 'react';
import ProductCard from './ProductCard';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';

// Module
import { Pagination } from 'swiper/modules';

export default function Slider({ products = [], user }) {
  return (
    <div className="mx-auto my-20 w-full px-10">
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true }}
        grabCursor={true}
        simulateTouch={true}
        allowTouchMove={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {products?.map((product) => (
          <SwiperSlide key={product._id}>
           <ProductCard product={product} user={user} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}