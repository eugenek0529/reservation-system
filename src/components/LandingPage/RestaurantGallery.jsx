import React from "react";
import sushiImage from "../../assets/landing.png";

function RestaurantGallery() {
  return (
    <div
      className="
        restaurant-gallery
        h-64
        sm:h-80
        md:h-96
        lg:h-[32rem]
        rounded-lg
        overflow-hidden
        shadow-lmd
        bg-center
      "
      style={{
        backgroundImage: `url(${sushiImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}

export default RestaurantGallery;
