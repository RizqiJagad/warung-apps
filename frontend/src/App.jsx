// src/App.jsx

import React, { useState } from 'react';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import TransactionForm from './components/TransactionForm'; // <-- Impor komponen form transaksi
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
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800">Warung App Dashboard</h1>
      </header>
      <main className="container mx-auto">
        <ItemForm
          onAdd={handleRefresh}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
        <TransactionForm onRefreshItems={handleRefresh} /> {/* <-- Tambahkan form transaksi */}
        <ItemList onRefresh={refreshKey} onEdit={handleEdit} />
      </main>
    </div>
  );
}

export default App;