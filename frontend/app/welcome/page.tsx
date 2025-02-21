"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { TbEmergencyBed } from "react-icons/tb";

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
      <div className="w-1/2 h-full ">
        <Image
        width={1000}
        height={1000}
          src="/doctor1.webp" // Replace with a relevant image URL
          alt="Profile Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form Section */}
      <div className="w-1/2 h-full flex items-center justify-center bg-black p-2">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg text-black ">
          <h2 className="text-2xl font-semibold text-center mb-6">Complete Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className=" w-1/2">
              <label className="block text-sm font-medium">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border-2 rounded text-black pl-10  border-blue-950" />
              <div className=" absolute top-60 text-black font-bold ml-2">
              <FaUser />

              </div>
            </div>

            {/* 1 */}
            <div className=" flex flex-row gap-3">

            <div className=" w-1/2">
              <label className="block text-sm font-medium">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full p-2  rounded text-black pl-10
              border-2 border-blue-950"/>
              <div className=" absolute top-80 ml-2 font-bold text-black ">

              <FaHome />
              </div>
            </div>

            <div className=" w-1/2">
              <label className="block text-sm font-medium">Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full p-2  rounded text-black pl-10 border-2 border-blue-950" />
              <div className=" absolute top-80 ml-2 font-bold text-black ">
              <FaPhone />

              </div>
            </div>


            </div>

            {/* 2 */}
            <div className=" flex  flex-row gap-2">

            <div className=" w-1/2">
              <label className="block text-sm font-medium">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full p-2  rounded text-black pl-10 border-2 border-blue-950" />
            </div>

            
            <div className=" w-1/2">
              <label className="block text-sm font-medium">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-2  rounded text-black border-2 border-blue-950">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            </div>

            {/* 3 */}
            <div className=" flex flex-row gap-2">
            <div className=" w-1/2">
              <label className="block text-sm font-medium">Occupation</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full p-2  rounded text-black pl-10 border-2 border-blue-950" />

              <div className=" absolute top-[29.5rem] ml-2 font-bold text-black ">
              <ImOffice />
              </div>
            </div>

            <div className=" w-1/2">
              <label className="block text-sm font-medium">Emergency Contact</label>
              <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required className="w-full p-2  rounded text-black pl-10 border-2 border-blue-950" />
              <div className=" absolute top-[29.5rem] ml-2 font-bold text-black ">
              <TbEmergencyBed />
              </div>
            </div>

            </div>









            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
