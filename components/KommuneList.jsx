"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const KommuneList = () => {
  const [kommuner, setKommuner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKommuneData = async () => {
      try {
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/kommuner"
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setKommuner(data._embedded?.kommuner || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKommuneData();
  }, []);

  if (loading)
    return <p className="text-white text-center text-lg">Laster Kommuner</p>;
  if (error)
    return <p className="text-red-500 text-center text-lg">Error: {error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Norwegian Municipalities
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kommuner.map((kommune) => (
          <div
            key={kommune.nummer}
            onClick={() => router.push(`/kommune/${kommune.nummer}`)}
            className="p-4 rounded-lg bg-gray-800 cursor-pointer transition-transform transform hover:scale-105"
          >
            <h2 className="text-lg font-bold text-white">{kommune.navn}</h2>
            <p className="text-sm text-gray-400">
              Kommune Nummer: {kommune.nummer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
