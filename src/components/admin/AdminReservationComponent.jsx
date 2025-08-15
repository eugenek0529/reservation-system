import React, { useEffect, useMemo, useState } from "react";
import DailyviewList from "./Reservations/DailyviewList";
import DailyviewTimeline from "./Reservations/DailyviewTimeline";
import MonthlyView from "./Reservations/MonthlyView";
import ViewToggle from "./Reservations/ViewToggle";
import DateNavigator from "./Reservations/DateNavigator";
import { ReservationAvailabilityAPI } from "../../api/reservationAvailabilityAPI";
import { useAdminReservations } from "../../context/AdminReservationContext";
import { toLocalISOString } from "../../utils/dateUtils";

function AdminReservationComponent() {
  const [viewMode, setViewMode] = useState("daily");

  // Use context instead of local state
  const {
    dailySchedule,
    monthlyMetrics,
    loading,
    loadingMetrics, // Add this
    selectedDate,
    setSelectedDate,
    refreshMonthlyMetrics,
  } = useAdminReservations();

  // Create a flattened list of all reservations for the list view
  const allReservations = useMemo(
    () =>
      dailySchedule.flatMap((slot) =>
        slot.reservations.map((res) => ({
          ...res,
          reservationTime: slot.startTime, // Add startTime for sorting/display in the list
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

  // Reset to current month when switching to monthly view
  useEffect(() => {
    if (viewMode === "monthly") {
      setSelectedDate(new Date()); // Reset to current month (August)
    }
  }, [viewMode]);

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
    return toLocalISOString(d); // YYYY-MM-01
  }, [selectedDate]);

  const monthLabel = useMemo(
    () =>
      selectedDate.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [selectedDate]
  );

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

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Reservations</h1>
          <p className="text-sm text-gray-500">
            Manage all reservations of the day and month
          </p>
        </div>
        <button className="bg-gray-900 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          New Reservation
        </button>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg flex min-h-screen">
        <div className="w-full">
          <div className="mb-3">
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
          <div className="mb-6">
            <DateNavigator
              viewMode={viewMode}
              date={selectedDate}
              onPrev={() => navigateDate("prev")}
              onNext={() => navigateDate("next")}
            />
          </div>

          {viewMode === "daily" ? (
            <div className="p-4 flex gap-3">
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
            <div className="p-4 flex-1 border border-gray-200 min-h-screen rounded-lg">
              {/* Month availability controls */}
              <div className="mb-4">
                {monthChecking ? (
                  <div className="text-sm text-gray-500">
                    Checking {monthLabel}…
                  </div>
                ) : !monthExists ? (
                  <div className="flex items-center justify-between gap-3 p-3 border rounded-lg">
                    <div className="text-sm text-gray-700">
                      No availability found for {monthLabel}. Open reservations
                      for this month?
                    </div>
                    <button
                      onClick={handleOpenMonth}
                      className="px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                      disabled={seeding}
                    >
                      {seeding ? "Opening…" : `Open ${monthLabel}`}
                    </button>
                  </div>
                ) : seedResult?.created >= 0 ? (
                  <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 inline-block">
                    Opened {monthLabel} (created {seedResult.created} rows)
                  </div>
                ) : null}
                {monthError && (
                  <div className="mt-2 text-xs text-red-600">{monthError}</div>
                )}
              </div>

              {/* Calendar */}
              {loadingMetrics ? ( // Change from loading to loadingMetrics
                <div className="p-4 text-center text-gray-500">
                  Loading calendar...
                </div>
              ) : (
                <MonthlyView
                  selectedDate={selectedDate}
                  onSelectDate={handleMonthDateSelect}
                  metricsByDate={monthlyMetrics}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReservationComponent;
