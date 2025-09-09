// backend/index.js
import 'dotenv/config';
import express from 'express';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// --- INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const main = async () => {
  try {
    // ✅ Ambil credential dari environment variable
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    console.log(`✅ Terhubung ke Google Sheets: ${doc.title}`);

    // Dapatkan sheet "stok_barang"
    const stokSheet = doc.sheetsByTitle['stok_barang'];

    // --- API ENDPOINT UNTUK MENAMBAH BARANG BARU ---
    app.post('/api/barang', async (req, res) => {
      try {
        const { nama_barang, harga_beli, harga_jual, jumlah_stok } = req.body;

        if (!nama_barang || !harga_beli || !harga_jual || !jumlah_stok) {
          return res.status(400).json({ success: false, message: "Semua field harus diisi." });
        }

        await stokSheet.addRow({
          nama_barang,
          harga_beli: parseFloat(harga_beli),
          harga_jual: parseFloat(harga_jual),
          jumlah_stok: parseInt(jumlah_stok, 10),
        });

        res.status(201).json({ success: true, message: "Barang berhasil ditambahkan!" });
      } catch (error) {
        console.error('Error saat menambah barang:', error);
        res.status(500).json({ success: false, message: 'Gagal menambah barang.', error: error.message });
      }
    });

    // --- API ENDPOINT UNTUK MELIHAT SEMUA BARANG ---
    app.get('/api/barang', async (req, res) => {
      try {
        const rows = await stokSheet.getRows();
        const items = rows.map(row => ({
          id: row.rowNumber,
          nama_barang: row.get('nama_barang'),
          harga_beli: row.get('harga_beli'),
          harga_jual: row.get('harga_jual'),
          jumlah_stok: row.get('jumlah_stok'),
        }));

        res.status(200).json({ success: true, data: items });
      } catch (error) {
        console.error('Error saat melihat barang:', error);
        res.status(500).json({ success: false, message: 'Gagal mendapatkan data barang.', error: error.message });
      }
    });

    // --- API ENDPOINT UNTUK MENGHAPUS BARANG ---
    app.delete('/api/barang/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const rows = await stokSheet.getRows();
        const rowToDelete = rows.find(row => row.rowNumber === parseInt(id, 10));

        if (!rowToDelete) {
          return res.status(404).json({ success: false, message: "Barang tidak ditemukan." });
        }

        await rowToDelete.delete();
        res.status(200).json({ success: true, message: "Barang berhasil dihapus." });
      } catch (error) {
        console.error('Error saat menghapus barang:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus barang.', error: error.message });
      }
    });

    // --- API ENDPOINT UNTUK MENGEDIT BARANG ---
    app.put('/api/barang/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const { nama_barang, harga_beli, harga_jual, jumlah_stok } = req.body;
        const rows = await stokSheet.getRows();
        const rowToEdit = rows.find(row => row.rowNumber === parseInt(id, 10));

        if (!rowToEdit) {
          return res.status(404).json({ success: false, message: "Barang tidak ditemukan." });
        }

        if (nama_barang) rowToEdit.set('nama_barang', nama_barang);
        if (harga_beli) rowToEdit.set('harga_beli', parseFloat(harga_beli));
        if (harga_jual) rowToEdit.set('harga_jual', parseFloat(harga_jual));
        if (jumlah_stok) rowToEdit.set('jumlah_stok', parseInt(jumlah_stok, 10));

        await rowToEdit.save();
        res.status(200).json({ success: true, message: "Barang berhasil diperbarui." });
      } catch (error) {
        console.error('Error saat mengedit barang:', error);
        res.status(500).json({ success: false, message: 'Gagal mengedit barang.', error: error.message });
      }
    });

    // --- HALAMAN UTAMA SERVER ---
    app.get('/', (req, res) => {
      res.send('🚀 Server back-end Warung App berjalan!');
    });

    // --- SERVER LISTENING ---
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal terhubung ke Google Sheets:', error);
    process.exit(1);
  }
};

main();
