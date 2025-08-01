import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";

function RestaurantDetails() {
  const [reservationTypes, setReservationTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservationTypes();
  }, []);

  const fetchReservationTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservation_type')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setReservationTypes(data || []);
    } catch (err) {
      console.error('Error fetching reservation types:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* Reservation Section */}
      <div className="reservation-section mt-8">
        <h3 className="text-xl mb-4">Reservation</h3>
        
        {loading && (
          <div className="text-center py-4">
            <p>Loading reservation types...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 py-4">
            <p>Error loading reservation types: {error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-4">
            {reservationTypes.map((type) => (
              <div
                key={type.id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <h4 className="text-sm text-gray-800 mb-3">
                  {type.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {type.description}
                </p>
                <p className="text-sm text-gray-600">
                  ${type.price_per_person} per person
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Location & Hours Section */}
      <div className="location-hours-section mt-8">
        <h3 className="text-xl mb-4">Location & Hours</h3>
        <div className="space-y-2 text-gray-600">
          <p className="flex items-center">
            <span className="mr-2">📍</span>
            123 Sushi Street, City of Industry, CA 91748
          </p>
          <p className="flex items-center">
            <span className="mr-2"></span>
            Lunch: 12:00 PM - 2:30 PM
          </p>
          <p className="flex items-center">
            <span className="mr-2"></span>
            Dinner: 5:30 PM - 10:00 PM
          </p>
          <p className="flex items-center">
            <span className="mr-2"></span>
            (626) 555-0123
          </p>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
