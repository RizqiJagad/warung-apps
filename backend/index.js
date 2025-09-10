// backend/index.js

import 'dotenv/config';
import express from 'express';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import PDFDocument from 'pdfkit'; // <-- PERBAIKAN: Impor dari 'pdfkit'
import 'pdfkit-table'; // <-- PERBAIKAN: Impor ekstensi secara terpisah
import cors from 'cors';

// --- INITIALIZATION ---
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

const main = async () => {
    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        console.log(`✅ Terhubung ke Google Sheets: ${doc.title}`);

        const stokSheet = doc.sheetsByTitle['stok_barang'];
        const transaksiSheet = doc.sheetsByTitle['rekap_transaksi'];

        // --- Tambah Barang ---
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

        // --- Lihat Semua Barang ---
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

        // --- Edit Barang ---
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

        // --- Hapus Barang ---
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

        // --- Catat Transaksi ---
        app.post('/api/transaksi', async (req, res) => {
            try {
                const { nama_barang, jumlah_terjual } = req.body;
                const today = new Date().toLocaleDateString('id-ID');

                const rows = await stokSheet.getRows();
                const item = rows.find(row => row.get('nama_barang').toLowerCase() === nama_barang.toLowerCase());

                if (!item) {
                    return res.status(404).json({ success: false, message: "Barang tidak ditemukan." });
                }

                const currentStock = parseInt(item.get('jumlah_stok'), 10);
                const soldAmount = parseInt(jumlah_terjual, 10);

                if (currentStock < soldAmount) {
                    return res.status(400).json({ success: false, message: "Stok tidak mencukupi." });
                }

                const hargaBeli = parseFloat(item.get('harga_beli'));
                const hargaJual = parseFloat(item.get('harga_jual'));
                const totalHarga = hargaJual * soldAmount;
                const laba = (hargaJual - hargaBeli) * soldAmount;

                item.set('jumlah_stok', currentStock - soldAmount);
                await item.save();

                await transaksiSheet.addRow({
                    tanggal: today,
                    nama_barang: item.get('nama_barang'),
                    jumlah_terjual: soldAmount,
                    total_harga: totalHarga,
                    laba: laba
                });

                res.status(200).json({ success: true, message: "Transaksi berhasil dicatat!", laba: laba });
            } catch (error) {
                console.error('Error saat mencatat transaksi:', error);
                res.status(500).json({ success: false, message: 'Gagal mencatat transaksi.', error: error.message });
            }
        });

           // --- Laporan PDF (Rute spesifik) ---
        app.get('/api/laba/pdf', async (req, res) => {
            try {
                const rows = await transaksiSheet.getRows();
                const doc = new PDFDocument({ margin: 30, size: 'A4' });

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="laporan_laba.pdf"');

                doc.pipe(res);
                doc.fontSize(20).text('Laporan Laba Warung App', { align: 'center' });
                doc.moveDown(2);

                // Buat header tabel
                const tableHeaders = ['Tanggal', 'Nama Barang', 'Jumlah Terjual', 'Total Harga', 'Laba'];
                const startY = doc.y;
                let startX = doc.x;
                const cellPadding = 5;
                const columnWidth = 100;

                doc.font('Helvetica-Bold').fontSize(10);
                tableHeaders.forEach((header, i) => {
                    doc.text(header, startX + (i * columnWidth), startY, {
                        width: columnWidth,
                        align: 'left',
                        lineBreak: false
                    });
                });
                doc.moveDown();

                // Buat baris data
                doc.font('Helvetica').fontSize(10);
                let currentY = doc.y;

                rows.forEach(row => {
                    const rowData = [
                        row.get('tanggal') || '',
                        row.get('nama_barang') || '',
                        row.get('jumlah_terjual') || '0',
                        row.get('total_harga') || '0',
                        row.get('laba') || '0',
                    ];

                    doc.text(rowData[0], startX, currentY);
                    doc.text(rowData[1], startX + columnWidth, currentY);
                    doc.text(rowData[2], startX + (2 * columnWidth), currentY);
                    doc.text(rowData[3], startX + (3 * columnWidth), currentY);
                    doc.text(rowData[4], startX + (4 * columnWidth), currentY);

                    currentY += 20; // Pindah ke baris berikutnya
                });

                doc.end();

            } catch (error) {
                console.error('Error saat membuat PDF:', error);
                res.status(500).json({ success: false, message: 'Gagal membuat laporan PDF.', error: error.message });
            }
        });

        // --- Laporan Laba Harian, Mingguan, Bulanan (Rute umum) ---
        app.get('/api/laba/:periode', async (req, res) => {
            try {
                const { periode } = req.params;
                const rows = await transaksiSheet.getRows();

                if (!['harian', 'mingguan', 'bulanan'].includes(periode)) {
                    return res.status(400).json({ success: false, message: "Periode tidak valid. Gunakan 'harian', 'mingguan', atau 'bulanan'." });
                }

                const data = {};
                rows.forEach(row => {
                    const tanggalStr = row.get('tanggal');
                    const laba = parseFloat(row.get('laba'));
                    if (!tanggalStr || isNaN(laba)) return;

                    const tanggal = new Date(tanggalStr);
                    let key = '';

                    if (periode === 'harian') {
                        key = tanggal.toISOString().split('T')[0];
                    } else if (periode === 'mingguan') {
                        const d = new Date(tanggal);
                        d.setHours(0, 0, 0, 0);
                        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
                        const week1 = new Date(d.getFullYear(), 0, 4);
                        const week = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
                        key = `${d.getFullYear()}-W${week}`;
                    } else if (periode === 'bulanan') {
                        key = `${tanggal.getFullYear()}-${tanggal.getMonth() + 1}`;
                    }

                    if (!data[key]) data[key] = 0;
                    data[key] += laba;
                });

                res.status(200).json({ success: true, periode: periode, data: data });

            } catch (error) {
                console.error('Error saat membuat laporan laba:', error);
                res.status(500).json({ success: false, message: 'Gagal mendapatkan laporan laba.', error: error.message });
            }
        });

        // --- Halaman Utama ---
        app.get('/', (req, res) => {
            res.send('🚀 Server back-end Warung App berjalan!');
        });

        // --- Mulai Server ---
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal terhubung ke Google Sheets:', error);
        process.exit(1);
    }
};

main();