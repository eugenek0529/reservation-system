import React from "react";

function RestaurantDetails() {
  return (
    <div className="restaurant-details">
      <div className="info">
        <h2 className="text-2xl">Sushi Yuen</h2>
        <p>City of Industry, CA • Sushi • $$$$</p>
        <p>
          Sushi Yuen omakase serves courses based on Kaiseki ryori combined with
          the concept of Edomae style Sushiya. Using seasonal seafood from
          Toyosu Fish Market in Japan with Edomae techniques such as aging,
          curing and marinating.
        </p>
      </div>
      <div className="reservation_types"></div>
      <div className="locationHour">
        <p className="location">
          📍 123 Sushi Street, City of Industry, CA 91748
        </p>
        <p>🕒 Lunch: 12:00 PM - 2:30 PM</p>
        <p>🕒 Dinner: 5:30 PM - 10:00 PM</p>
        <p>📞 (626) 555-0123</p>
      </div>
    </div>
  );
}

export default RestaurantDetails;
