import { NextResponse } from 'next/server'
import { initiate } from '@/actions/useractions'

export async function POST(req) {
  try {
    const body = await req.json()
    const { amount, to_username, paymentform } = body

    if (!amount || !to_username) {
      return NextResponse.json({ error: 'Missing payment data' }, { status: 400 })
    }

    const order = await initiate(amount, to_username, paymentform || {})
    return NextResponse.json(order)
  } catch (error) {
    console.error('POST /api/initiate error:', error)
    return NextResponse.json({ error: `Unable to initiate payment: ${error.message}` }, { status: 500 })
  }
}
