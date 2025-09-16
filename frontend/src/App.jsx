// src/App.jsx

import React, { useState } from 'react';
import ItemList from './components/ItemList';
import ProfitReports from './components/ProfitReports';
import FastTransactions from './components/FastTransactions';
import LatestActivity from './components/LatestActivity';
import './index.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingItem, setEditingItem] = useState(null);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Analitik Usaha</h1>
      </header>
      <main className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Laba</h3>
              <ProfitReports />
              <FastTransactions onAdd={handleRefresh} editingItem={editingItem} setEditingItem={setEditingItem} /> {/* <-- Menambahkan kembali FastTransactions */}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <LatestActivity onRefresh={refreshKey} /> {/* <-- Terbaru */}
          </div>
        </div>
        <ItemList onRefresh={refreshKey} onEdit={handleEdit} />
      </main>
    </div>
  );
}

export default App;