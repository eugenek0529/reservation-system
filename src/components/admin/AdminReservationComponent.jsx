import React, { useEffect, useMemo, useState } from "react";
import DailyviewList from "./Reservations/DailyviewList";
import DailyviewTimeline from "./Reservations/DailyviewTimeline";
import MonthlyView from "./Reservations/MonthlyView";
import ViewToggle from "./Reservations/ViewToggle";
import DateNavigator from "./Reservations/DateNavigator";
import NewReservationForm from "./Forms/NewReservationForm";
import { ReservationAvailabilityAPI } from "../../api/reservationAvailabilityAPI";
import { useAdminReservations } from "../../context/AdminReservationContext";
import { supabase } from "../../supabase/supabaseClient"; // Add this import
import { toLocalISOString } from "../../utils/dateUtils";

function AdminReservationComponent() {
  const [viewMode, setViewMode] = useState("daily");
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

 

  // Use context instead of local state
  const {
    dailySchedule,
    monthlyMetrics,
    loading,
    loadingMetrics,
    selectedDate,
    setSelectedDate,
    refreshDailySchedule,
    refreshMonthlyMetrics,
  } = useAdminReservations();

  // Create a flattened list of all reservations for the list view
  const allReservations = useMemo(
    () =>
      dailySchedule.flatMap((slot) =>
        slot.reservations.map((res) => ({
          ...res,
          reservationTime: slot.startTime,
        }))
      ),
    [dailySchedule]
  );

  // Monthly availability state (keep this local)
  const [monthChecking, setMonthChecking] = useState(false);
  const [monthExists, setMonthExists] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [monthError, setMonthError] = useState("");

  const navigateDate = (dir) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "daily")
        d.setDate(d.getDate() + (dir === "prev" ? -1 : 1));
      else {
        // For monthly view, always stay in current month
        const currentMonth = new Date();
        d.setFullYear(currentMonth.getFullYear());
        d.setMonth(currentMonth.getMonth());
        d.setDate(1);
      }
      return d;
    });
  };

  // Helpers
  const monthStartISO = useMemo(() => {
    const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    d.setHours(0, 0, 0, 0);
    return toLocalISOString(d);
  }, [selectedDate]);

  const monthLabel = useMemo(
    () =>
      selectedDate.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [selectedDate]
  );

  // Reset to current month when switching to monthly view
  useEffect(() => {
    if (viewMode === "monthly") {
      setSelectedDate(new Date()); // Reset to current month (August)
    }
  }, [viewMode, setSelectedDate]);

  // Check if month availability exists whenever monthly view + date changes
  useEffect(() => {
    if (viewMode !== "monthly") return;
    let cancelled = false;
    setMonthChecking(true);
    setMonthError("");
    ReservationAvailabilityAPI.monthExists(monthStartISO)
      .then((exists) => {
        if (!cancelled) setMonthExists(Boolean(exists));
      })
      .catch((e) => {
        if (!cancelled) setMonthError(e?.message || "Failed to check month");
      })
      .finally(() => {
        if (!cancelled) setMonthChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [viewMode, monthStartISO]);

  // Fetch monthly metrics when monthly view is active
  useEffect(() => {
    if (viewMode !== "monthly") return;
    // Always use current month for monthly view, not selectedDate
    const currentMonth = new Date();
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    refreshMonthlyMetrics(toLocalISOString(currentMonthStart));
  }, [viewMode, refreshMonthlyMetrics]);

  async function handleOpenMonth() {
    try {
      setSeeding(true);
      setMonthError("");
      const res = await ReservationAvailabilityAPI.ensureMonthAvailability(
        monthStartISO
      );
      setSeedResult(res);
      setMonthExists(true);
      // Refresh monthly metrics after opening the month
      refreshMonthlyMetrics(monthStartISO);
    } catch (e) {
      setMonthError(e?.message || "Failed to open month");
    } finally {
      setSeeding(false);
    }
  }

  const handleMonthDateSelect = (dateObj) => {
    // normalize start-of-day
    const d = new Date(dateObj);
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
    setViewMode("daily");
  };

  // Handle reservation form submission
  const handleCreateReservation = async (reservationData) => {
    try {
      setFormSubmitting(true);
      
      // Get admin ID directly from Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Creating reservation with admin ID:', user.id);
      
      // Create the reservation using your API
      await ReservationAvailabilityAPI.createReservation({
        date: reservationData.date,
        reservationSlotId: reservationData.reservationSlotId,
        adminUserId: user.id, // Get from Supabase auth
        guests: reservationData.guests,
        status: reservationData.status,
        specialRequirements: reservationData.specialRequirements,
        customerName: reservationData.customerName,
        customerEmail: reservationData.contactEmail,
        customerPhone: reservationData.contactPhone,
      });

      // Close the form
      setShowReservationForm(false);
      
      // Refresh the data to show the new reservation
      refreshDailySchedule(selectedDate);
      if (viewMode === "monthly") {
        refreshMonthlyMetrics();
      }
      
      // Show success message
      alert("Reservation created successfully!");
      
    } catch (error) {
      console.error("Failed to create reservation:", error);
      alert(`Failed to create reservation: ${error.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white"> 
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Reservations</h1> 
          <p className="text-sm text-gray-500">
            Manage all reservations of the day and month
          </p>
        </div>
        <button 
          onClick={() => setShowReservationForm(true)}
          className="bg-gray-900 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors" 
        >
          New Reservation
        </button>
      </div>

      <div className="p-3 border border-gray-300 rounded-lg flex"> {/* Increased from p-2 to p-3 */}
        <div className="w-full">
          <div className="mb-3"> {/* Increased from mb-2 to mb-3 */}
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
          <div className="mb-4"> {/* Increased from mb-4 to mb-4 (kept same) */}
            <DateNavigator
              viewMode={viewMode}
              date={selectedDate}
              onPrev={() => navigateDate("prev")}
              onNext={() => navigateDate("next")}
            />
          </div>

          {viewMode === "daily" ? (
            <div className="p-3 flex gap-3"> 
              <div className="flex-1 border border-gray-200 rounded-lg">
                {loading ? (
                  <div className="p-4 text-center text-gray-500"> 
                    Loading reservations...
                  </div>
                ) : (
                  <DailyviewList
                    reservations={allReservations}
                    selectedDate={selectedDate}
                  />
                )}
              </div>
              <div className="flex-[2] border border-gray-200 rounded-lg">
                {loading ? (
                  <div className="p-4 text-center text-gray-500"> 
                    Loading timeline...
                  </div>
                ) : (
                  <DailyviewTimeline
                    schedule={dailySchedule}
                    selectedDate={selectedDate}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 flex-1 border border-gray-200 rounded-lg"> {/* Increased from p-3 to p-4 */}
              {monthChecking ? (
                <div className="p-4 text-center text-gray-500">
                  Checking month availability...
                </div>
              ) : monthExists ? (
                loadingMetrics ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading monthly metrics...
                  </div>
                ) : (
                  <MonthlyView
                    selectedDate={selectedDate}
                    metricsByDate={monthlyMetrics}
                    onSelectDate={handleMonthDateSelect}
                  />
                )
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 mb-4">
                    No availability data for {monthLabel}
                  </p>
                  <button
                    onClick={handleOpenMonth}
                    disabled={seeding}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {seeding ? "Opening..." : "Open Month"}
                  </button>
                  {monthError && (
                    <p className="text-red-600 text-sm mt-2">{monthError}</p>
                  )}
                  {seedResult && (
                    <p className="text-green-600 text-sm mt-2">
                      Created {seedResult.created} availability records
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <NewReservationForm
          selectedDate={selectedDate}
          onSubmit={handleCreateReservation}
          onCancel={() => setShowReservationForm(false)}
        />
      )}
    </div>
  );
}

export default AdminReservationComponent;
