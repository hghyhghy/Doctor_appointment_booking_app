"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CiUser } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Image from "next/image";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = type === "login" ? "auth/login" : "auth/register";
      const payload = type === "login" 
        ? { name: formData.name, password: formData.password }
        : formData;
  
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, payload);
  
      // ✅ Store token for both login and registration
      localStorage.setItem("token", res.data.access_token);
  
      toast.success(type === "login" ? "Login successful!" : "Registration successful!");
  
      // ✅ Redirect to dashboard after login and registration
      router.push("/welcome");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex w-full h-screen">
      {/* Form Section - Takes Half of the Screen */}
      
      <div className="w-1/2 h-full  bg-black flex items-center justify-center p-8">
      <div className=" flex flex-col gap-2 absolute top-24">
                <h2 className=" font-bold text-3xl text-white">Hi There 👋🏻</h2>
                <p className=" text-gray-300 text-sm">Get started with appointments</p>
      </div>


        <div className="max-w-md w-full text-black">
          <h2 className="text-3xl font-semibold text-center mb-6 text-white">
            {type === "login" ? "Login" : "Register"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {type === "register" && (
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-bold" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded"
                  required
                />
              </div>
            )}
            <div className="relative">
              <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-bold" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="relative">
              <RiLockPasswordFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-bold" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Processing..." : type === "login" ? "Login" : "Register"}
            </button>
          </form>
          <p className="text-center mt-4  text-white">
            {type === "login" ? (
              <>Don't have an account? <button className="text-blue-600 hover:underline" onClick={() => router.push("/register")}>Register here</button></>
            ) : (
              <>Already have an account? <button className="text-blue-600 hover:underline" onClick={() => router.push("/login")}>Login here</button></>
            )}
          </p>
        </div>
      </div>

      {/* Image Section - Takes Half of the Screen */}
      <div className=" h-full w-1/2 ">
        <Image 
          src="/doctor1.webp" 
          alt="Authentication"
          width={2000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
