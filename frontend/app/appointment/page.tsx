"use client";

import { useState } from "react";
import moment from "moment";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    preferredDoctor: "",
    expectedAppointmentDate: "",
    reasons: "",
    comments: "",
    phoneNumber: "",
  });

  const doctors = [
    "Dr. John Doe",
    "Dr. Sarah Smith",
    "Dr. Michael Lee",
    "Dr. Emily Davis",
    "Dr. James Wilson",
    "Dr. Laura Johnson",
    "Dr. Robert Brown",
    "Dr. Sophia Martinez",
    "Dr. David Clark",
    "Dr. Olivia Taylor",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("User not authenticated.");
      return;
    }
  
    const formattedDate = moment(formData.expectedAppointmentDate).format("DD-MM-YYYY HH:mm"); // ✅ Format it
  
    try {
      const res = await fetch("http://localhost:3001/appointment/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          appointmentDate: formattedDate, // ✅ Use formatted date
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Appointment booked successfully!");
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">New Appointment</h2>
        <p className="text-gray-400 mb-6">Request a new appointment in 10 seconds.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doctor Selection */}
          <div>
            <label className="block text-gray-300 mb-1">Doctor</label>
            <select
              name="preferredDoctor"
              value={formData.preferredDoctor}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Picker */}
          <div>
            <label className="block text-gray-300 mb-1">Expected Appointment Date</label>
            <input
              type="date"
              name="expectedAppointmentDate"
              value={formData.expectedAppointmentDate}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Appointment Reason */}
          <div>
            <label className="block text-gray-300 mb-1">Appointment Reason</label>
            <textarea
              name="reasons"
              value={formData.reasons}
              onChange={handleChange}
              rows={2}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-gray-300 mb-1">Comments/Notes</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={2}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
          >
            Submit Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
