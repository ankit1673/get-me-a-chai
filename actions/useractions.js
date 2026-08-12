"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDb"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
  await connectDB()
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || process.env.KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.KEY_SECRET,
  })

  const options = {
    amount: Number.parseInt(amount),
    currency: 'INR',
  }
  const order = await instance.orders.create(options)

  const created = await Payment.create({
    oid: order.id,
    amount: (Number(amount) / 100).toString(),
    to_user: to_username,
    name: paymentform.name,
    message: paymentform.message,
    done: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // helpful debug log to confirm DB creation during development
  try {

  } catch (e) {
    // ignore logging errors
  }

  return order
}

export const fetchuser = async (username) => {
  await connectDB()
  const user = await User.findOne({ username }).lean()
  if (!user) return null
  return {
    ...user,
    _id: user._id?.toString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  }
}

export const fetchpayments = async (username) => {
  await connectDB()
  const payments = await Payment.find({ to_user: username }).sort({ createdAt: -1 }).limit(10).lean()
  return payments.map((payment) => ({
    ...payment,
    _id: payment._id?.toString(),
    createdAt: payment.createdAt?.toISOString(),
    updatedAt: payment.updatedAt?.toISOString(),
  }))
}

export const updateProfile = async (username, data) => {
  try {
    if (!username) {
      console.error('updateProfile called without username', { data })
      return null
    }
    await connectDB()
    const payload = data instanceof FormData ? Object.fromEntries(data) : data
    const update = { ...payload, updatedAt: new Date() }
    
    const updated = await User.findOneAndUpdate({ username }, update, { new: true })
    if (!updated) {
      console.error('updateProfile: no user found for', username)
      return null
    }
    return updated ? updated.toObject() : null
  } catch (err) {
    console.error('updateProfile error for', username, err)
    throw err
  }
}
