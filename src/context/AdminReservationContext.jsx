import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ReservationAvailabilityAPI } from "../api";

const AdminReservationContext = createContext();

export function AdminReservationProvider({ children }) {
  const [reservations, setReservations] = useState([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch daily reservations for a specific date
  const fetchDailyReservations = useCallback(async (dateISO) => {
    try {
      setLoading(true);
      const data = await ReservationAvailabilityAPI.getDailyReservations(
        dateISO
      );
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch daily reservations:", error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch monthly metrics
  const fetchMonthlyMetrics = useCallback(async (monthISO) => {
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
    }
  }, []);

  // Refresh data when date changes
  useEffect(() => {
    const dateISO = selectedDate.toISOString().slice(0, 10);
    fetchDailyReservations(dateISO);
  }, [selectedDate, fetchDailyReservations]);

  // Refresh monthly metrics when needed
  const refreshMonthlyMetrics = useCallback(
    (monthISO) => {
      fetchMonthlyMetrics(monthISO);
    },
    [fetchMonthlyMetrics]
  );

  // Add new reservation (this would be called after creating a reservation)
  const addReservation = useCallback(
    (newReservation) => {
      setReservations((prev) => [...prev, newReservation]);

      // Also refresh monthly metrics to update the calendar
      const monthISO =
        selectedDate.toISOString().slice(0, 10).substring(0, 7) + "-01";
      fetchMonthlyMetrics(monthISO);
    },
    [selectedDate, fetchMonthlyMetrics]
  );

  const value = {
    reservations,
    monthlyMetrics,
    loading,
    selectedDate,
    setSelectedDate,
    fetchDailyReservations,
    fetchMonthlyMetrics,
    refreshMonthlyMetrics,
    addReservation,
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
