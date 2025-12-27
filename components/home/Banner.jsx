"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link"; // ✅ এই line যোগ করো!

export default function Banner() {
  return (
    <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[550px] 2xl:h-[600px] relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-black/30 to-purple-900/20 backdrop-blur-xl">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
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
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />

              {/* ✅ Fixed: Link import করা আছে */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 sm:p-12 lg:p-16 text-center text-white">
                <div className="max-w-2xl mx-auto space-y-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                    Summer Sale
                  </h2>
                  <p className="text-lg sm:text-xl font-light text-white/90 drop-shadow-lg">
                    Up to 70% OFF on all categories
                  </p>
                  <Link
                    href="/category/clothing"
                    className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-white/40 border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-105"
                  >
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-full border border-white/30 shadow-xl hover:shadow-white/50 transition-all duration-300 flex items-center justify-center text-white">
          ‹
        </div>
        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-full border border-white/30 shadow-xl hover:shadow-white/50 transition-all duration-300 flex items-center justify-center text-white">
          ›
        </div>
      </Swiper>
    </div>
  );
}
