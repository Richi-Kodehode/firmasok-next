"use client";

import React from "react";

export default function FirmaKort({ company, onClose }) {
  if (!company) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600">
      <div className="sm:w-3/4 md:w-1/2 max-w-lg w-full  bg-gray-400 p-4">
        <h2 className="text-xl font-bold">{company.navn}</h2>
        <p>Org: {company.organisasjonsnummer}</p>
        <p>Stiftet: {company.stiftelsesdato || "N/A"}</p>
        <p>Næring: {company.naeringskode1?.beskrivelse || "N/A"}</p>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-600 text-white px-4 py-2 hover:bg-gray-300"
        >
          Tilbake
        </button>
      </div>
    </div>
  );
}
