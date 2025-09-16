// src/components/ItemList.jsx

import React, { useState, useEffect } from 'react';

const ItemList = ({ onRefresh, onEdit }) => {
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
    <div className="bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Daftar Barang</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nama Barang</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Harga Beli</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Harga Jual</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stok</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">{item.nama_barang}</td>
                <td className="py-3 px-4 text-sm text-gray-800">Rp {item.harga_beli}</td>
                <td className="py-3 px-4 text-sm text-gray-800">Rp {item.harga_jual}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{item.jumlah_stok}</td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-blue-600 text-white p-2 rounded-md text-xs font-semibold hover:bg-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded-md text-xs font-semibold hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;