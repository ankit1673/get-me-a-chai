"use client"
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { initiate } from '@/actions/useractions'
import { usePathname, useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { notFound } from "next/navigation"

const PaymentPage = ({ username }) => {
    // const { data: session } = useSession()

    const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" })
    const [currentUser, setcurrentUser] = useState(null)
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const usernameToFetch = username || pathname?.split('/').filter(Boolean)[0] || null

    useEffect(() => {
        if (!usernameToFetch) {
            console.warn('PaymentPage missing usernameToFetch, skipping fetch')
            setErrorMessage('Missing username')
            setLoading(false)
            return
        }

        const loadData = async () => {
            setLoading(true)
            await getData(usernameToFetch)
        }

        loadData()
    }, [usernameToFetch])

    useEffect(() => {
        if (searchParams.get("paymentdone") === "true") {
            toast('Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            })
        }
    }, [searchParams])


    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const getData = async (fetchUsername) => {
        try {
            const [userRes, paymentsRes] = await Promise.all([
                fetch(`/api/user/${fetchUsername}`, { cache: 'no-store' }),
                fetch(`/api/payments/${fetchUsername}`, { cache: 'no-store' }),
            ])

            if (!userRes.ok) {
                const errorBody = await userRes.text()
                console.error('User fetch failed', userRes.status, errorBody)
                setcurrentUser(null)
                setPayments([])
                setErrorMessage('User not found')
                return
            }

            const u = await userRes.json()
            setcurrentUser(u)

            if (paymentsRes.ok) {
                const dbpayments = await paymentsRes.json()

                console.log("Payments API response:", dbpayments)

                // Make sure payments is always an array
                if (Array.isArray(dbpayments)) {
                    setPayments(dbpayments)
                } else if (Array.isArray(dbpayments.payments)) {
                    setPayments(dbpayments.payments)
                } else {
                    console.error("Payments API did not return an array:", dbpayments)
                    setPayments([])
                }
            } else {
                const errorBody = await paymentsRes.text()
                console.error('Payments fetch failed', paymentsRes.status, errorBody)
                setPayments([])
            }
        } catch (error) {
            console.error('Failed to load user data', error)
            setErrorMessage(error.message || 'Unknown fetch error')
            setcurrentUser(null)
            setPayments([])
        } finally {
            setLoading(false)
        }
    }


    const pay = async (amount) => {
        if (!currentUser) {
            toast.error('Unable to process payment: user data not available.')
            return
        }
        // Get the order Id 
        const recipient = usernameToFetch || currentUser.username
        if (!recipient) {
            toast.error('Recipient username is missing')
            return
        }
        if (!currentUser.razorpayid) {
            toast.error('Recipient has no Razorpay ID configured')
            return
        }
        if (typeof window === 'undefined' || !window.Razorpay) {
            toast.error('Razorpay checkout script not loaded yet, try again in a moment')
            return
        }

        let a = await initiate(amount, recipient, paymentform)
        let orderId = a.id
        var options = {
            "key": currentUser.razorpayid || '', // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Get Me A Chai", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            // Use client-side handler to notify our server so we can verify and mark payment done
            // Razorpay will call this handler with `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`
            handler: async function (response) {
                try {
                    const res = await fetch('/api/razorpay', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response),
                    })
                    const result = await res.json()
                    if (res.ok) {
                        toast('Thanks for your donation!', { transition: Bounce })
                        // Refresh payments and user data
                        getData(recipient)
                        // optionally navigate with flag
                        try { router.replace(`${pathname}?paymentdone=true`) } catch (e) { /* ignore */ }
                    } else {
                        console.error('Server verification failed', result)
                        toast.error('Payment verification failed on server')
                    }
                } catch (err) {
                    console.error('Error posting verification', err)
                    toast.error('Unable to process payment verification')
                }
            },
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Gaurav Kumar", //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    if (loading) {
        return (
            <>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light" />
                <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
                <div className='text-center text-white py-20'>Loading...</div>
            </>
        )
    }

    if (!currentUser) {
        return (
            <>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light" />
                <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
                <div className='text-center text-white py-20'>
                    {errorMessage ? `Error: ${errorMessage}` : 'User not found'}
                </div>
            </>
        )
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <div className='cover w-full bg-red-50 relative'>
                <img className='object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm' src={currentUser.coverpic} alt="" />
                <div className='absolute left-1/2 -bottom-20 transform -translate-x-1/2 border-white overflow-hidden border-2 rounded-full w-32 h-32 md:w-40 md:h-40'>
                    <img className='rounded-full object-cover w-full h-full' src={currentUser.profilepic} alt="" />
                </div>
            </div>
            <div className="info flex justify-center items-center my-24 mb-32 flex-col gap-2">
                <div className='font-bold text-lg'>
                    @{usernameToFetch || currentUser.username}
                </div>
                <div className='text-slate-400'>
                    Lets help {usernameToFetch || currentUser.username} get a chai!
                </div>
                <div className='text-slate-400'>
                    {payments.filter(p => p.done).length} Payments .   ₹{payments.filter(p => p.done).reduce((a, b) => a + Number(b.amount), 0)} raised
                </div>
                <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className='text-2xl font-bold my-5'> Top 10 Supporters</h2>
                        <ul className='mx-5 text-lg'>
                            {payments.filter(p => p.done).length == 0 && <li>No payments yet</li>}
                            {payments.filter(p => p.done).map((p, i) => {
                                return <li key={i} className='my-4 flex gap-2 items-center'>
                                    <img width={33} src="avatar.gif" alt="user avatar" />
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount}</span> with a message &quot;{p.message}&quot;
                                    </span>
                                </li>
                            })}
                        </ul>
                    </div>
                    <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className='text-2xl font-bold my-5'>Make a Payment</h2>
                        <div className='flex gap-2 flex-col'>
                            <div>
                                <input onChange={handleChange} value={paymentform.name} name='name' type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Name' />
                            </div>
                            <input onChange={handleChange} value={paymentform.message} name='message' type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Message' />
                            <input onChange={handleChange} value={paymentform.amount} name="amount" type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Amount' />
                            <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)} type="button" className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length < 1}>Pay</button>
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mt-5'>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(1000)}>Pay ₹10</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(2000)}>Pay ₹20</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(3000)}>Pay ₹30</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage
