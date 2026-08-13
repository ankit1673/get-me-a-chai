import { NextResponse } from 'next/server'
import connectDB from '@/db/connectDb'
import User from '@/models/User'

export async function GET(_req, { params }) {
  try {
    await connectDB()

    // In newer Next.js versions, params is a Promise
    const { username: paramUsername } = await params

    // Prefer params.username
    // Fallback to parsing the request URL if necessary
    let rawUsername = paramUsername

    if (!rawUsername) {
      try {
        const reqUrl = new URL(_req.url)
        const parts = reqUrl.pathname.split('/').filter(Boolean)

        const userIndex = parts.indexOf('user')

        if (userIndex >= 0 && parts.length > userIndex + 1) {
          rawUsername = parts[userIndex + 1]
        }
      } catch (e) {
        console.error(
          'Failed to parse request URL for username fallback:',
          e
        )
      }
    }

    const username = rawUsername
      ? decodeURIComponent(String(rawUsername)).trim()
      : ''

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ username }).lean()

    if (!user) {
      console.error('User not found for username:', username)

      return NextResponse.json(
        {
          error: 'User not found',
          username,
        },
        { status: 404 }
      )
    }

    // Convert MongoDB values to JSON-safe values
    const safeUser = {
      ...user,
      _id: user._id?.toString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    }

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('GET /api/user/[username] error:', error)

    return NextResponse.json(
      { error: 'Unable to fetch user' },
      { status: 500 }
    )
  }
}