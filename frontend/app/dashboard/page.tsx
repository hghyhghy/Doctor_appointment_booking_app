

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setUser("Authenticated User"); // Dummy user, you can fetch from backend
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p className="text-gray-700 mt-2">You are logged in as: {user}</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
