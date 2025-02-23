
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const AdminDashboard = () => {
  interface Appointment {
    userId: number;
    user: { name: string };
    status: string;
    appointmentDate: string;
    preferredDoctor: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts] = useState({ total: 0, schedule: 0, cancelled: 0 });

  useEffect(() => {
    fetchAppointments();
    fetchCounts();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/appointment/all", { // Fetch all appointments
      });
  
      // Sort: Pending first, then Scheduled, then Cancelled
    //   const sortedAppointments = res.data.sort((a: Appointment, b: Appointment) => {
    //     const statusOrder = { pending: 1, scheduled: 2, cancelled: 3 };
    //     return statusOrder[a.status] - statusOrder[b.status];
    //   });
  
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  

  const fetchCounts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/appointment/counts", {
      });
      setCounts(res.data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };
  const handleAction = async (userId: number, action: "schedule" | "cancel") => {
    try {
      // Optimistic UI update
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.userId === userId ? { ...appt, status: action } : appt
        )
      );
  
      // Update counts correctly (total remains unchanged)
      setCounts((prevCounts) => ({
        total: prevCounts.total, // ✅ Do not decrease total count
        schedule: action === "schedule"
          ? prevCounts.schedule + 1
          : prevCounts.schedule - 1, // Reduce if rescheduling
        cancelled: action === "cancel"
          ? prevCounts.cancelled + 1
          : prevCounts.cancelled - 1, // Reduce if re-scheduling
      }));
  
      // API Call
      await axios.patch(`http://localhost:3001/appointment/${action}/${userId}`, {});
  
      // Fetch latest counts (optional, ensures backend sync)
      fetchCounts();
    } catch (error) {
      console.error(`Error updating appointment:`, error);
  
      // Revert UI update if API call fails
      fetchAppointments();
      fetchCounts();
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        Welcome 👋
      </h1>
      <p className="text-gray-400 mt-2">Start the day with managing new appointments</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-yellow-400 text-4xl font-bold">{counts.total}</p>
          <p className="text-gray-300 mt-1">Total appointments</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-blue-400 text-4xl font-bold">{counts.schedule}</p>
          <p className="text-gray-300 mt-1">Schedule appointments</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-red-400 text-4xl font-bold">{counts.cancelled}</p>
          <p className="text-gray-300 mt-1">Cancelled appointments</p>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="p-3">#</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Status</th>
              <th className="p-3">Appointment</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={appt.userId} className="border-b border-gray-700">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{appt.user.name}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      appt.status === "scheduled"
                        ? "bg-green-700"
                        : appt.status === "cancelled"
                        ? "bg-red-700"
                        : "bg-blue-700"
                    }`}
                  >
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">{moment(appt.appointmentDate, "DD-MM-YYYY").format("MMM D, YYYY, h:mm A")
                }</td>
                <td className="p-3">{appt.preferredDoctor}</td>
                <td className="p-3">
                  <button
                    className="text-green-400 hover:text-green-300 mr-4"
                    onClick={() => handleAction(appt.userId, "schedule")}
                  >
                    Schedule
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleAction(appt.userId, "cancel")}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-5 text-gray-400">
                  No pending appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
