import { NextResponse } from 'next/server'
import connectDB from '@/db/connectDb'
import User from '@/models/User'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}).lean()
    const safe = users.map(u => ({
      ...u,
      _id: u._id?.toString(),
      createdAt: u.createdAt?.toISOString(),
      updatedAt: u.updatedAt?.toISOString(),
    }))
    return NextResponse.json(safe)
  } catch (err) {
    console.error('GET /api/debug/users error', err)
    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 })
  }
}
