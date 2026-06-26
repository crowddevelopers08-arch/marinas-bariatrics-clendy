import { NextResponse } from 'next/server'
import * as fs   from 'fs'
import * as path from 'path'
import { neon } from '@neondatabase/serverless'

export const runtime = 'nodejs'

const FILE_PATH = path.join(process.cwd(), 'data', 'submissions.csv')

/* ── CSV parser ─────────────────────────────────── */
function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current  = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim()); current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function parseCsv(content: string) {
  const lines   = content.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const headers = splitCsvLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim())

  return lines.slice(1).map(line => {
    const vals: Record<string, string> = {}
    const cols = splitCsvLine(line)
    headers.forEach((h, i) => { vals[h] = (cols[i] ?? '').replace(/^"|"$/g, '') })
    return vals
  })
}

/* ── Bulk insert using Neon HTTP ────────────────── */
export async function POST() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return NextResponse.json({ error: 'CSV file not found at data/submissions.csv' }, { status: 404 })
    }

    const content = fs.readFileSync(FILE_PATH, 'utf8')
    const rows    = parseCsv(content)

    if (rows.length === 0) {
      return NextResponse.json({ imported: 0, message: 'CSV is empty' })
    }

    const sql = neon(process.env.DATABASE_URL!)

    /* ensure table */
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id              SERIAL PRIMARY KEY,
        timestamp       TEXT NOT NULL DEFAULT '',
        source          TEXT NOT NULL DEFAULT '',
        "firstName"     TEXT NOT NULL DEFAULT '',
        "lastName"      TEXT NOT NULL DEFAULT '',
        email           TEXT NOT NULL DEFAULT '',
        phone           TEXT NOT NULL DEFAULT '',
        location        TEXT NOT NULL DEFAULT '',
        "appointmentDate" TEXT NOT NULL DEFAULT '',
        "appointmentTime" TEXT NOT NULL DEFAULT '',
        "symptomType"   TEXT NOT NULL DEFAULT '',
        "hadSurgery"    TEXT NOT NULL DEFAULT '',
        "primaryGoal"   TEXT NOT NULL DEFAULT '',
        "decisionMaker" TEXT NOT NULL DEFAULT '',
        timeline        TEXT NOT NULL DEFAULT '',
        "prevConsult"   TEXT NOT NULL DEFAULT '',
        "pageUrl"       TEXT NOT NULL DEFAULT '',
        "telecrmStatus" TEXT NOT NULL DEFAULT '',
        "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `

    let imported = 0
    let skipped  = 0

    for (const row of rows) {
      const phone = row['Phone'] ?? ''
      const ts    = row['Timestamp'] ?? ''
      if (!phone && !ts) { skipped++; continue }

      try {
        await sql`
          INSERT INTO submissions (
            timestamp, source, "firstName", "lastName", email, phone, location,
            "appointmentDate", "appointmentTime", "symptomType", "hadSurgery",
            "primaryGoal", "decisionMaker", timeline, "prevConsult", "pageUrl", "telecrmStatus"
          ) VALUES (
            ${ts},
            ${row['Source']             ?? ''},
            ${row['First Name']         ?? ''},
            ${row['Last Name']          ?? ''},
            ${row['Email']              ?? ''},
            ${phone},
            ${row['Location']           ?? ''},
            ${row['Appointment Date']   ?? ''},
            ${row['Appointment Time']   ?? ''},
            ${row['Symptom Type']       ?? ''},
            ${row['Surgery Advised']    ?? ''},
            ${row['Primary Goal']       ?? ''},
            ${row['Decision Maker']     ?? ''},
            ${row['Timeline']           ?? ''},
            ${row['Previous Consult']   ?? ''},
            ${row['Page URL']           ?? ''},
            ${row['TeleCRM']            ?? ''}
          )
        `
        imported++
      } catch {
        skipped++
      }
    }

    return NextResponse.json({
      imported,
      skipped,
      total: rows.length,
      message: `Imported ${imported} of ${rows.length} rows`,
    })
  } catch (err) {
    console.error('Import error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
