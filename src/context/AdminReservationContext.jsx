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
      data.forEach((item) => {
        const dateKey = item.available_date;
        if (!metrics[dateKey]) {
          metrics[dateKey] = {
            total: 0,
            reserved: 0,
            pending: 0,
            available: 0,
          };
        }
        const maxCap = item.reservation_slot?.max_capacity || 0;
        metrics[dateKey].total += maxCap;
        metrics[dateKey].reserved += item.current_capacity || 0;
        metrics[dateKey].pending += item.pending || 0;
      });

      // Calculate available after summing all slots
      Object.keys(metrics).forEach((dateKey) => {
        metrics[dateKey].available = Math.max(
          0,
          metrics[dateKey].total -
            metrics[dateKey].reserved -
            metrics[dateKey].pending
        );
      });

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
  }, [selectedDate, fetchDailySchedule]);

  const value = {
    selectedDate,
    setSelectedDate,
    dailySchedule,
    monthlyMetrics,
    loading: loading.schedule, // Expose a simpler loading state for the schedule
    loadingMetrics: loading.metrics,
    error,
    refreshDailySchedule: () => fetchDailySchedule(selectedDate),
    refreshMonthlyMetrics: (monthISO) => {
      // You might want to pass the date from the calendar component here
      const dateForMetrics = monthISO ? new Date(monthISO) : selectedDate;
      const startOfMonth = new Date(
        dateForMetrics.getFullYear(),
        dateForMetrics.getMonth(),
        1
      );
      fetchMonthlyMetrics(toLocalISOString(startOfMonth));
    },
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
