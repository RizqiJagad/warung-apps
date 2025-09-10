// src/components/ProfitReports.jsx

import React, { useState, useEffect } from 'react';

const ProfitReports = () => {
  const [report, setReport] = useState({});
  const [periode, setPeriode] = useState('harian');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/laba/${periode}`);
        const result = await response.json();
        if (response.ok) {
          setReport(result.data);
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Gagal mengambil laporan laba.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [periode]);

  const handleDownloadPdf = () => {
    window.open(`http://localhost:3000/api/laba/pdf`, '_blank');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Laporan Laba</h3>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPeriode('harian')}
          className={`px-4 py-2 rounded-md font-semibold ${periode === 'harian' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Harian
        </button>
        <button
          onClick={() => setPeriode('mingguan')}
          className={`px-4 py-2 rounded-md font-semibold ${periode === 'mingguan' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Mingguan
        </button>
        <button
          onClick={() => setPeriode('bulanan')}
          className={`px-4 py-2 rounded-md font-semibold ${periode === 'bulanan' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Bulanan
        </button>
      </div>
      <button
        onClick={handleDownloadPdf}
        className="px-4 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700"
      >
        Unduh Laporan PDF
      </button>

      {loading ? (
        <div className="mt-4">Memuat laporan...</div>
      ) : (
        <div className="mt-4">
          <h4 className="text-lg font-bold">Total Laba ({periode})</h4>
          <ul>
            {Object.entries(report).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> Rp {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfitReports;