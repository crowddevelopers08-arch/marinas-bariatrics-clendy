import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR   = path.join(process.cwd(), 'data');
const SLOTS_FILE = path.join(DATA_DIR, 'booked-slots.json');

export const runtime = 'nodejs';

function readLocalSlots(): Record<string, string[]> {
  try {
    if (!fs.existsSync(SLOTS_FILE)) return {};
    return JSON.parse(fs.readFileSync(SLOTS_FILE, 'utf8')) as Record<string, string[]>;
  } catch {
    return {};
  }
}

function writeLocalSlots(data: Record<string, string[]>) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

function syncLocal(date: string, booked: string[]) {
  const current = readLocalSlots();
  if (booked.length === 0) {
    delete current[date];
  } else {
    current[date] = booked;
  }
  writeLocalSlots(current);
}

// ── GET: return booked slots for a date ──
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return NextResponse.json({ booked: [] });

  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
  if (gasUrl) {
    try {
      const res = await fetch(`${gasUrl}?date=${encodeURIComponent(date)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json() as { booked?: string[] };
        if (Array.isArray(json.booked)) {
          syncLocal(date, json.booked);
          return NextResponse.json({ booked: json.booked });
        }
      }
    } catch {
      // GAS unreachable — fall through to local
    }
  }

  const local = readLocalSlots();
  return NextResponse.json({ booked: local[date] ?? [] });
}

// ── DELETE: reset all local booked slots (called by GAS reset) ──
export async function DELETE(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.SLOT_RESET_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    writeLocalSlots({});
    return NextResponse.json({ status: 'ok', message: 'All local booked slots cleared' });
  } catch {
    return NextResponse.json({ error: 'Failed to clear slots' }, { status: 500 });
  }
}
