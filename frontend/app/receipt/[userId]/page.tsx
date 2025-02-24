"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ReceiptPage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [receiptData, setReceiptData] = useState<{
    userId: number;
    patientName: string;
    phoneNumber: string;
    doctorName: string;
    appointmentDate: string;
    reason: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/receipt/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setReceiptData(res.data);
        } else {
          setError("Failed to load receipt.");
        }
      } catch (err) {
        setError("Error fetching receipt. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchReceipt();
  }, [userId]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      {receiptData && (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl border border-gray-300">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">MEDICAL RECEIPT</h2>
            <p className="text-gray-600">Fauget Hospital</p>
          </div>

          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-2 border-b pb-4 text-gray-700 text-sm">
            <div>
              <h3 className="font-semibold">PATIENT INFORMATION</h3>
              <p>{receiptData.patientName}</p>
              <p>{receiptData.phoneNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">DOCTOR'S INFORMATION</h3>
              <p>{receiptData.doctorName}</p>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="border-b py-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Receipt No:</span>
              <span>{receiptData.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{new Date(receiptData.appointmentDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Service Info */}
          <div className="border-b py-4 text-sm text-gray-700">
            <h3 className="font-semibold">SERVICE DETAILS</h3>
            <div className="flex justify-between">
              <span>{receiptData.reason}</span>
              <span className="font-semibold">$100</span>
            </div>
          </div>

          {/* Total Section */}
          <div className="py-4 text-sm text-gray-700">
            <div className="flex justify-between font-semibold">
              <span>SUBTOTAL:</span>
              <span>$100</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>SHIPPING:</span>
              <span>$10</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL:</span>
              <span>$110</span>
            </div>
          </div>

          {/* Notes */}
          <div className="border-t pt-4 text-xs text-gray-600">
            <h3 className="font-semibold">NOTES</h3>
            <p>A prescription has been issued. Visit faugethospital.com for more details.</p>
          </div>

          {/* Print Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.print()}
              className="px-5 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
