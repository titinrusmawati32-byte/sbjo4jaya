import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Server-side Gemini proxy for chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, language, schoolName, schoolInfo } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({ success: false, reason: 'GEMINI_API_KEY environment variable is not set' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Anda adalah asisten virtual resmi ${schoolName || 'Sekolah'} yang ramah, sopan, dan informatif.
Informasi sekolah:
- Nama: ${schoolInfo?.name || schoolName || 'Sekolah Dasar'}
- NPSN: ${schoolInfo?.npsn || ''}
- Alamat: ${schoolInfo?.address || ''}
- Kurikulum: Kurikulum Merdeka & Profil Pelajar Pancasila
- PPDB: Buka (Gratis / Bebas biaya pendaftaran)
- Telepon: ${schoolInfo?.phone || ''}

Jawablah pertanyaan pengunjung berikut dengan singkat, jelas, dan ramah (dalam bahasa ${
                  language === 'ID' ? 'Indonesia' : 'Inggris'
                }):
"${message}"`,
              },
            ],
          },
        ],
      });

      const reply = response.text;
      if (reply) {
        return res.json({ success: true, reply });
      } else {
        return res.json({ success: false, reason: 'Empty response from model' });
      }
    } catch (err: any) {
      console.warn('Server Gemini chat error:', err?.message || err);
      return res.json({ success: false, error: err?.message || 'Gemini request failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
