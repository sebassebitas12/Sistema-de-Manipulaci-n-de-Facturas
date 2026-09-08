import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.API_PORT || 3001);
const DB_PATH = path.join(__dirname, 'db.json');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});
app.use(express.json());

async function readDatabase() {
  const fileContent = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(fileContent);
}

// Devuelve únicamente la factura cuyo ID se recibe en la URL.
// No expone un endpoint GET general que devuelva todas las facturas.
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoiceId = req.params.id;

    if (!invoiceId) {
      return res.status(400).json({
        message: 'El ID de la factura es obligatorio.',
      });
    }

    const database = await readDatabase();
    const invoice = database.invoices.find((item) => item.id === invoiceId);

    if (!invoice) {
      return res.status(404).json({
        message: `No se encontró la factura con ID ${invoiceId}.`,
      });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error('Error al consultar la factura:', error);

    return res.status(500).json({
      message: 'No se pudo leer la base de datos de facturas.',
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada.',
  });
});

app.listen(PORT, () => {
  console.log(`API de facturas ejecutándose en http://localhost:${PORT}`);
  console.log(`Consulta individual: GET http://localhost:${PORT}/api/invoices/:id`);
});

export default app;
