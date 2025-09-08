// backend/index.js

import 'dotenv/config';
import express from 'express';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

// Mengatur server Express
const app = express();
const PORT = process.env.PORT || 3000;

// Mengatur jalur file untuk __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware untuk memproses body permintaan dalam format JSON
app.use(express.json());

// Jalankan fungsi utama secara asinkron
const main = async () => {
    try {
        // Baca file kredensial
        const credsFile = await fs.readFile(path.join(__dirname, 'credentials.json'), 'utf8');
        const creds = JSON.parse(credsFile);

        // Buat instance JWT
        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        // Inisialisasi GoogleSpreadsheet dan autentikasi
        const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo(); // Memuat info dari spreadsheet

        console.log(`✅ Terhubung ke Google Sheets: ${doc.title}`);

        // Endpoint uji coba
        app.get('/', (req, res) => {
            res.send('🚀 Server back-end Warung App berjalan!');
        });

        // Menjalankan server
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Gagal terhubung ke Google Sheets:', error);
        process.exit(1); 
    }
};

main();