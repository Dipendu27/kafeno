import 'dotenv/config';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const dataDir = path.resolve(__dirname, process.env.DATA_DIR || '.data');
const dbPath = path.join(dataDir, 'submissions.json');

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false }));

const emptyDb = () => ({
  reservations: [],
  takeawayOrders: [],
  contactMessages: [],
});

const exists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const readDb = async () => {
  if (!(await exists(dbPath))) {
    return emptyDb();
  }

  const raw = await fs.readFile(dbPath, 'utf8');
  if (!raw.trim()) {
    return emptyDb();
  }

  return { ...emptyDb(), ...JSON.parse(raw) };
};

const writeDb = async (db) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`);
};

let writeQueue = Promise.resolve();

const withDb = async (updater) => {
  writeQueue = writeQueue.then(async () => {
    const db = await readDb();
    const result = await updater(db);
    await writeDb(db);
    return result;
  });

  return writeQueue;
};

const cleanText = (value, max = 500) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const cleanLongText = (value, max = 2000) =>
  String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, max);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => value.replace(/\D/g, '').length >= 8;
const submissionId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

const badRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const requireFields = (payload, fields) => {
  for (const field of fields) {
    if (!payload[field]) {
      throw badRequest(`Missing required field: ${field}`);
    }
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kafeno-backend' });
});

app.post('/api/reservations', async (req, res, next) => {
  try {
    const payload = {
      name: cleanText(req.body.name, 120),
      phone: cleanText(req.body.phone, 40),
      email: cleanText(req.body.email, 160),
      date: cleanText(req.body.date, 40),
      time: cleanText(req.body.time, 40),
      guests: Number(req.body.guests || 0),
      occasion: cleanText(req.body.occasion, 120),
      notes: cleanLongText(req.body.notes),
    };

    requireFields(payload, ['name', 'phone', 'date', 'time']);
    if (!isPhone(payload.phone)) throw badRequest('Please provide a valid phone number.');
    if (payload.email && !isEmail(payload.email)) throw badRequest('Please provide a valid email address.');
    if (!Number.isInteger(payload.guests) || payload.guests < 1 || payload.guests > 30) {
      throw badRequest('Guests must be between 1 and 30.');
    }

    const record = {
      id: submissionId('RES'),
      type: 'reservation',
      ...payload,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    await withDb((db) => {
      db.reservations.unshift(record);
    });

    res.status(201).json({
      ok: true,
      id: record.id,
      message: 'Reservation request received. We will contact you shortly.',
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/takeaway', async (req, res, next) => {
  try {
    const payload = {
      name: cleanText(req.body.name, 120),
      phone: cleanText(req.body.phone, 40),
      email: cleanText(req.body.email, 160),
      pickupDate: cleanText(req.body.pickupDate, 40),
      pickupTime: cleanText(req.body.pickupTime, 40),
      items: cleanLongText(req.body.items),
      notes: cleanLongText(req.body.notes),
    };

    requireFields(payload, ['name', 'phone', 'pickupDate', 'pickupTime', 'items']);
    if (!isPhone(payload.phone)) throw badRequest('Please provide a valid phone number.');
    if (payload.email && !isEmail(payload.email)) throw badRequest('Please provide a valid email address.');

    const record = {
      id: submissionId('TAK'),
      type: 'takeaway',
      ...payload,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    await withDb((db) => {
      db.takeawayOrders.unshift(record);
    });

    res.status(201).json({
      ok: true,
      id: record.id,
      message: 'Takeaway order request received. We will confirm it shortly.',
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/contact', async (req, res, next) => {
  try {
    const payload = {
      name: cleanText(req.body.name, 120),
      email: cleanText(req.body.email, 160),
      phone: cleanText(req.body.phone, 40),
      message: cleanLongText(req.body.message),
    };

    requireFields(payload, ['name', 'email', 'message']);
    if (!isEmail(payload.email)) throw badRequest('Please provide a valid email address.');
    if (payload.phone && !isPhone(payload.phone)) throw badRequest('Please provide a valid phone number.');

    const record = {
      id: submissionId('MSG'),
      type: 'contact',
      ...payload,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    await withDb((db) => {
      db.contactMessages.unshift(record);
    });

    res.status(201).json({
      ok: true,
      id: record.id,
      message: 'Message received. We will get back to you shortly.',
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/submissions', async (req, res, next) => {
  try {
    const adminKey = process.env.ADMIN_API_KEY;
    if (!adminKey) {
      res.status(403).json({ ok: false, error: 'Set ADMIN_API_KEY to enable this endpoint.' });
      return;
    }

    if (req.get('x-admin-key') !== adminKey) {
      res.status(401).json({ ok: false, error: 'Unauthorized.' });
      return;
    }

    res.json({ ok: true, submissions: await readDb() });
  } catch (error) {
    next(error);
  }
});

const distDir = path.join(__dirname, 'dist');
const distIndex = path.join(distDir, 'index.html');
const useDist = process.env.NODE_ENV === 'production' && (await exists(distIndex));
const staticDir = useDist ? distDir : path.join(__dirname, 'public');
const indexPath = useDist ? distIndex : path.join(__dirname, 'index.html');

app.use(express.static(staticDir, { index: false }));

app.get('*', (_req, res) => {
  res.sendFile(indexPath);
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    ok: false,
    error: status >= 500 ? 'Something went wrong. Please try again.' : error.message,
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Kafeno app running at http://localhost:${port}`);
  console.log(`Submissions file: ${dbPath}`);
});
