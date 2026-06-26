import { NextRequest, NextResponse } from 'next/server'
import { getSubmissions, getStats, FilterType } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search   = searchParams.get('search')?.trim() ?? ''
    const download = searchParams.get('download') === '1'
    const page     = download ? 1 : Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = download ? 10000 : 50
    const raw      = searchParams.get('filter') ?? 'all'
    const filter: FilterType = raw === 'today' ? 'today' : raw === 'week' ? 'week' : 'all'

    const [{ rows, total }, stats] = await Promise.all([
      getSubmissions(search, page, pageSize, filter),
      getStats(),
    ])

    return NextResponse.json({ submissions: rows, total, page, pageSize, stats })
  } catch (err) {
    console.error('Admin submissions error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
