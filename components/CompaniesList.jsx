"use client";
import React, { useState, useEffect } from "react";
import CompanyModal from "./CompanyModal";

export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://data.brreg.no/enhetsregisteret/api/enheter?size=100&navn=${encodeURIComponent(
            searchTerm
          )}`
        );
        if (!response.ok) throw new Error("Ingen Firmaer");
        const data = await response.json();
        setCompanies(data._embedded?.enheter || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      {loading && (
        <p className="text-white text-center text-lg mt-6">
          Laster inn selskaper...
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center text-lg mt-6">Error: {error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.organisasjonsnummer}
            className="p-5 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-transform"
            onClick={() => setSelectedCompany(company)}
          >
            <h3 className="text-lg font-semibold text-blue-400 hover:underline">
              {company.navn}
            </h3>
            <p className="text-gray-400 text-sm">
              Org. Number:{" "}
              <span className="text-blue-300">
                {company.organisasjonsnummer}
              </span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Founded: {company.stiftelsesdato || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}
