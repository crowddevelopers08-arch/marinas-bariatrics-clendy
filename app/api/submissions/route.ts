import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { insertSubmission } from '@/lib/db';

const DATA_DIR   = path.join(process.cwd(), 'data');
const FILE_PATH  = path.join(DATA_DIR, 'submissions.csv');
const SLOTS_FILE = path.join(DATA_DIR, 'booked-slots.json');

const HEADERS = [
  'Timestamp', 'Source',
  'First Name', 'Last Name', 'Email', 'Phone', 'Location',
  'Appointment Date', 'Appointment Time',
  'Symptom Type', 'Surgery Advised',
  'Previous Consult',
  'Page URL', 'TeleCRM',
];

export const runtime = 'nodejs';

type SubmissionBody = {
  source: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  dateKey: string;        // "YYYY-MM-DD" — used to key booked-slots.json
  appointmentDate: string;
  appointmentTime: string;
  symptomType: string;
  hadSurgery: string;
  prevConsult: string;
  pageUrl: string;
};

type TelecrmResponse = Record<string, unknown> & {
  synced?: boolean;
  statusCode?: number;
  leadId?: unknown;
  note?: string;
};

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSubmission(body: Record<string, unknown>): SubmissionBody {
  return {
    source:          toText(body.source) || 'Bariatric-cdy-Booking',
    firstName:       toText(body.firstName),
    lastName:        toText(body.lastName),
    email:           toText(body.email),
    phone:           toText(body.phone),
    location:        toText(body.location),
    dateKey:         toText(body.dateKey),
    appointmentDate: toText(body.appointmentDate),
    appointmentTime: toText(body.appointmentTime),
    symptomType:     toText(body.symptomType),
    hadSurgery:      toText(body.hadSurgery),
    prevConsult:     toText(body.prevConsult),
    pageUrl:         toText(body.pageUrl),
  };
}

function recordBookedSlot(dateKey: string, time: string) {
  if (!dateKey || !time) return;
  let data: Record<string, string[]> = {};
  if (fs.existsSync(SLOTS_FILE)) {
    try { data = JSON.parse(fs.readFileSync(SLOTS_FILE, 'utf8')); } catch {}
  }
  if (!data[dateKey]) data[dateKey] = [];
  if (!data[dateKey].includes(time)) data[dateKey].push(time);
  fs.writeFileSync(SLOTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function csvEscape(value: string): string {
  const safeValue = value.replace(/\r?\n/g, ' ');
  if (/[",\n]/.test(safeValue)) return `"${safeValue.replace(/"/g, '""')}"`;
  return safeValue;
}

function rowToCsv(row: string[]) {
  return row.map(csvEscape).join(',');
}

function ensureCsvFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, `${rowToCsv(HEADERS)}\n`, 'utf8');
  }
}

function appendLocalRow(row: string[]) {
  ensureCsvFile();
  fs.appendFileSync(FILE_PATH, `${rowToCsv(row)}\n`, 'utf8');
}

function buildRow(body: SubmissionBody, timestamp: string, telecrmStatus: string): string[] {
  return [
    timestamp,
    body.source,
    body.firstName,
    body.lastName,
    body.email,
    body.phone,
    body.location,
    body.appointmentDate,
    body.appointmentTime,
    body.symptomType,
    body.hadSurgery,
    body.prevConsult,
    body.pageUrl,
    telecrmStatus,
  ];
}

async function pushToGAS(body: SubmissionBody, timestamp: string, telecrmStatus: string) {
  const url = process.env.NEXT_PUBLIC_GAS_URL;
  if (!url) return null;

  const row = buildRow(body, timestamp, telecrmStatus);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      timestamp,
      headers: HEADERS,
      row,
      source:          body.source,
      firstName:       body.firstName,
      lastName:        body.lastName,
      email:           body.email,
      phone:           body.phone,
      location:        body.location,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      symptomType:     body.symptomType,
      hadSurgery:      body.hadSurgery,
      prevConsult:     body.prevConsult,
      pageUrl:         body.pageUrl,
      telecrm:         telecrmStatus,
    }),
  });

  if (!res.ok) throw new Error(`Google Apps Script failed with ${res.status}`);
  return res.text();
}

function normalizePhoneForTeleCRM(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function isTelecrmConfirmed(data: unknown) {
  if (!data || typeof data !== 'object') return false;
  const record = data as Record<string, unknown>;
  if (Array.isArray(record.modifiedLeadIds) && record.modifiedLeadIds.length > 0) return true;
  if (Array.isArray(record.leadIds) && record.leadIds.length > 0) return true;
  if (record.leadId || record.id || record.LeadID) return true;
  const status = String(record.status || '').toLowerCase();
  return status === 'created' || status === 'updated' || status === 'success';
}

async function pushToTeleCRM(body: SubmissionBody): Promise<TelecrmResponse | null> {
  const url = process.env.TELECRM_API_URL;
  const key = process.env.TELECRM_API_KEY;
  if (!url || !key) return null;

  const phone = normalizePhoneForTeleCRM(body.phone);
  if (!phone) return null;

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 15000);

  const fullName = `${body.firstName} ${body.lastName}`.trim();
  const note     = [
    `Source: ${body.source}`,
    `Email: ${body.email}`,
    `Location: ${body.location}`,
    `Slot: ${body.appointmentDate} at ${body.appointmentTime}`,
    `Symptom: ${body.symptomType}`,
    `Surgery advised: ${body.hadSurgery}`,
    `Prev consult: ${body.prevConsult}`,
    `URL: ${body.pageUrl}`,
  ].join(' | ');

  const payload = {
    fields: { phone, name: fullName },
    actions: [{ type: 'SYSTEM_NOTE', text: note }],
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
        'X-Client-ID': 'nextjs-website-integration',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 204) return { synced: false, statusCode: 204, note: 'TeleCRM returned 204' };

    const text = await res.text();
    if (!text.trim()) return { synced: false, statusCode: res.status, note: 'Empty TeleCRM response' };

    let data: TelecrmResponse;
    try { data = JSON.parse(text) as TelecrmResponse; }
    catch { return { synced: false, statusCode: res.status, note: 'Non-JSON TeleCRM response' }; }

    const confirmed = res.ok && isTelecrmConfirmed(data);
    return {
      ...data,
      synced: confirmed,
      statusCode: res.status,
      leadId: data.leadId || data.id || data.LeadID || null,
      note: confirmed ? 'TeleCRM lead confirmed' : 'TeleCRM lead creation',
    };
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : String(err);
    return { synced: false, note: 'TeleCRM fetch failed', error: message };
  }
}

function getTelecrmStatus(result: TelecrmResponse | null) {
  if (!result) return 'Not configured';
  if (result.synced) return `Synced${result.leadId ? ` (${String(result.leadId)})` : ''}`;
  return result.note || `Failed${result.statusCode ? ` (${result.statusCode})` : ''}`;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const body    = normalizeSubmission(rawBody);

    if (!body.firstName || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'First name and phone are required' },
        { status: 400 },
      );
    }

    const timestamp    = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const telecrmResult = await pushToTeleCRM(body);
    const telecrmStatus = getTelecrmStatus(telecrmResult);
    const row           = buildRow(body, timestamp, telecrmStatus);

    try { appendLocalRow(row); }
    catch (csvErr) { console.warn('Local CSV save skipped:', (csvErr as Error).message); }

    try {
      await insertSubmission({
        timestamp,
        source:          body.source,
        firstName:       body.firstName,
        lastName:        body.lastName,
        email:           body.email,
        phone:           body.phone,
        location:        body.location,
        appointmentDate: body.appointmentDate,
        appointmentTime: body.appointmentTime,
        symptomType:     body.symptomType,
        hadSurgery:      body.hadSurgery,
        prevConsult:     body.prevConsult,
        pageUrl:         body.pageUrl,
        telecrmStatus,
      });
    } catch (dbErr) { console.warn('DB save skipped:', (dbErr as Error).message); }

    try { recordBookedSlot(body.dateKey, body.appointmentTime); }
    catch (slotErr) { console.warn('Slot record skipped:', (slotErr as Error).message); }

    try { await pushToGAS(body, timestamp, telecrmStatus); }
    catch (gasErr) { console.warn('GAS sync skipped:', (gasErr as Error).message); }

    return NextResponse.json({ success: true, telecrm: telecrmResult });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    ensureCsvFile();
    const buffer = fs.readFileSync(FILE_PATH);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="submissions_${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
