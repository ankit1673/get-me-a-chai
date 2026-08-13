# 🚀 Get Me a Chai

> A full-stack creator-support platform where creators can build a public profile and receive financial support from their audience through a simple username-based experience.

**Get Me a Chai** is a full-stack web application built with **Next.js, React, MongoDB, Mongoose, NextAuth, GitHub OAuth, Razorpay, and Tailwind CSS**. The project demonstrates how a real-world product can connect authentication, user profiles, database persistence, server-side operations, payment processing, API routes, and cloud deployment into a single application.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF)](https://razorpay.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-Authentication-black)](https://next-auth.js.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 🌐 Live Demo

### 🔗 Live Application

https://get-me-a-chai-five.vercel.app

### 💻 GitHub Repository

https://github.com/ankit1673/get-me-a-chai

### 👨‍💻 Developer

**Ankit Kumar Tiwari**

- GitHub: https://github.com/ankit1673
- Portfolio: https://ankit1673.github.io/ankit-portfolio/
- LinkedIn: https://www.linkedin.com/in/ankit-kumar-tiwari-130a42303/

---

# ✨ Why I Built This

Many creators need a simple way to let their audience support them financially without building an entire crowdfunding infrastructure themselves.

I built **Get Me a Chai** to explore how a real-world full-stack product can connect:

- Authentication
- User profiles
- Dynamic public pages
- Database persistence
- Server-side business logic
- Payment processing
- API routes
- Third-party OAuth
- Cloud deployment

Rather than building only a static frontend, the project focuses on the complete application lifecycle:

**Authentication → Database → Business Logic → Payment → Persistence → Deployment**

This project helped me work with the boundaries between client-side React components, Next.js server functionality, MongoDB/Mongoose, external authentication, and payment services.

---

# 🎯 Key Features

## 🔐 GitHub Authentication

Users can authenticate using GitHub OAuth through NextAuth.

The authentication flow checks whether a GitHub user already exists and creates a corresponding application user when necessary.

---

## 👤 Creator Profiles

Authenticated users can maintain their creator profile with information such as:

- Name
- Email
- Username
- Profile picture
- Cover picture
- Razorpay configuration

Profile information is persisted in MongoDB.

---

## 🔗 Username-Based Public Profiles

Every creator gets a public page based on their username.

Example:

```text
https://get-me-a-chai-five.vercel.app/ankit1673
