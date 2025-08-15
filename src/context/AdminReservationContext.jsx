import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ReservationAvailabilityAPI } from "../api/reservationAvailabilityAPI";
import { toLocalISOString } from "../utils/dateUtils";

const AdminReservationContext = createContext();

export function AdminReservationProvider({ children }) {
  const [dailySchedule, setDailySchedule] = useState([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState({});
  const [loading, setLoading] = useState({ schedule: true, metrics: true });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchDailySchedule = useCallback(async (date) => {
    setLoading((prev) => ({ ...prev, schedule: true }));
    setError(null);
    try {
      const scheduleData = await ReservationAvailabilityAPI.getDailySchedule(
        toLocalISOString(date)
      );
      setDailySchedule(scheduleData);
    } catch (error) {
      setError(error.message);
      setDailySchedule([]);
    } finally {
      setLoading((prev) => ({ ...prev, schedule: false }));
    }
  }, []);

  // Fetch monthly metrics
  const fetchMonthlyMetrics = useCallback(async (monthISO) => {
    setLoading((prev) => ({ ...prev, metrics: true }));
    try {
      const data = await ReservationAvailabilityAPI.getMonthlyMetrics(monthISO);

      // Group by date and calculate totals
      const metrics = {};
      (data || []).forEach((item) => {
        const dateKey = item.available_date;
        if (!metrics[dateKey]) {
          metrics[dateKey] = {
            total: 0,
            reserved: 0,
            pending: 0,
            available: 0,
          };
        }
        
        // Use the actual max_capacity from your data (should be 12)
        const maxCap = item.max_capacity || 12;
        const availableCap = item.current_capacity || 0;
        const pendingCap = 0; // No pending data in current query
        const reservedCap = Math.max(0, maxCap - availableCap);

        console.log(`Processing date ${dateKey}: maxCap=${maxCap}, availableCap=${availableCap}, pendingCap=${pendingCap}, reservedCap=${reservedCap}`);

        metrics[dateKey].total += maxCap;
        metrics[dateKey].reserved += reservedCap;
        metrics[dateKey].pending += pendingCap;
        metrics[dateKey].available += availableCap;
      });

      console.log('Final calculated metrics:', metrics);
      console.log('Dates with data:', Object.keys(metrics));
      setMonthlyMetrics(metrics);
    } catch (error) {
      console.error("Failed to fetch monthly metrics:", error);
      setMonthlyMetrics({});
    } finally {
      setLoading((prev) => ({ ...prev, metrics: false }));
    }
  }, []);

  // Refresh data when date changes
  useEffect(() => {
    fetchDailySchedule(selectedDate);
    // Also fetch monthly metrics for the current month
    const startOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    fetchMonthlyMetrics(toLocalISOString(startOfMonth));
  }, [selectedDate, fetchDailySchedule, fetchMonthlyMetrics]);

  const refreshDailySchedule = useCallback(
    () => fetchDailySchedule(selectedDate),
    [selectedDate, fetchDailySchedule]
  );

  const refreshMonthlyMetrics = useCallback(
    (monthISO) => {
      // Always use the current month if no monthISO is provided
      const dateForMetrics = monthISO ? new Date(monthISO) : new Date();
      const startOfMonth = new Date(
        dateForMetrics.getFullYear(),
        dateForMetrics.getMonth(),
        1
      );
      fetchMonthlyMetrics(toLocalISOString(startOfMonth));
    },
    [fetchMonthlyMetrics]
  );

  const value = {
    selectedDate,
    setSelectedDate,
    dailySchedule,
    monthlyMetrics,
    loading: loading.schedule, // Expose a simpler loading state for the schedule
    loadingMetrics: loading.metrics, // Make sure this is exposed
    error,
    refreshDailySchedule,
    refreshMonthlyMetrics,
  };

  return (
    <AdminReservationContext.Provider value={value}>
      {children}
    </AdminReservationContext.Provider>
  );
}

export function useAdminReservations() {
  const context = useContext(AdminReservationContext);
  if (!context) {
    throw new Error(
      "useAdminReservations must be used within an AdminReservationProvider"
    );
  }
  return context;
}
