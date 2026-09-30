import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH || './data/database.json';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Ensure directories exist
if (!fs.existsSync(path.dirname(DATABASE_PATH))) {
  fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOAD_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, ''));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Initialize Resend if API key exists
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== 're_your_resend_api_key_here' ? new Resend(resendApiKey) : null;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

interface ExpiryItem {
  id: string;
  title: string;
  category: string;
  expiryDate: string; // YYYY-MM-DD
  expiryTime: string; // HH:MM
  timezone: string; // e.g. UTC, America/New_York
  url?: string;
  imageUrl?: string;
  email?: string;
  emailVerified: boolean;
  verificationToken?: string;
  reminderSettings: number[]; // e.g. [30, 14, 7, 3, 1, 0]
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface SentReminder {
  itemId: string;
  reminderDaysBefore: number;
  sentAt: string;
}

interface DatabaseSchema {
  items: ExpiryItem[];
  sentReminders: SentReminder[];
}

function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DATABASE_PATH)) {
      const data = fs.readFileSync(DATABASE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database:', err);
  }
  return { items: [], sentReminders: [] };
}

function writeDb(db: DatabaseSchema) {
  try {
    const tempPath = DATABASE_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempPath, DATABASE_PATH);
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// Helper to calculate days left considering timezone and expiry time
function calculateDaysLeftDetail(expiryDate: string, expiryTime: string, timezone: string) {
  try {
    const [year, month, day] = expiryDate.split('-').map(Number);
    const [hour, minute] = (expiryTime || '00:00').split(':').map(Number);
    
    // Construct target date in UTC approximation or timezone offset if possible
    const targetDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const now = new Date();

    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 30;
  }
}

// API Routes

// Get all items
app.get('/api/items', (req, res) => {
  const db = readDb();
  res.json(db.items);
});

// Create item
app.post('/api/items', upload.single('image'), async (req, res) => {
  try {
    const body = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : body.imageUrl || undefined;
    
    let reminderSettings: number[] = [30, 7, 1, 0];
    if (body.reminderSettings) {
      try {
        reminderSettings = typeof body.reminderSettings === 'string' 
          ? JSON.parse(body.reminderSettings) 
          : body.reminderSettings;
      } catch {}
    }

    const email = body.email ? body.email.trim() : undefined;
    const emailVerified = body.emailVerified === 'true' || body.emailVerified === true;
    const verificationToken = email && !emailVerified ? Math.random().toString(36).substring(2) + Date.now().toString(36) : undefined;

    const newItem: ExpiryItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: body.title || 'Untitled Expiry',
      category: body.category || 'Documents',
      expiryDate: body.expiryDate || new Date().toISOString().split('T')[0],
      expiryTime: body.expiryTime || '23:59',
      timezone: body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      url: body.url ? body.url.trim() : undefined,
      imageUrl,
      email,
      emailVerified: emailVerified || !email,
      verificationToken,
      reminderSettings,
      notes: body.notes || body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = readDb();
    db.items.unshift(newItem);
    writeDb(db);

    // If new email provided and needs verification, send verification email
    if (email && !newItem.emailVerified && newItem.verificationToken && resend) {
      try {
        const verifyUrl = `${BASE_URL}/api/verify-email?token=${newItem.verificationToken}&id=${newItem.id}`;
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: `Verify your email for Expiry reminder — ${newItem.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F7F8F8; border-radius: 12px;">
              <h2 style="color: #111111;">Verify your email address</h2>
              <p style="color: #4B5563;">You added an email notification for <strong>${newItem.title}</strong> on Expiry.</p>
              <p style="color: #4B5563;">Please click the button below to verify your email and start receiving automated reminder alerts.</p>
              <div style="margin: 30px 0;">
                <a href="${verifyUrl}" style="background-color: #1688D4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
              </div>
              <p style="color: #9CA3AF; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send verification email:', emailErr);
      }
    }

    res.status(201).json(newItem);
  } catch (err: any) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update item
app.put('/api/items/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const db = readDb();
    const index = db.items.findIndex((i) => i.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expiry item not found' });
    }

    const existing = db.items[index];
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl);

    let reminderSettings = existing.reminderSettings;
    if (body.reminderSettings) {
      try {
        reminderSettings = typeof body.reminderSettings === 'string'
          ? JSON.parse(body.reminderSettings)
          : body.reminderSettings;
      } catch {}
    }

    const email = body.email !== undefined ? (body.email ? body.email.trim() : undefined) : existing.email;
    const emailChanged = email !== existing.email;
    const emailVerified = emailChanged ? false : existing.emailVerified;
    const verificationToken = emailChanged && email ? Math.random().toString(36).substring(2) + Date.now().toString(36) : existing.verificationToken;

    const updatedItem: ExpiryItem = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      expiryDate: body.expiryDate !== undefined ? body.expiryDate : existing.expiryDate,
      expiryTime: body.expiryTime !== undefined ? body.expiryTime : existing.expiryTime,
      timezone: body.timezone !== undefined ? body.timezone : existing.timezone,
      url: body.url !== undefined ? (body.url ? body.url.trim() : undefined) : existing.url,
      imageUrl,
      email,
      emailVerified,
      verificationToken,
      reminderSettings,
      notes: body.notes !== undefined ? body.notes : (body.description !== undefined ? body.description : existing.notes),
      updatedAt: new Date().toISOString(),
    };

    // If date, time, or reminder settings changed, clear sent reminders for this item so new reminders can fire properly
    if (
      existing.expiryDate !== updatedItem.expiryDate ||
      existing.expiryTime !== updatedItem.expiryTime ||
      JSON.stringify(existing.reminderSettings) !== JSON.stringify(updatedItem.reminderSettings)
    ) {
      db.sentReminders = db.sentReminders.filter((sr) => sr.itemId !== id);
    }

    db.items[index] = updatedItem;
    writeDb(db);

    // If email changed and needs verification
    if (emailChanged && email && !emailVerified && verificationToken && resend) {
      try {
        const verifyUrl = `${BASE_URL}/api/verify-email?token=${verificationToken}&id=${updatedItem.id}`;
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: `Verify your email for Expiry reminder — ${updatedItem.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F7F8F8; border-radius: 12px;">
              <h2 style="color: #111111;">Verify your email address</h2>
              <p style="color: #4B5563;">You updated the notification email for <strong>${updatedItem.title}</strong> on Expiry.</p>
              <p style="color: #4B5563;">Please click the button below to verify your email.</p>
              <div style="margin: 30px 0;">
                <a href="${verifyUrl}" style="background-color: #1688D4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
              </div>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send verification email:', err);
      }
    }

    res.json(updatedItem);
  } catch (err: any) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.items.length;
  
  db.items = db.items.filter((i) => i.id !== id);
  db.sentReminders = db.sentReminders.filter((sr) => sr.itemId !== id); // Cancel pending/sent reminders
  writeDb(db);

  if (db.items.length === initialLength) {
    return res.status(404).json({ error: 'Expiry item not found' });
  }

  res.json({ success: true, message: 'Expiry item deleted and pending reminders cancelled' });
});

// Email verification endpoint
app.get('/api/verify-email', (req, res) => {
  const { token, id } = req.query;
  const db = readDb();
  const item = db.items.find((i) => i.id === id && i.verificationToken === token);

  if (!item) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background: #F7F8F8;">
          <h2 style="color: #EF4444;">Verification Failed</h2>
          <p>Invalid or expired verification link.</p>
          <a href="/" style="color: #1688D4; text-decoration: underline;">Return to Expiry App</a>
        </body>
      </html>
    `);
  }

  item.emailVerified = true;
  item.verificationToken = undefined;
  writeDb(db);

  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background: #F7F8F8;">
        <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <h2 style="color: #10B981; margin-top: 0;">Email Verified Successfully!</h2>
          <p style="color: #4B5563;">Your email has been successfully verified for <strong>${item.title}</strong>.</p>
          <p style="color: #4B5563;">You will now receive automated email reminders prior to expiration.</p>
          <div style="margin-top: 30px;">
            <a href="/" style="background-color: #1688D4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Return to Expiry App</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Request verification resend
app.post('/api/request-verification/:id', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const item = db.items.find((i) => i.id === id);

  if (!item || !item.email) {
    return res.status(404).json({ error: 'Item or email not found' });
  }

  if (item.emailVerified) {
    return res.json({ message: 'Email is already verified' });
  }

  if (!item.verificationToken) {
    item.verificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    writeDb(db);
  }

  if (resend) {
    try {
      const verifyUrl = `${BASE_URL}/api/verify-email?token=${item.verificationToken}&id=${item.id}`;
      await resend.emails.send({
        from: EMAIL_FROM,
        to: item.email,
        subject: `Verify your email for Expiry reminder — ${item.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F7F8F8; border-radius: 12px;">
            <h2 style="color: #111111;">Verify your email address</h2>
            <p style="color: #4B5563;">Please click the button below to verify your email for <strong>${item.title}</strong>.</p>
            <div style="margin: 30px 0;">
              <a href="${verifyUrl}" style="background-color: #1688D4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
          </div>
        `,
      });
      return res.json({ success: true, message: 'Verification email sent' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to send email' });
    }
  }

  res.status(400).json({ error: 'Resend API key not configured on server' });
});

// Server-side scheduled cron job checking reminders every 60 seconds
setInterval(async () => {
  if (!resend) return; // Skip if Resend is not configured

  try {
    const db = readDb();
    const now = new Date();

    for (const item of db.items) {
      if (!item.email || !item.emailVerified) continue;

      const daysLeft = calculateDaysLeftDetail(item.expiryDate, item.expiryTime, item.timezone);

      for (const reminderDay of item.reminderSettings) {
        // Check if current daysLeft matches reminder setting
        if (daysLeft === reminderDay) {
          // Check if already sent
          const alreadySent = db.sentReminders.some(
            (sr) => sr.itemId === item.id && sr.reminderDaysBefore === reminderDay
          );

          if (!alreadySent) {
            // Send branded email via Resend
            const timeRemainingLabel = daysLeft < 0 
              ? `Expired ${Math.abs(daysLeft)} days ago`
              : daysLeft === 0 
              ? 'Expires today' 
              : `${daysLeft} days remaining`;

            const viewUrl = `${BASE_URL}`;

            try {
              await resend.emails.send({
                from: EMAIL_FROM,
                to: item.email,
                subject: `Reminder: "${item.title}" ${timeRemainingLabel}!`,
                html: `
                  <div style="font-family: 'Manrope', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #F7F8F8; border-radius: 16px; border: 1px solid #E5E7EB;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                      <div style="background: #1688D4; color: white; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">E</div>
                      <h2 style="color: #111111; margin: 0; font-size: 22px;">Expiry Reminder</h2>
                    </div>

                    <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 24px;">
                      <span style="background: #E0F2FE; color: #0369A1; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${item.category}</span>
                      <h3 style="color: #111111; font-size: 20px; margin: 12px 0 8px 0;">${item.title}</h3>
                      <p style="color: #6B7280; font-size: 14px; margin: 0 0 16px 0;">${item.notes || 'No description provided.'}</p>
                      
                      <div style="border-top: 1px solid #F3F4F6; padding-top: 16px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 14px; color: #374151;"><strong>Expiry Date & Time:</strong> ${item.expiryDate} at ${item.expiryTime || '23:59'} (${item.timezone})</div>
                        <div style="font-size: 15px; font-weight: bold; color: ${daysLeft <= 0 ? '#EF4444' : daysLeft <= 7 ? '#F59E0B' : '#1688D4'};"><strong>Status:</strong> ${timeRemainingLabel}</div>
                      </div>

                      ${item.url ? `
                        <div style="margin-top: 16px;">
                          <a href="${item.url}" target="_blank" style="color: #1688D4; text-decoration: underline; font-weight: bold; font-size: 14px;">Open Associated Link &rarr;</a>
                        </div>
                      ` : ''}
                    </div>

                    <div style="text-align: center; margin-top: 24px;">
                      <a href="${viewUrl}" style="background-color: #1688D4; color: white; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 15px;">Open Expiry Dashboard</a>
                    </div>
                  </div>
                `,
              });

              db.sentReminders.push({
                itemId: item.id,
                reminderDaysBefore: reminderDay,
                sentAt: new Date().toISOString(),
              });
              writeDb(db);
              console.log(`Successfully sent email reminder for item ${item.id} (${reminderDay} days before) to ${item.email}`);
            } catch (emailErr) {
              console.error(`Failed to send email reminder for item ${item.id}:`, emailErr);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in background reminder cron job:', err);
  }
}, 60 * 1000); // Run every 60 seconds

// Vite middleware integration in development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
