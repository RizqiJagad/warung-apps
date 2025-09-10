// src/components/ItemForm.jsx

import React, { useState } from 'react';

const ItemForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    nama_barang: '',
    harga_beli: '',
    harga_jual: '',
    jumlah_stok: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/barang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      alert('Barang berhasil ditambahkan!');
      setFormData({
        nama_barang: '',
        harga_beli: '',
        harga_jual: '',
        jumlah_stok: '',
      });
      onAdd(); // Memanggil fungsi dari parent untuk refresh data
    } catch (error) {
      console.error('Gagal menambah barang:', error);
      alert('Gagal menambah barang.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Tambah Barang Baru</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          name="harga_beli"
          value={formData.harga_beli}
          onChange={handleChange}
          placeholder="Harga Beli"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="harga_jual"
          value={formData.harga_jual}
          onChange={handleChange}
          placeholder="Harga Jual"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="jumlah_stok"
          value={formData.jumlah_stok}
          onChange={handleChange}
          placeholder="Jumlah Stok"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700"
      >
        Tambah Barang
      </button>
    </form>
  );
};

export default ItemForm;