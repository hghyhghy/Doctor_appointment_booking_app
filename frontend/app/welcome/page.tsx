"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaUser, FaHome, FaPhone } from "react-icons/fa";
import { ImOffice } from "react-icons/im";
import { TbEmergencyBed } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    emergencyContact: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3001/profile/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile created successfully!");
        router.push("/medicalinfo");
      } else {
        alert("Failed to create profile.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Image Section */}
      <div className="w-1/2 h-full">
        <Image
          width={1000}
          height={1000}
          src="/doctor1.webp"
          alt="Profile Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form Section */}
      <div className="w-1/2 h-full flex items-center justify-center bg-[#0f172a] p-2">
        <div className="w-full p-8 bg-[#0f172a] rounded-lg shadow-lg text-gray-100">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-start justify-start">Complete Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 pl-10 border-2 rounded text-black border-blue-950 bg-[#0f172a]"
                />
              </div>
            </div>

            {/* Address & Phone Number */}
            <div className="flex flex-row gap-3">
              
              <div className="relative w-1/2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <div className="relative">
                  <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-10 border-2 rounded text-black border-blue-950 bg-[#0f172a]"
                  />
                </div>
              </div>

              <div className="relative w-1/2">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 " />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-10 border-2 rounded text-black border-blue-950 bg-[#0f172a]"
                  />
                </div>
              </div>

            </div>

            {/* Date of Birth & Gender */}
            <div className="flex flex-row gap-2">
              
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border-2 rounded text-slate-300 border-blue-950 bg-[#0f172a]"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border-2 rounded text-slate-300 border-blue-950 bg-[#0f172a]"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            {/* Occupation & Emergency Contact */}
            <div className="flex flex-row gap-2">
              
              <div className="relative w-1/2">
                <label className="block text-sm font-medium mb-2">Occupation</label>
                <div className="relative">
                  <ImOffice className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    name="occupation"
                    placeholder="Enter your occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-10 border-2 rounded text-black border-blue-950 bg-[#0f172a]"
                  />
                </div>
              </div>

              <div className="relative w-1/2">
                <label className="block text-sm font-medium mb-2">Emergency Contact</label>
                <div className="relative">
                  <TbEmergencyBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="tel"
                    name="emergencyContact"
                    placeholder="Enter emergency contact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-10 border-2 rounded text-black border-blue-950 bg-[#0f172a]"
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Submit
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
