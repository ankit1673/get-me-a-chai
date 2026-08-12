import { NextResponse } from 'next/server'
import Payment from '@/models/Payment'
import connectDB from '@/db/connectDb'

export async function GET(_req, { params }) {
  try {
    await connectDB()

    // Prefer params.username but fallback to parsing the pathname from the request URL
    let rawUsername = params?.username
    if (!rawUsername) {
      try {
        const reqUrl = new URL(_req.url, `http://localhost`)
        const parts = reqUrl.pathname.split('/').filter(Boolean)
        const paymentsIndex = parts.indexOf('payments')
        if (paymentsIndex >= 0 && parts.length > paymentsIndex + 1) {
          rawUsername = parts[paymentsIndex + 1]
        } else if (parts.length >= 1) {
          // fallback to first segment (e.g., /ankit1673/payments)
          rawUsername = parts[0]
        }
      } catch (e) {
        console.error('Failed to parse request URL for payments username fallback', e)
      }
    }

    const username = rawUsername ? decodeURIComponent(String(rawUsername)).trim() : ''
   

    const payments = await Payment.find({ to_user: username, done: true })
      .sort({ amount: -1 })
      .limit(10)
      .lean()

    // convert to safe JSON
    const safe = payments.map(p => ({
      ...p,
      _id: p._id?.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }))

    return NextResponse.json(safe)
  } catch (error) {
    console.error('GET /api/payments/[username] error:', error)
    return NextResponse.json({ error: 'Unable to fetch payments' }, { status: 500 })
  }
}


