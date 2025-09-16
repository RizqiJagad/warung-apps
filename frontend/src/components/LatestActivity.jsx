// src/components/LatestActivity.jsx

import React, { useState, useEffect } from 'react';

const LatestActivity = ({ onRefresh }) => { // <-- Terima prop onRefresh
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/transaksi-list');
        const result = await response.json();
        if (response.ok) {
          setActivities(result.data.slice(0, 5));
        }
      } catch (e) {
        console.error('Failed to fetch latest activities:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [onRefresh]); // <-- Gunakan onRefresh sebagai dependency

  if (loading) {
    return <div className="text-gray-500">Memuat aktivitas...</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity, index) => (
            <li key={index} className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <span className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9a1 1 0 000 2h3a1 1 0 100-2H7z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {activity.tanggal}: {activity.nama_barang} ({activity.jumlah_terjual} terjual)
                </p>
                <p className="text-xs text-gray-500">Total: Rp {activity.total_harga}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Tidak ada aktivitas terbaru.</p>
      )}
    </div>
  );
};

export default LatestActivity;