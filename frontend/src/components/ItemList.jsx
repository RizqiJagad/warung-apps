// src/components/ItemList.jsx

import React, { useState, useEffect } from 'react';

const ItemList = ({ onRefresh, onEdit }) => { // Tambahkan onEdit prop
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchItems();
  }, [onRefresh]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus barang ini?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/barang/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      alert('Barang berhasil dihapus!');
      fetchItems();
    } catch (error) {
      console.error('Gagal menghapus barang:', error);
      alert('Gagal menghapus barang.');
    }
  };

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
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-sm text-gray-800">{item.nama_barang}</td>
              <td className="py-2 px-4 text-sm text-gray-800">Rp {item.harga_beli}</td>
              <td className="py-2 px-4 text-sm text-gray-800">Rp {item.harga_jual}</td>
              <td className="py-2 px-4 text-sm text-gray-800">{item.jumlah_stok}</td>
              <td className="py-2 px-4 text-sm text-gray-800">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white p-1 rounded-md text-xs font-semibold hover:bg-red-600 mr-2"
                >
                  Hapus
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="bg-green-500 text-white p-1 rounded-md text-xs font-semibold hover:bg-green-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;