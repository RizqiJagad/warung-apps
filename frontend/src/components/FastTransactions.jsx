// src/components/FastTransactions.jsx

import React, { useState } from 'react';
import ItemForm from './ItemForm';
import TransactionForm from './TransactionForm';

const FastTransactions = ({ onAdd, editingItem, setEditingItem }) => {
  const [tab, setTab] = useState('tambah'); // 'tambah' or 'transaksi'

  const handleDownloadPdf = () => {
    window.open(`http://localhost:3000/api/laba/pdf`, '_blank');
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center border-b border-gray-200 mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setTab('tambah')}
            className={`px-4 py-2 font-semibold transition-colors duration-200 ${tab === 'tambah' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
          >
            Tambah Barang
          </button>
          <button
            onClick={() => setTab('transaksi')}
            className={`px-4 py-2 font-semibold transition-colors duration-200 ${tab === 'transaksi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
          >
            Catat Transaksi
          </button>
        </div>
        {/* <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
        >
          Unduh Laporan PDF
        </button> */}
      </div>

      {tab === 'tambah' && (
        <ItemForm onAdd={onAdd} editingItem={editingItem} setEditingItem={setEditingItem} />
      )}
      {tab === 'transaksi' && (
        <TransactionForm onRefreshItems={onAdd} />
      )}
    </div>
  );
};

export default FastTransactions;