"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Appointment {
  id: number;
  preferredDoctor: string;
  appointmentDate: string;
  reasons: string;
}

export default function AppointmentSuccessPage() {
  const [latestAppointment, setLatestAppointment] = useState<Appointment | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User not authenticated");
        return;
      }

      try {
        const res = await fetch("http://localhost:3001/appointment/my-appointments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.appointments.length > 0) {
          setLatestAppointment(data.appointments[data.appointments.length - 1]);
        } else {
          console.error("No appointments found");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        
        {/* CarePulse Logo (Replace with your own if needed) */}
        <div className="flex justify-center mb-4">
          <img src="/your-logo.png" alt="CarePulse" className="h-10" />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-blue-500 p-4 rounded-full">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>



        {/* Success Message */}
        <h2 className="text-2xl font-semibold mt-4">
          Your <span className="text-green-400">appointment request</span> has been successfully submitted!
        </h2>
        
        <p className="text-gray-400 mt-2">We'll be in touch shortly to confirm.</p>

        {/* Appointment Details */}
        {latestAppointment ? (
          <div className="mt-6 bg-gray-700 p-4 rounded-md">
            <div className="flex justify-center items-center gap-2 text-lg text-gray-300">
              <img src="/doctor-avatar.png" alt="Doctor" className="h-6 w-6 rounded-full" />
              <p className="font-semibold">{latestAppointment.preferredDoctor}</p>
            </div>

            <div className="flex justify-center items-center gap-2 mt-3 text-lg text-gray-300">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v10M12 7v10m4-10v10M6 7h12" />
              </svg>
              <p>{new Date(latestAppointment.appointmentDate).toLocaleString()}</p>
            </div>

            <p className="mt-3 text-gray-400">Reason: {latestAppointment.reasons}</p>
          </div>
        ) : (
          <p className="text-gray-400 mt-6">Loading appointment details...</p>
        )}

        {/* Back to Appointment Page Button */}
        <button
          onClick={() => router.push("/appointment")}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition shadow-md"
        >
          New Appointment
        </button>
      </div>
    </div>
  );
}
