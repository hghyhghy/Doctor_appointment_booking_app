"use client";

import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const IdentificationForm = () => {
  const router = useRouter()
  const [identificationType, setIdentificationType] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [consent, setConsent] = useState({ treatment: false, disclosure: false });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    if (!identificationType || !identificationNumber || !file) {
      setError("All fields are required.");
      setSuccessMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("identificationType", identificationType);
    formData.append("identificationNumber", identificationNumber);
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/identification/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push("/appointment")
        setSuccessMessage("Identification details submitted successfully! ✅");
        setError("");
        setIdentificationType("");
        setIdentificationNumber("");
        setFile(null);
      } else {
        setError("Failed to submit. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 shadow-lg rounded-lg w-[70%]">
        <h2 className="text-2xl font-semibold text-center mb-6">Identification Form</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identification Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Identification Type</label>
            <select
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={identificationType}
              onChange={(e) => setIdentificationType(e.target.value)}
              required
            >
              <option value="">Select Identification Type</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
              <option value="National ID">National ID</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>

          {/* Identification Number */}
          <div>
            <label className="block text-sm font-medium mb-2">Identification Number</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={identificationNumber}
              onChange={(e) => setIdentificationNumber(e.target.value)}
              required
            />
          </div>

          {/* File Upload */}
          <div>
  <label className="block text-sm font-medium mb-2">Scanned Copy of Identification Document</label>
  <label className="border border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-700 cursor-pointer relative">
    <FaCloudUploadAlt className="text-4xl text-blue-400 mb-2" />
    <p className="text-blue-400">Click to upload or drag and drop</p>
    <p className="text-sm text-gray-400">Only PDF (max size: 5MB)</p>
    <input
      type="file"
      accept=".pdf"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      onChange={handleFileChange}
      required
    />
  </label>
  {file && <p className="text-green-400 text-sm mt-2">Selected: {file.name}</p>}
</div>

          {/* Consent and Privacy */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Consent and Privacy</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500"
                checked={consent.treatment}
                onChange={() => setConsent({ ...consent, treatment: !consent.treatment })}
              />
              <span>I consent to receive treatment for my health condition.</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500"
                checked={consent.disclosure}
                onChange={() => setConsent({ ...consent, disclosure: !consent.disclosure })}
              />
              <span>I consent to the use and disclosure of my health information for treatment purposes.</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default IdentificationForm;
