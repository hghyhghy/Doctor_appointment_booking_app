
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";


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
          // Get the latest booked appointment
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white ">
      <div className="w-1/2 bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <div className=" flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">
          <FaCheck />
          </h1>
        </div>
        <h2 className="text-4xl font-semibold mb-4">Your <span className=" text-gray-400">appointment request </span> <br />has been successfully submitted</h2>
        <p className="text-gray-300 mb-6">We'll be in touch shortly to confirm</p>

        {latestAppointment ? (
          <div className="bg-gray-800 p-4 rounded-md flex flex-row gap-5 items-center justify-center">
            <p className="text-sm font-semibold text-green-400"> Requested Appointment Deatils :</p>
            <p className="text-sm ">{latestAppointment.preferredDoctor}</p>

            <p className="text-sm font-semibold text-green-400"> Date:</p>
            <p className="text-sm ">{new Date(latestAppointment.appointmentDate).toLocaleString()}</p>

  
          </div>
        ) : (
          <p className="text-gray-400">Loading appointment details...</p>
        )}

        <button
          onClick={() => router.push("/appointment")}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition"
        >
          Back to Appointment Page
        </button>
      </div>
    </div>
  );
}
