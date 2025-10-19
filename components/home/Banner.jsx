"use client";
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

export default function Banner() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        // className="h-[300px]"
      >
        <SwiperSlide>
          <div className="h-[400px]">
            <Image src="/assets/banner1.jpg" alt="" fill className="w-screen" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-[400px]">
            <Image src="/assets/banner2.jpg" alt="" fill className="w-screen" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-[400px]">
            <Image src="/assets/banner3.jpg" alt="" fill className="w-screen" />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
