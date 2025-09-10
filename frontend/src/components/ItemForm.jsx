// src/components/ItemForm.jsx

import React, { useState, useEffect } from 'react';

const ItemForm = ({ onAdd, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({
    nama_barang: '',
    harga_beli: '',
    harga_jual: '',
    jumlah_stok: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        nama_barang: '',
        harga_beli: '',
        harga_jual: '',
        jumlah_stok: '',
      });
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEditing = !!editingItem;
    const url = isEditing
      ? `http://localhost:3000/api/barang/${editingItem.id}`
      : 'http://localhost:3000/api/barang';

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await response.json();
      if (isEditing) {
        alert('Barang berhasil diperbarui!');
        setEditingItem(null);
      } else {
        alert('Barang berhasil ditambahkan!');
      }

      setFormData({
        nama_barang: '',
        harga_beli: '',
        harga_jual: '',
        jumlah_stok: '',
      });

      onAdd();
    } catch (error) {
      console.error('Error saat submit form:', error);
      alert('Gagal menyimpan barang: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
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
        {editingItem ? 'Simpan Perubahan' : 'Tambah Barang'}
      </button>
      {editingItem && (
        <button
          type="button"
          onClick={() => setEditingItem(null)}
          className="mt-2 w-full bg-gray-400 text-white p-2 rounded-md font-semibold hover:bg-gray-500"
        >
          Batal
        </button>
      )}
    </form>
  );
};

export default ItemForm;