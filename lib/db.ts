import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export type FilterType = 'all' | 'today' | 'week'

export async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id              SERIAL PRIMARY KEY,
      timestamp       TEXT    NOT NULL DEFAULT '',
      source          TEXT    NOT NULL DEFAULT '',
      "firstName"     TEXT    NOT NULL DEFAULT '',
      "lastName"      TEXT    NOT NULL DEFAULT '',
      email           TEXT    NOT NULL DEFAULT '',
      phone           TEXT    NOT NULL DEFAULT '',
      location        TEXT    NOT NULL DEFAULT '',
      "appointmentDate" TEXT  NOT NULL DEFAULT '',
      "appointmentTime" TEXT  NOT NULL DEFAULT '',
      "symptomType"   TEXT    NOT NULL DEFAULT '',
      "hadSurgery"    TEXT    NOT NULL DEFAULT '',
      "prevConsult"   TEXT    NOT NULL DEFAULT '',
      "pageUrl"       TEXT    NOT NULL DEFAULT '',
      "telecrmStatus" TEXT    NOT NULL DEFAULT '',
      "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE submissions DROP COLUMN IF EXISTS "primaryGoal"`
  await sql`ALTER TABLE submissions DROP COLUMN IF EXISTS "decisionMaker"`
  await sql`ALTER TABLE submissions DROP COLUMN IF EXISTS "timeline"`
}

export async function insertSubmission(data: {
  timestamp: string; source: string; firstName: string; lastName: string
  email: string; phone: string; location: string; appointmentDate: string
  appointmentTime: string; symptomType: string; hadSurgery: string
  prevConsult: string; pageUrl: string; telecrmStatus: string
}) {
  await ensureTable()
  await sql`
    INSERT INTO submissions (
      timestamp, source, "firstName", "lastName", email, phone, location,
      "appointmentDate", "appointmentTime", "symptomType", "hadSurgery",
      "prevConsult", "pageUrl", "telecrmStatus"
    ) VALUES (
      ${data.timestamp}, ${data.source}, ${data.firstName}, ${data.lastName},
      ${data.email}, ${data.phone}, ${data.location},
      ${data.appointmentDate}, ${data.appointmentTime}, ${data.symptomType}, ${data.hadSurgery},
      ${data.prevConsult}, ${data.pageUrl}, ${data.telecrmStatus}
    )
  `
}

type CountRow = { total: number }

export async function getSubmissions(
  search: string, page: number, pageSize: number, filter: FilterType
) {
  await ensureTable()
  const offset = (page - 1) * pageSize

  /* ── today + search ── */
  if (filter === 'today' && search) {
    const q = `%${search}%`
    const rows  = await sql`SELECT * FROM submissions WHERE "createdAt"::date = CURRENT_DATE AND ("firstName" ILIKE ${q} OR "lastName" ILIKE ${q} OR email ILIKE ${q} OR phone ILIKE ${q} OR location ILIKE ${q} OR "pageUrl" ILIKE ${q} OR "symptomType" ILIKE ${q}) ORDER BY "createdAt" DESC LIMIT ${pageSize} OFFSET ${offset}`
    const [cnt] = await sql`SELECT COUNT(*)::int AS total FROM submissions WHERE "createdAt"::date = CURRENT_DATE AND ("firstName" ILIKE ${q} OR "lastName" ILIKE ${q} OR email ILIKE ${q} OR phone ILIKE ${q} OR location ILIKE ${q} OR "pageUrl" ILIKE ${q} OR "symptomType" ILIKE ${q})`
    return { rows, total: (cnt as CountRow).total }
  }

  /* ── today only ── */
  if (filter === 'today') {
    const rows  = await sql`SELECT * FROM submissions WHERE "createdAt"::date = CURRENT_DATE ORDER BY "createdAt" DESC LIMIT ${pageSize} OFFSET ${offset}`
    const [cnt] = await sql`SELECT COUNT(*)::int AS total FROM submissions WHERE "createdAt"::date = CURRENT_DATE`
    return { rows, total: (cnt as CountRow).total }
  }

  /* ── week + search ── */
  if (filter === 'week' && search) {
    const q = `%${search}%`
    const rows  = await sql`SELECT * FROM submissions WHERE "createdAt" >= NOW() - INTERVAL '7 days' AND ("firstName" ILIKE ${q} OR "lastName" ILIKE ${q} OR email ILIKE ${q} OR phone ILIKE ${q} OR location ILIKE ${q} OR "pageUrl" ILIKE ${q} OR "symptomType" ILIKE ${q}) ORDER BY "createdAt" DESC LIMIT ${pageSize} OFFSET ${offset}`
    const [cnt] = await sql`SELECT COUNT(*)::int AS total FROM submissions WHERE "createdAt" >= NOW() - INTERVAL '7 days' AND ("firstName" ILIKE ${q} OR "lastName" ILIKE ${q} OR email ILIKE ${q} OR phone ILIKE ${q} OR location ILIKE ${q} OR "pageUrl" ILIKE ${q} OR "symptomType" ILIKE ${q})`
    return { rows, total: (cnt as CountRow).total }
  }

  /* ── week only ── */
  if (filter === 'week') {
    const rows  = await sql`SELECT * FROM submissions WHERE "createdAt" >= NOW() - INTERVAL '7 days' ORDER BY "createdAt" DESC LIMIT ${pageSize} OFFSET ${offset}`
    const [cnt] = await sql`SELECT COUNT(*)::int AS total FROM submissions WHERE "createdAt" >= NOW() - INTERVAL '7 days'`
    return { rows, total: (cnt as CountRow).total }
  }

  /* ── all + search ── */
  if (search) {
    const q = `%${search}%`
    const rows  = await sql`SELECT * FROM submissions WHERE "firstName" ILIKE ${q} OR "lastName" ILIKE ${q} OR email ILIKE ${q} OR phone ILIKE ${q} OR location ILIKE ${q} OR "pageUrl" ILIKE ${q} OR "symptomType" ILIKE ${q} ORDER BY "createdAt" DESC LIMIT ${pageSize} OFFSET ${offset}`
    const [cnt] = await sql`SELECT COUNT(*)::int AS total FROM submissions WHERE "firstName" ILIKE ${q} OR "lastName" ILIKE ${q} OR email ILIKE ${q} OR phone ILIKE ${q} OR location ILIKE ${q} OR "pageUrl" ILIKE ${q} OR "symptomType" ILIKE ${q}`
    return { rows, total: (cnt as CountRow).total }
  }

  /* ── all ── */
  const rows  = await sql`SELECT * FROM submissions ORDER BY "createdAt" DESC LIMIT ${pageSize} OFFSET ${offset}`
  const [cnt] = await sql`SELECT COUNT(*)::int AS total FROM submissions`
  return { rows, total: (cnt as CountRow).total }
}

export async function getStats() {
  await ensureTable()
  const rows = await sql`
    SELECT
      COUNT(*)::int                                                        AS total,
      COUNT(*) FILTER (WHERE "createdAt"::date = CURRENT_DATE)::int       AS today,
      COUNT(*) FILTER (WHERE "createdAt" >= NOW() - INTERVAL '7 days')::int AS week,
      COUNT(*) FILTER (WHERE "telecrmStatus" ILIKE 'Synced%')::int        AS synced
    FROM submissions
  `
  return rows[0] as { total: number; today: number; week: number; synced: number }
}
