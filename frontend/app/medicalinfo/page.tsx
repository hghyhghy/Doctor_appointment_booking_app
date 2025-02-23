"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const MedicalInfoPage = () => {
  const router = useRouter();
  const physicianNames = [
    "Dr. John Smith",
    "Dr. Emily Johnson",
    "Dr. Michael Brown",
    "Dr. Sarah Davis",
    "Dr. David Wilson",
    "Dr. Jennifer Martinez",
    "Dr. James Taylor",
    "Dr. Linda Anderson",
    "Dr. Robert Thomas",
    "Dr. Mary Jackson",
  ];

  const [formData, setFormData] = useState({
    physicianName: physicianNames[0],
    insuranceProvider: "",
    insuranceNumber: "",
    allergies: "",
    currentMedicalSituation: "",
    familyMedicalHistory: "",
    pastMedicalHistory: "",
  });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3001/medical-info/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ text: "Medical information submitted successfully!", type: "success" });
        setTimeout(() => router.push("/identification"), 2000); // Redirect after 2 seconds
      } else {
        throw new Error("Failed to submit medical information");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ text: "Error submitting medical information. Please try again.", type: "error" });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Medical Information Form - Left Half */}
      <div className="w-1/2 h-full flex items-center justify-center bg-[#0f172a] p-8">
        <div className="w-full max-w-2xl p-6 shadow-md rounded-lg text-slate-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-300 flex items-start justify-start">
            Medical Information
          </h2>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-3 text-center mb-4 rounded ${
                message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-slate-100">
            {/* Physician Name Dropdown */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Physician Name</label>
              <select
                name="physicianName"
                value={formData.physicianName}
                onChange={handleChange}
                className="w-full p-2 border-2 border-blue-950 rounded-md focus:ring-2 text-slate-300 bg-[#0f172a]"
              >
                {physicianNames.map((physician) => (
                  <option key={physician} value={physician}>
                    {physician}
                  </option>
                ))}
              </select>
            </div>

            {/* Insurance Details */}
            <div className="flex flex-row gap-4 text-gray-300">
              <div className="w-1/2">
                <label className="block font-medium mb-2">Insurance Provider</label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  placeholder="Enter insurance provider"
                  required
                  className="w-full p-2 border-2 border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#0f172a] text-white"
                />
              </div>

              <div className="w-1/2">
                <label className="block font-medium mb-2">Insurance Number</label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleChange}
                  placeholder="Enter insurance number"
                  required
                  className="w-full p-2 border-2 border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#0f172a] text-white"
                />
              </div>
            </div>

            {/* Medical History Fields */}
            <div className="flex flex-row gap-4 text-gray-300">
              <div className="w-1/2">
                <label className="block font-medium mb-2">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="List any allergies"
                  required
                  className="w-full p-2 border-2 border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#0f172a] text-white"
                />
              </div>

              <div className="w-1/2">
                <label className="block font-medium mb-2">Current Medical Situation</label>
                <textarea
                  name="currentMedicalSituation"
                  value={formData.currentMedicalSituation}
                  onChange={handleChange}
                  placeholder="Describe your current condition"
                  required
                  className="w-full p-2 border-2 border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#0f172a] text-white"
                />
              </div>
            </div>

            <div className="flex flex-row gap-4 text-gray-300">
              <div className="w-1/2">
                <label className="block font-medium mb-2">Family Medical History</label>
                <textarea
                  name="familyMedicalHistory"
                  value={formData.familyMedicalHistory}
                  onChange={handleChange}
                  placeholder="Family medical history details"
                  required
                  className="w-full p-2 border-2 border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#0f172a] text-white"
                />
              </div>

              <div className="w-1/2">
                <label className="block font-medium mb-2">Past Medical History</label>
                <textarea
                  name="pastMedicalHistory"
                  value={formData.pastMedicalHistory}
                  onChange={handleChange}
                  placeholder="Your past medical history"
                  required
                  className="w-full p-2 border-2 border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#0f172a] text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Right Half - Image */}
      <div className="w-1/2 h-full">
        <img
          src="/doctor2.avif" // Replace with your image URL
          alt="Medical Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default MedicalInfoPage;
