// src/App.jsx

import React, { useState } from 'react';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import './index.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingItem, setEditingItem] = useState(null); // <-- Tambahkan state ini

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleEdit = (item) => {
    setEditingItem(item); // <-- Atur item yang akan diedit
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
        <ItemList onRefresh={refreshKey} onEdit={handleEdit} />
      </main>
    </div>
  );
}

export default App;