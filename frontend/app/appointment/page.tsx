"use client";

import { useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";

// Country code options
const countryCodes = [
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+55", country: "Brazil" },
  { code: "+971", country: "United Arab Emirates" },
];

export default function AppointmentForm() {

  const router = useRouter()
  const [formData, setFormData] = useState({
    preferredDoctor: "",
    expectedAppointmentDate: "",
    reasons: "",
    comments: "",
    phoneNumber: "",
  });

  const [countryCode, setCountryCode] = useState("+1"); // Default country code
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
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
    setMessage({ text: "", type: "" }); // Reset message before submitting

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ text: "User not authenticated.", type: "error" });
      return;
    }

    // Format date
    const formattedDate = moment(formData.expectedAppointmentDate).format("DD-MM-YYYY HH:mm");

    // Concatenate country code with phone number
    const fullPhoneNumber = `${countryCode} ${formData.phoneNumber}`;

    try {
      const res = await fetch("http://localhost:3001/appointment/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          appointmentDate: formattedDate,
          phoneNumber: fullPhoneNumber, // Send full number
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/success")
        setMessage({ text: "Appointment booked successfully!", type: "success" });
      } else {
        setMessage({ text: data.message || "Something went wrong!", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while booking the appointment.", type: "error" });
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

          {/* Phone Number Field with Country Code */}
          <div>
            <label className="block text-gray-300 mb-1">Phone Number</label>
            <div className="flex space-x-2">
              {/* Country Code Dropdown */}
              <select
                className="p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code} ({country.country})
                  </option>
                ))}
              </select>

              {/* Phone Number Input */}
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
          </div>

          {/* Appointment Reason and Comments */}
          <div className="flex flex-row gap-4">
            <div className="w-1/2">
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

            <div className="w-1/2">
              <label className="block text-gray-300 mb-1">Comments/Notes</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
          >
            Submit Appointment
          </button>
        </form>

        {/* Response Message */}
        {message.text && (
          <div
            className={`mt-4 text-center p-3 rounded-md ${
              message.type === "success" ? "bg-green-700 text-green-400" : "bg-red-700 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
