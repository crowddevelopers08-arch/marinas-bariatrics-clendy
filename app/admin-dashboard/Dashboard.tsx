'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

/* ── Brand colors from Marina's Clinic logo ── */
const BRAND = {
  teal:      '#3BBFC3',
  tealLight: '#A8DEE0',
  tealDark:  '#2A9EA2',
  bg:        '#F4FAFA',
  card:      '#FFFFFF',
  border:    '#E2F0F1',
  text:      '#2D3D3E',
  sub:       '#6B8586',
}

type Submission = {
  id:              number
  timestamp:       string
  source:          string
  firstName:       string
  lastName:        string
  email:           string
  phone:           string
  location:        string
  appointmentDate: string
  appointmentTime: string
  symptomType:     string
  hadSurgery:      string
  prevConsult:     string
  pageUrl:         string
  telecrmStatus:   string
  createdAt:       string
}

type FilterType  = 'all' | 'today' | 'week'
type Stats       = { total: number; today: number; week: number; synced: number }
type ApiResponse = { submissions: Submission[]; total: number; page: number; pageSize: number; stats: Stats }

const csvColumns: { key: keyof Submission; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'timestamp', label: 'Submitted' },
  { key: 'source', label: 'Source' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'location', label: 'Location' },
  { key: 'appointmentDate', label: 'Appointment Date' },
  { key: 'appointmentTime', label: 'Appointment Time' },
  { key: 'symptomType', label: 'Symptom Type' },
  { key: 'hadSurgery', label: 'Surgery Advised' },
  { key: 'prevConsult', label: 'Previous Consult' },
  { key: 'pageUrl', label: 'Page URL' },
  { key: 'telecrmStatus', label: 'TeleCRM Status' },
  { key: 'createdAt', label: 'Created At' },
]

function csvCell(value: string | number) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function toCsv(rows: Submission[]) {
  return [
    csvColumns.map(col => csvCell(col.label)).join(','),
    ...rows.map(row => csvColumns.map(col => csvCell(row[col.key])).join(',')),
  ].join('\r\n')
}

export default function Dashboard() {
  const [data,        setData]        = useState<ApiResponse | null>(null)
  const [search,      setSearch]      = useState('')
  const [page,        setPage]        = useState(1)
  const [filter,      setFilter]      = useState<FilterType>('all')
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [expanded,    setExpanded]    = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadMsg, setDownloadMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const load = useCallback(async (q: string, pg: number, f: FilterType) => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/admin/submissions?search=${encodeURIComponent(q)}&page=${pg}&filter=${f}`)
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch { setError('Could not load data.') }
    finally  { setLoading(false) }
  }, [])

  /* search change → debounce, reset page */
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(search, 1, filter) }, 350)
    return () => clearTimeout(t)
  }, [search, load]) // eslint-disable-line react-hooks/exhaustive-deps

  /* filter change → immediate, reset page */
  useEffect(() => { setPage(1); load(search, 1, filter) }, [filter, load]) // eslint-disable-line react-hooks/exhaustive-deps

  /* page change → reload with current filter */
  useEffect(() => { load(search, page, filter) }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilterClick(f: FilterType) {
    setFilter(prev => prev === f && f !== 'all' ? 'all' : f)
    setExpanded(null)
  }

  async function handleDownload() {
    setDownloading(true)
    setDownloadMsg(null)
    try {
      const params = new URLSearchParams({ search, page: '1', filter, download: '1' })
      const res = await fetch(`/api/admin/submissions?${params.toString()}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Download failed')

      const rows = (json.submissions ?? []) as Submission[]
      if (!rows.length) {
        setDownloadMsg({ text: 'No data available to download.', ok: false })
        return
      }

      const blob = new Blob([`\uFEFF${toCsv(rows)}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `marina-leads-${filter}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setDownloadMsg({ text: `Downloaded ${rows.length} lead${rows.length === 1 ? '' : 's'}.`, ok: true })
    } catch (e) {
      setDownloadMsg({ text: (e as Error).message, ok: false })
    } finally {
      setDownloading(false)
      setTimeout(() => setDownloadMsg(null), 6000)
    }
  }
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0

  function initials(s: Submission) {
    return ((s.firstName?.[0] ?? '') + (s.lastName?.[0] ?? '')).toUpperCase() || '?'
  }

  const avatarPalette = [
    '#3BBFC3','#2A9EA2','#5BBEC0','#1F7F83','#68CDD0','#46A9AC',
  ]

  function shortUrl(url: string) {
    try { const u = new URL(url); return u.pathname === '/' ? u.hostname : u.pathname }
    catch { return url }
  }

  function synced(s: string) { return s?.toLowerCase().startsWith('synced') }

  return (
    <div style={{ minHeight: '100vh', background: BRAND.bg, fontFamily: 'inherit' }}>

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <header style={{
        background: BRAND.card,
        borderBottom: `1px solid ${BRAND.border}`,
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Image src="/Marina-logo.png" alt="Marina's Clinic" width={44} height={44}
              style={{ objectFit: 'contain' }} />
            <div style={{ borderLeft: `2px solid ${BRAND.tealLight}`, paddingLeft: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: BRAND.text, lineHeight: 1.1, margin: 0 }}>
                Marina&apos;s Clinic
              </p>
              <p style={{ fontSize: 11, color: BRAND.sub, margin: 0, marginTop: 2, letterSpacing: '0.04em' }}>
                ADMIN DASHBOARD
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleDownload}
              disabled={downloading || !data?.total}
              title="Download lead data as CSV"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: downloading || !data?.total ? BRAND.bg : BRAND.teal,
                color: downloading || !data?.total ? BRAND.sub : '#fff',
                border: `1px solid ${downloading || !data?.total ? BRAND.border : BRAND.teal}`,
                borderRadius: 999, padding: '7px 16px',
                fontSize: 13, fontWeight: 600,
                cursor: downloading || !data?.total ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
              }}
            >
              {downloading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke={BRAND.tealLight} strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke={BRAND.teal} strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <IconDownload />
                  Download Data
                </>
              )}
            </button>

            {data?.stats && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: `${BRAND.teal}15`, border: `1px solid ${BRAND.tealLight}`,
                borderRadius: 999, padding: '6px 14px',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.teal, display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.tealDark }}>
                  {data.stats.total} Total Leads
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* ══ STATS ══════════════════════════════════════════════ */}
        {data?.stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard label="Total Leads" value={data.stats.total}  sub="All time"      icon={<IconUsers />}    color={BRAND.teal} active={filter === 'all'}   onClick={() => handleFilterClick('all')} />
            <StatCard label="Today"       value={data.stats.today}  sub="Click to filter" icon={<IconCalendar />} color="#10B981"  active={filter === 'today'} onClick={() => handleFilterClick('today')} />
            <StatCard label="This Week"   value={data.stats.week}   sub="Click to filter" icon={<IconChart />}  color="#8B5CF6"    active={filter === 'week'}  onClick={() => handleFilterClick('week')} />
            <StatCard label="CRM Synced"  value={data.stats.synced} sub="TeleCRM leads"  icon={<IconCheck />}   color="#F59E0B"   active={false} />
          </div>
        )}

        {/* ══ SEARCH + ACTIVE FILTER BADGE ══════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            background: BRAND.card, borderRadius: 14,
            border: `1px solid ${filter !== 'all' ? BRAND.teal : BRAND.border}`,
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 1px 4px rgba(59,191,195,0.07)',
            transition: 'border-color 0.2s',
          }}>
            <span style={{ color: BRAND.sub, display: 'flex', flexShrink: 0 }}><IconSearch /></span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, location, page URL..."
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 14,
                color: BRAND.text, background: 'transparent',
              }}
            />
            {/* Active filter badge inside search bar */}
            {filter !== 'all' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: filter === 'today' ? '#ECFDF5' : '#F5F3FF',
                  color:      filter === 'today' ? '#059669'  : '#7C3AED',
                  border:     `1px solid ${filter === 'today' ? '#A7F3D0' : '#DDD6FE'}`,
                  borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 600,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: filter === 'today' ? '#10B981' : '#8B5CF6', flexShrink: 0 }} />
                  {filter === 'today' ? 'Today only' : 'This week'}
                </span>
                <button onClick={() => handleFilterClick('all')} title="Clear filter" style={{
                  border: 'none', background: `${BRAND.teal}15`, cursor: 'pointer',
                  color: BRAND.tealDark, display: 'flex', padding: 5, borderRadius: 6,
                }}>
                  <IconX />
                </button>
              </div>
            )}
            {search && !filter && (
              <button onClick={() => setSearch('')} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                color: BRAND.sub, display: 'flex', padding: 4, borderRadius: 6,
              }}>
                <IconX />
              </button>
            )}
            <span style={{ fontSize: 12, color: BRAND.sub, flexShrink: 0 }}>
              {data ? `${data.total} result${data.total !== 1 ? 's' : ''}` : ''}
            </span>
          </div>
        </div>

        {/* ══ IMPORT RESULT TOAST ════════════════════════════════ */}
        {downloadMsg && (
          <div style={{
            background: downloadMsg.ok ? '#ECFDF5' : '#FEF2F2',
            border:     `1px solid ${downloadMsg.ok ? '#A7F3D0' : '#FECACA'}`,
            color:      downloadMsg.ok ? '#065F46' : '#DC2626',
            padding: '12px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {downloadMsg.ok
              ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            {downloadMsg.text}
          </div>
        )}

        {/* ══ ERROR ══════════════════════════════════════════════ */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            color: '#DC2626', padding: '12px 16px', borderRadius: 10, fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* ══ TABLE CARD ═════════════════════════════════════════ */}
        <div style={{
          background: BRAND.card, borderRadius: 16,
          border: `1px solid ${BRAND.border}`,
          boxShadow: '0 2px 8px rgba(59,191,195,0.08)', overflow: 'hidden',
        }}>
          {/* Table toolbar */}
          <div style={{
            padding: '16px 24px', borderBottom: `1px solid ${BRAND.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: BRAND.text, margin: 0 }}>All Submissions</p>
            {loading && (
              <span style={{ fontSize: 12, color: BRAND.sub, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                  <path d="M12 2a10 10 0 0110 10" stroke={BRAND.teal} strokeWidth="3" strokeLinecap="round" />
                </svg>
                Refreshing...
              </span>
            )}
          </div>

          {/* Body */}
          {loading && !data ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: BRAND.sub, gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke={BRAND.tealLight} strokeWidth="3" />
                <path d="M12 2a10 10 0 0110 10" stroke={BRAND.teal} strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 14 }}>Loading submissions...</span>
            </div>
          ) : !data || data.submissions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260 }}>
              <span style={{ color: BRAND.tealLight, marginBottom: 14 }}><IconEmpty /></span>
              <p style={{ fontSize: 15, fontWeight: 600, color: BRAND.text, margin: 0 }}>No submissions found</p>
              <p style={{ fontSize: 13, color: BRAND.sub, marginTop: 6 }}>
                {search ? 'Try a different search term' : 'Leads will appear here once the form is submitted'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: `${BRAND.teal}09`, borderBottom: `1px solid ${BRAND.border}` }}>
                    {['Lead', 'Phone', 'Location', 'Appointment', 'Page URL', 'TeleCRM', 'Submitted'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '11px 16px',
                        fontSize: 11, fontWeight: 700, color: BRAND.sub,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                    <th style={{ width: 36 }} />
                  </tr>
                </thead>
                <tbody>
                  {data.submissions.map(s => {
                    const open = expanded === s.id
                    return (
                      <>
                        <tr
                          key={s.id}
                          onClick={() => setExpanded(open ? null : s.id)}
                          style={{
                            borderBottom: `1px solid ${BRAND.border}`,
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                            background: open ? `${BRAND.teal}07` : 'transparent',
                          }}
                          onMouseEnter={e => { if (!open) (e.currentTarget as HTMLTableRowElement).style.background = `${BRAND.teal}05` }}
                          onMouseLeave={e => { if (!open) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
                        >
                          {/* Lead */}
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                background: avatarPalette[s.id % avatarPalette.length],
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700, color: '#fff',
                              }}>
                                {initials(s)}
                              </div>
                              <div>
                                <p style={{ margin: 0, fontWeight: 600, color: BRAND.text, lineHeight: 1.2 }}>
                                  {s.firstName} {s.lastName}
                                </p>
                                <p style={{ margin: 0, fontSize: 11, color: BRAND.sub, marginTop: 2 }}>
                                  {s.email || s.symptomType || '—'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td style={{ padding: '13px 16px', color: BRAND.text, fontFamily: 'monospace', fontSize: 13 }}>
                            {s.phone}
                          </td>

                          {/* Location */}
                          <td style={{ padding: '13px 16px', color: BRAND.sub }}>
                            {s.location || '—'}
                          </td>

                          {/* Appointment */}
                          <td style={{ padding: '13px 16px' }}>
                            {s.appointmentDate ? (
                              <>
                                <p style={{ margin: 0, fontWeight: 500, color: BRAND.text }}>{s.appointmentDate}</p>
                                <p style={{ margin: 0, fontSize: 11, color: BRAND.sub, marginTop: 2 }}>{s.appointmentTime}</p>
                              </>
                            ) : <span style={{ color: BRAND.border }}>—</span>}
                          </td>

                          {/* Page URL */}
                          <td style={{ padding: '13px 16px', maxWidth: 180 }}>
                            {s.pageUrl ? (
                              <a
                                href={s.pageUrl} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                title={s.pageUrl}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 5,
                                  color: BRAND.tealDark, fontSize: 12, textDecoration: 'none',
                                  maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}
                              >
                                <span style={{ flexShrink: 0 }}><IconLink /></span>
                                {shortUrl(s.pageUrl)}
                              </a>
                            ) : <span style={{ color: BRAND.border }}>—</span>}
                          </td>

                          {/* TeleCRM */}
                          <td style={{ padding: '13px 16px' }}>
                            {s.telecrmStatus && s.telecrmStatus !== 'Not configured' ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                                background: synced(s.telecrmStatus) ? '#ECFDF5' : '#FFFBEB',
                                color:      synced(s.telecrmStatus) ? '#059669' : '#D97706',
                                border: `1px solid ${synced(s.telecrmStatus) ? '#A7F3D0' : '#FDE68A'}`,
                              }}>
                                <span style={{
                                  width: 6, height: 6, borderRadius: '50%',
                                  background: synced(s.telecrmStatus) ? '#10B981' : '#F59E0B',
                                }} />
                                {synced(s.telecrmStatus) ? 'Synced' : 'Pending'}
                              </span>
                            ) : <span style={{ color: BRAND.border, fontSize: 12 }}>—</span>}
                          </td>

                          {/* Submitted */}
                          <td style={{ padding: '13px 16px', color: BRAND.sub, fontSize: 12, whiteSpace: 'nowrap' }}>
                            {s.timestamp}
                          </td>

                          {/* Chevron */}
                          <td style={{ padding: '13px 12px' }}>
                            <span style={{
                              color: BRAND.sub, display: 'flex',
                              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                            }}>
                              <IconChevron />
                            </span>
                          </td>
                        </tr>

                        {/* ── Expanded Detail Panel ── */}
                        {open && (
                          <tr key={`${s.id}-exp`}>
                            <td colSpan={8} style={{ padding: 0, borderBottom: `1px solid ${BRAND.border}` }}>
                              <div style={{ background: `${BRAND.teal}07`, padding: '22px 28px' }}>

                                {/* Panel header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                  <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: avatarPalette[s.id % avatarPalette.length],
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                                  }}>
                                    {initials(s)}
                                  </div>
                                  <p style={{ margin: 0, fontWeight: 700, color: BRAND.text, fontSize: 14 }}>
                                    {s.firstName} {s.lastName}
                                  </p>
                                  <span style={{ color: BRAND.tealLight }}>·</span>
                                  <p style={{ margin: 0, fontSize: 12, color: BRAND.sub }}>Entry #{s.id}</p>
                                </div>

                                {/* Fields grid */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                  gap: 18,
                                }}>
                                  <DetailField label="Source"           value={s.source} />
                                  <DetailField label="Email"            value={s.email} />
                                  <DetailField label="Phone"            value={s.phone} />
                                  <DetailField label="Location"         value={s.location} />
                                  <DetailField label="Appointment Date" value={s.appointmentDate} />
                                  <DetailField label="Appointment Time" value={s.appointmentTime} />
                                  <DetailField label="Symptom Type"     value={s.symptomType} />
                                  <DetailField label="Surgery Advised"  value={s.hadSurgery} />
                                  <DetailField label="Prev. Consult"    value={s.prevConsult} />
                                  <DetailField label="TeleCRM"          value={s.telecrmStatus} />
                                  <DetailField label="Submitted At"     value={s.timestamp} />
                                </div>

                                {/* Page URL full */}
                                {s.pageUrl && (
                                  <div style={{
                                    marginTop: 18, paddingTop: 18,
                                    borderTop: `1px solid ${BRAND.tealLight}50`,
                                  }}>
                                    <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: BRAND.sub, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                      Page URL
                                    </p>
                                    <a href={s.pageUrl} target="_blank" rel="noopener noreferrer"
                                      style={{ fontSize: 13, color: BRAND.tealDark, textDecoration: 'none', wordBreak: 'break-all',
                                        display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                      <span style={{ flexShrink: 0, marginTop: 1 }}><IconExternalLink /></span>
                                      {s.pageUrl}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ══ PAGINATION ══════════════════════════════════════════ */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: BRAND.card, borderRadius: 12, border: `1px solid ${BRAND.border}`,
            padding: '12px 20px',
          }}>
            <p style={{ margin: 0, fontSize: 13, color: BRAND.sub }}>
              Page <strong style={{ color: BRAND.text }}>{page}</strong> of <strong style={{ color: BRAND.text }}>{totalPages}</strong>
              &nbsp;·&nbsp; {data?.total} entries
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <PaginationBtn label="← Previous" disabled={page === 1}       onClick={() => setPage(p => p - 1)} />
              <PaginationBtn label="Next →"      disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        table tr td, table tr th { vertical-align: middle; }
        a:hover { text-decoration: underline !important; }
      `}</style>
    </div>
  )
}

/* ── Helper components ─────────────────────────── */

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: BRAND.sub, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: BRAND.text, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{value || '—'}</p>
    </div>
  )
}

function StatCard({ label, value, sub, icon, color, active, onClick }: {
  label: string; value: number; sub: string; icon: React.ReactNode; color: string
  active?: boolean; onClick?: () => void
}) {
  const clickable = !!onClick
  return (
    <div
      onClick={onClick}
      title={clickable ? (active ? 'Click to clear filter' : `Filter by ${label}`) : undefined}
      style={{
        background: active ? `${color}0D` : BRAND.card,
        borderRadius: 14, padding: '20px 20px',
        border: active ? `2px solid ${color}` : `1px solid ${BRAND.border}`,
        boxShadow: active ? `0 0 0 4px ${color}18` : '0 1px 4px rgba(59,191,195,0.06)',
        display: 'flex', alignItems: 'center', gap: 16,
        borderTop: active ? `3px solid ${color}` : `3px solid ${color}`,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 0.18s ease',
        position: 'relative',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `${color}${active ? '30' : '18'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        transition: 'background 0.18s',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: active ? color : BRAND.text, lineHeight: 1, transition: 'color 0.18s' }}>{value}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: BRAND.text }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: active ? color : BRAND.sub, transition: 'color 0.18s' }}>
          {active ? '✓ Active filter' : sub}
        </p>
      </div>
      {clickable && !active && (
        <span style={{
          position: 'absolute', top: 10, right: 10,
          fontSize: 10, color: BRAND.sub, fontWeight: 500,
          background: BRAND.bg, border: `1px solid ${BRAND.border}`,
          borderRadius: 6, padding: '2px 6px', letterSpacing: '0.03em',
        }}>
          Filter
        </span>
      )}
    </div>
  )
}

function PaginationBtn({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        border: `1px solid ${disabled ? BRAND.border : BRAND.tealLight}`,
        background: disabled ? BRAND.bg : BRAND.card,
        color: disabled ? BRAND.sub : BRAND.tealDark,
        padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

/* ── SVG Icons ─────────────────────────────────── */
function IconUsers()    { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> }
function IconCalendar() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg> }
function IconChart()    { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6"/></svg> }
function IconCheck()    { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
function IconSearch()   { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg> }
function IconX()        { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12"/></svg> }
function IconChevron()  { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/></svg> }
function IconLink()     { return <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> }
function IconExternalLink() { return <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> }
function IconEmpty()    { return <svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg> }
function IconDownload() { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V4"/></svg> }
