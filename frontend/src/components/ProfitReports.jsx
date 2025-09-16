// src/components/ProfitReports.jsx

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const chartData = {
    labels: Object.keys(report),
    datasets: [{
      label: `Laba ${periode}`,
      data: Object.values(report),
      backgroundColor: '#3B82F6',
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Laba (${periode})` },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
  };

  return (
    <div className="mb-8">
      {loading ? (
        <div className="mt-4">Memuat laporan...</div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 md:gap-2"> {/* Perbaikan */}
            <h4 className="text-lg font-bold">Total Laba ({periode})</h4>
            <div className="flex flex-wrap gap-2"> {/* Perbaikan */}
              <button
                onClick={() => setPeriode('harian')}
                className={`px-3 py-1 text-sm rounded-md font-semibold transition-colors duration-200 ${periode === 'harian' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Harian
              </button>
              <button
                onClick={() => setPeriode('mingguan')}
                className={`px-3 py-1 text-sm rounded-md font-semibold transition-colors duration-200 ${periode === 'mingguan' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setPeriode('bulanan')}
                className={`px-3 py-1 text-sm rounded-md font-semibold transition-colors duration-200 ${periode === 'bulanan' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Bulanan
              </button>
            </div>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
            >
              Unduh Laporan PDF
            </button>
          </div>
          <Bar options={chartOptions} data={chartData} />
        </div>
      )}
    </div>
  );
};

export default ProfitReports;