import { NextResponse } from 'next/server'
import connectDB from '@/db/connectDb'
import User from '@/models/User'

export async function GET(_req, { params }) {
  try {
  
    await connectDB()
    // Prefer params.username but fallback to parsing the pathname from the request URL
    let rawUsername = params?.username
    if (!rawUsername) {
      try {
        const reqUrl = new URL(_req.url, `http://localhost`)
        const parts = reqUrl.pathname.split('/').filter(Boolean)
        const userIndex = parts.indexOf('user')
        if (userIndex >= 0 && parts.length > userIndex + 1) {
          rawUsername = parts[userIndex + 1]
        }
      } catch (e) {
        console.error('Failed to parse request URL for username fallback', e)
      }
    }
    const username = rawUsername ? decodeURIComponent(String(rawUsername)).trim() : ''
   
    const user = await User.findOne({ username }).lean()
    if (!user) {
      console.error('User not found for username:', username)
      return NextResponse.json({ error: 'User not found', username }, { status: 404 })
    }

    const safeUser = {
      ...user,
      _id: user._id?.toString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    }

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('GET /api/user/[username] error:', error)
    return NextResponse.json({ error: 'Unable to fetch user' }, { status: 500 })
  }
}
