const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

const app = express();
app.use(cors());
app.use(express.json());

// Setup directories (Handle Vercel's read-only FS)
const isVercel = process.env.VERCEL === '1';
const UPLOAD_DIR = isVercel ? '/tmp/uploads' : path.join(process.cwd(), 'uploads');
const PROCESSED_DIR = isVercel ? '/tmp/processed' : path.join(process.cwd(), 'processed');
const DRIVE_DIR = isVercel ? '/tmp/drive_uploads' : path.join(process.cwd(), 'drive_uploads');
const ASSETS_DIR = path.join(process.cwd(), 'frontend', 'public', 'assets');

try {
    [UPLOAD_DIR, PROCESSED_DIR, DRIVE_DIR, ASSETS_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
} catch (e) {
    console.log('Skipping directory creation (likely on Vercel read-only FS)');
}

// Configure Multer for asset storage
const assetStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ASSETS_DIR);
    },
    filename: (req, file, cb) => {
        // We use fixed names for easier referencing in the app
        const type = req.body.type || 'logo';
        const ext = path.extname(file.originalname);
        cb(null, `${type}${ext}`);
    }
});
const uploadAssets = multer({ storage: assetStorage });

// Upload Branding Assets (Logo/Footer)
app.post('/api/upload-assets', uploadAssets.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    res.json({
        success: true,
        path: `/assets/${req.file.filename}`,
        filename: req.file.filename
    });
});

// Mock Drive Upload
app.post('/api/upload-pdf', multer().single('file'), (req, res) => {
    const { filename } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file provided' });

    const savePath = path.join(DRIVE_DIR, filename);
    fs.writeFileSync(savePath, file.buffer);

    res.json({
        id: "mock_drive_id_" + filename,
        drive: {
            webViewLink: `https://drive.google.com/mock/${filename}`
        },
        verificationUrl: `${req.protocol}://${req.get('host')}/verify/mock_${filename}`
    });
});

// Proxy for downloading PDFs from URLs (CORS bypass)
app.get('/api/proxy-pdf', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL is required');

    try {
        let finalUrl = url;
        if (url.includes("drive.google.com/file/d/") && url.includes("/view")) {
            const fileId = url.split("/d/")[1].split("/")[0];
            finalUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }

        const response = await axios({
            method: 'get',
            url: finalUrl,
            responseType: 'arraybuffer'
        });

        res.set('Content-Type', 'application/pdf');
        res.send(response.data);
    } catch (error) {
        console.error('Proxy failed:', error.message);
        res.status(500).send('Failed to fetch PDF');
    }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 8001;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
