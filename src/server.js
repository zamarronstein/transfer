import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { networkInterfaces } from 'os';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './received_files';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
const app = express();
app.use(express.json());

export function startServer(port, name) {
  app.post('/message', (req, res) => {
    const { from, message } = req.body;
    console.log(`\n[MSG] ${from || 'Anónimo'}: ${message}`);
    res.status(200).send('Recibido');
  });

  app.post('/file', upload.single('file'), (req, res) => {
    const { from } = req.body;
    console.log(`\n[FILE] ${from || 'Anónimo'} envió: ${req.file.originalname} (Guardado en ./received_files)`);
    res.status(200).send('Archivo recibido');
  });

  app.listen(port, () => {
    const nets = networkInterfaces();
    console.log(`🚀 Servidor "${name}" iniciado en puerto ${port}`);
    console.log('Posibles IPs locales:');
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`  - ${net.address}`);
        }
      }
    }
  });
}
