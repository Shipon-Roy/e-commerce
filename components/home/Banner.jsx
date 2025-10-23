"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] relative">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {["banner1.jpg", "banner2.jpg", "banner3.jpg"].map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image
                src={`/assets/${img}`}
                alt={`banner-${i}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
