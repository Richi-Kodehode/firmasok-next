"use client";

import React, { useState, useEffect } from "react";
import FirmaKort from "./FirmaKort";

export default function SearchForm() {
  const [kommune, setKommune] = useState([]);
  const [valgtKommune, setValgtKommune] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [firma, setFirma] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [velgFirma, setValgtFirma] = useState(null);

  useEffect(() => {
    const fetchKommune = async () => {
      try {
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/kommuner"
        );
        if (!response.ok) throw new Error("Fant ikke data");

        const data = await response.json();

        if (
          data._embedded?.kommuner &&
          Array.isArray(data._embedded.kommuner)
        ) {
          setKommune(data._embedded.kommuner);
        } else {
          setKommune([]);
          console.error("Error:", data);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setKommune([]);
      }
    };

    fetchKommune();
  }, []);

  const fetchFirma = async () => {
    if (!valgtKommune || !year) return;

    setLoading(true);
    setError(null);

    const fromDate = `${year}-01-01`;
    const toDate = `${year}-12-31`;

    try {
      const response = await fetch(
        `https://data.brreg.no/enhetsregisteret/api/enheter?kommunenummer=${valgtKommune}&size=10000&fraStiftelsesdato=${fromDate}&tilStiftelsesdato=${toDate}`
      );

      if (!response.ok) throw new Error("Feilet");

      const data = await response.json();
      setFirma(data._embedded?.enheter || []);
    } catch (err) {
      console.error(" Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 mx-auto sm:p-6 max-w-6xl  bg-gray-800 text-white items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-6 text-center underline">
        Brønnøysund firmaregister
      </h1>

      <label className="block text-lg mb-2 text-center">Velg Kommune:</label>
      <select
        value={valgtKommune}
        onChange={(e) => setValgtKommune(e.target.value)}
        className="w-50 p-3 bg-gray-600 text-white text-center"
        disabled={kommune.length === 0}
      >
        <option value="">-- Velg her--</option>
        {kommune.map((kommune) => (
          <option key={kommune.nummer} value={kommune.nummer}>
            {kommune.navn} ({kommune.nummer})
          </option>
        ))}
      </select>

      <label className="block text-lg mt-4 mb-2">År:</label>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-30 p-3 border rounded bg-gray-600 text-white text-center border-gray-600 "
        min="1900"
        max={new Date().getFullYear()}
      />

      <button
        onClick={fetchFirma}
        className="w-50 mt-6 px-4 py-3 bg-gray-400 text-white font-bold rounded hover:bg-gray-200 transition"
        disabled={!valgtKommune}
      >
        Søk
      </button>

      {loading && <p className="mt-4 text-white">Loading...</p>}
      {error && <p className="mt-4 text-red-400">Error: {error}</p>}

      <div className="mt-8">
        {firma.length === 0 && !loading ? (
          <p className="text-gray-400 text-center">Ingen resultater enda</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {firma.map((company) => (
              <div
                key={company.organisasjonsnummer}
                onClick={() => setValgtFirma(company)}
                className="p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-102"
              >
                <h2 className="font-bold text-white">{company.navn}</h2>
                <p className="text-sm text-gray-400">
                  Stiftet: {company.stiftelsesdato || "N/A"}
                </p>
                <p className="text-sm text-gray-400">
                  Org. Nummer: {company.organisasjonsnummer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {velgFirma && (
        <FirmaKort company={velgFirma} onClose={() => setValgtFirma(null)} />
      )}
    </div>
  );
}
