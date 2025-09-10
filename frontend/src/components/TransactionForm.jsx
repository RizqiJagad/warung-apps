// src/components/TransactionForm.jsx

import React, { useState } from 'react';

const TransactionForm = ({ onRefreshItems }) => {
  const [formData, setFormData] = useState({
    nama_barang: '',
    jumlah_terjual: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      alert(`Transaksi berhasil dicatat! Laba: Rp ${result.laba}`);
      setFormData({
        nama_barang: '',
        jumlah_terjual: '',
      });
      onRefreshItems(); // Refresh daftar barang
    } catch (error) {
      console.error('Gagal mencatat transaksi:', error);
      alert('Gagal mencatat transaksi: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Catat Transaksi Baru</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="nama_barang"
          value={formData.nama_barang}
          onChange={handleChange}
          placeholder="Nama Barang"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="jumlah_terjual"
          value={formData.jumlah_terjual}
          onChange={handleChange}
          placeholder="Jumlah Terjual"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-md font-semibold hover:bg-indigo-700"
      >
        Catat Transaksi
      </button>
    </form>
  );
};

export default TransactionForm;