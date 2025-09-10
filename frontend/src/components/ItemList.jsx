// src/components/ItemList.jsx

import React, { useState, useEffect } from 'react';

const ItemList = () => { // Tidak perlu menerima onAdd prop di sini
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk mengambil data dari API
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/barang');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setItems(result.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []); // Array kosong berarti useEffect hanya berjalan sekali saat komponen dimuat

  if (loading) {
    return <div className="text-center mt-8">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Daftar Barang</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Nama Barang</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Harga Beli</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Harga Jual</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Stok</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-sm text-gray-800">{item.nama_barang}</td>
              <td className="py-2 px-4 text-sm text-gray-800">Rp {item.harga_beli}</td>
              <td className="py-2 px-4 text-sm text-gray-800">Rp {item.harga_jual}</td>
              <td className="py-2 px-4 text-sm text-gray-800">{item.jumlah_stok}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;