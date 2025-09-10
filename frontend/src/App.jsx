// src/App.jsx

import React, { useState } from 'react';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm'; // <-- Impor komponen form
import './index.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0); // <-- Tambahkan state ini

  const handleItemAdded = () => {
    setRefreshKey(prevKey => prevKey + 1); // <-- Ubah state untuk memicu refresh
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800">Warung App Dashboard</h1>
      </header>
      <main className="container mx-auto">
        <ItemForm onAdd={handleItemAdded} /> {/* <-- Gunakan komponen form */}
        <ItemList key={refreshKey} /> {/* <-- Tambahkan key untuk memicu refresh */}
      </main>
    </div>
  );
}

export default App;