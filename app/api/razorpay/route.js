import { NextResponse } from 'next/server'
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils'
import connectDB from '@/db/connectDb'
import Payment from '@/models/Payment'

export async function POST(req) {
  try {
    const body = await req.json()
    const orderId = body.razorpay_order_id || body.razorpay_orderid || body.order_id || body.orderId
    const paymentId = body.razorpay_payment_id || body.payment_id || body.paymentId
    const signature = body.razorpay_signature || body.signature

    // Debug logging to help local development — inspect incoming payload and headers
    try {
      const headers = typeof req.headers?.forEach === 'function' ? Object.fromEntries(req.headers) : {}
    
    } catch (logErr) {
     
    }

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment verification details' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || process.env.KEY_SECRET

    if (!secret) {
      console.error('Razorpay secret missing in environment')
      return NextResponse.json({ error: 'Razorpay secret is not configured' }, { status: 500 })
    }

    const isValid = validatePaymentVerification(
      { order_id: orderId, payment_id: paymentId },
      signature,
      secret
    )

    if (!isValid) {
      console.error('Payment signature verification failed for order:', orderId)
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    await connectDB()
    const payment = await Payment.findOne({ oid: orderId })
    if (payment) {
      payment.done = true
      await payment.save()
    } else {
      console.warn('No payment record found for order id', orderId)
    }

    return NextResponse.json({ success: true, order_id: orderId, payment_id: paymentId })
  } catch (error) {
    console.error('POST /api/razorpay error:', error)
    return NextResponse.json({ error: 'Unable to process Razorpay callback' }, { status: 500 })
  }
}
