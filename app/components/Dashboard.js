"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { fetchuser, updateProfile } from "@/actions/useractions"
import { ToastContainer, toast, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const initialForm = {
  name: "",
  email: "",
  username: "",
  profilepic: "",
  coverpic: "",
  razorpayid: "",
}

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (status === "unauthenticated" || !session?.user) {
      router.push("/login")
      return
    }

    const getData = async () => {
      try {
        setLoading(true)

        // Use username if available.
        // Otherwise fall back to the user's name.
        const identifier =
          session.user.username ||
          session.user.name ||
          session.user.email

        if (!identifier) {
          throw new Error("Unable to identify the logged-in user.")
        }

        const user = await fetchuser(identifier)

        if (!user) {
          console.error("fetchuser returned null")

          toast.error("Unable to load your profile.", {
            position: "top-right",
            autoClose: 5000,
            theme: "light",
            transition: Bounce,
          })

          return
        }

        setForm({
          name: user.name || "",
          email: user.email || "",
          username: user.username || "",
          profilepic: user.profilepic || "",
          coverpic: user.coverpic || "",
          razorpayid: user.razorpayid || "",
        })
      } catch (error) {
        console.error("Dashboard user loading error:", error)

        toast.error("Failed to load your profile.", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        })
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [session, status, router])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!session?.user) {
      toast.error("You are not logged in.")
      return
    }

    try {
      setSaving(true)

      const identifier =
        session.user.username ||
        session.user.name ||
        session.user.email

      if (!identifier) {
        throw new Error("Unable to identify the logged-in user.")
      }

      const result = await updateProfile(identifier, form)

      console.log("Profile update result:", result)

      toast.success("Profile Updated Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      })
    } catch (error) {
      console.error("Profile update error:", error)

      toast.error("Failed to update profile.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      })
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Loading Dashboard...
          </h1>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
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
        theme="light"
      />

      <div className="container mx-auto py-5 px-6">
        <h1 className="text-center my-5 text-3xl font-bold">
          Welcome to your Dashboard
        </h1>

        <form
          className="max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          {/* Name */}
          <div className="my-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>

            <input
              value={form.name || ""}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Email */}
          <div className="my-2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>

            <input
              value={form.email || ""}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Username */}
          <div className="my-2">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>

            <input
              value={form.username || ""}
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Profile Picture */}
          <div className="my-2">
            <label
              htmlFor="profilepic"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Profile Picture
            </label>

            <input
              value={form.profilepic || ""}
              onChange={handleChange}
              type="text"
              name="profilepic"
              id="profilepic"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Cover Picture */}
          <div className="my-2">
            <label
              htmlFor="coverpic"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Cover Picture
            </label>

            <input
              value={form.coverpic || ""}
              onChange={handleChange}
              type="text"
              name="coverpic"
              id="coverpic"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Razorpay ID */}
          <div className="my-2">
            <label
              htmlFor="razorpayid"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Razorpay ID
            </label>

            <input
              value={form.razorpayid || ""}
              onChange={handleChange}
              type="text"
              name="razorpayid"
              id="razorpayid"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Save button */}
          <div className="my-6">
            <button
              type="submit"
              disabled={saving}
              className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Dashboard