import { NextResponse } from "next/server"
import connectDB from "@/db/connectDb"
import Payment from "@/models/Payment"

export async function GET(_req, { params }) {
  try {
    await connectDB()

    const { username } = await params

    const decodedUsername = decodeURIComponent(
      String(username || "")
    ).trim()

    if (!decodedUsername) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    console.log("====================================")
    console.log("Payment request for:", decodedUsername)
    console.log("Database:", Payment.db.name)
    console.log("Host:", Payment.db.host)
    console.log("Collection:", Payment.collection.name)

    const payments = await Payment.find({
      to_user: decodedUsername,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const safePayments = payments.map((payment) => ({
      ...payment,
      _id: payment._id?.toString(),
      createdAt: payment.createdAt?.toISOString(),
      updatedAt: payment.updatedAt?.toISOString(),
    }))

    console.log(
      "Payments found:",
      safePayments.length
    )

    // IMPORTANT:
    // PaymentPage expects an ARRAY.
    return NextResponse.json(safePayments)

  } catch (error) {
    console.error(
      "GET /api/payments/[username] error:",
      error
    )

    return NextResponse.json(
      { error: "Unable to fetch payments" },
      { status: 500 }
    )
  }
}