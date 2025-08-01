import React, { useEffect } from "react";
import LandingHeader from "../components/Landing-Header";
import RestaurantGallery from "../components/LandingPage/RestaurantGallery";
import RestaurantDetails from "../components/LandingPage/RestaurantDetails";
import MakeReservation from "../components/LandingPage/MakeReservation";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const { session, loading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session && userRole === 'admin') {
      navigate('/admin');
    }
  }, [session, userRole, loading, navigate]);

  return (
    <div className="landing-page min-h-screen font-sans">
      <LandingHeader />
      <div className="landing-page-container mx-5 px-4 py-4">
        <RestaurantGallery />
        <div className="landing-page-content flex mt-5">
          <div className="details flex-2">
            <RestaurantDetails />
          </div>
          <div className="make-reservation flex-1">
            <MakeReservation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
