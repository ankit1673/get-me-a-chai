"use client"

import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title = "Login - Get Me A Chai"
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent px-4 py-20 ">
      <section className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-2xl">
            Login to get your fans to support you
          </h1>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-xl   shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
          <div className="grid gap-10 lg:grid-cols-[360px_minmax(1fr,1fr)]">
            <div className="mx-auto w-full max-w-[360px] space-y-6">
              <div className="space-y-4">
                <button className="flex w-full items-center bg-slate-50 text-black justify-start gap-3 rounded-2xl border border-slate-200  px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 text-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M44.5 24.2c0-1.4-.1-2.8-.4-4.1H24v7.7h11.9c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.9 6.6-9.7 6.6-16.0z"
                      fill="#4285F4"
                    />
                    <path
                      d="M24 44.9c6 0 11.0-2.0 14.7-5.5l-7.1-5.6c-2.0 1.3-4.6 2.0-7.6 2.0-5.8 0-10.8-3.9-12.6-9.2H4.9v5.8C8.6 40.8 15.8 44.9 24 44.9z"
                      fill="#34A853"
                    />
                    <path
                      d="M11.4 27.6c-.4-1.4-.7-2.8-.7-4.3 0-1.5.3-2.9.7-4.3V13.2H4.9C2.7 17.3 1.3 21.6 1.3 26.4s1.4 9.1 3.6 13.2l6.5-5.8z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M24 10.1c3.3 0 6.3 1.1 8.6 3.2l6.5-6.5C35.0 3.4 29.9 1 24 1 15.8 1 8.6 5.2 4.9 11.2l6.5 5.8C13.2 13.9 18.2 10.1 24 10.1z"
                      fill="#EB4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button className="flex w-full items-center bg-slate-50 text-black justify-start gap-3 rounded-2xl border border-slate-200  px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 text-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 448 512"
                    fill="#0077B5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M100.28 448H7.4V148.9h92.88zm-46.44-340a53.79 53.79 0 1 1 53.79-53.8 53.79 53.79 0 0 1-53.79 53.8zM447.9 448h-92.68V302.4c0-34.7-12.4-58.4-43.5-58.4-23.7 0-37.9 16-44.2 31.5-2.3 5.5-2.9 13.2-2.9 20.9V448h-92.8s1.2-241.5 0-266.1h92.8v37.7c-0.2 0.3-0.5 0.7-0.7 1h0.7v-1c12.3-19 34.3-46.1 83.4-46.1 60.9 0 106.6 39.8 106.6 125.4V448z" />
                  </svg>
                  Continue with LinkedIn
                </button>

                <button className="flex w-full items-center bg-slate-50 text-black justify-start gap-3 rounded-2xl border border-slate-200  px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 text-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 512 512"
                    fill="#1DA1F2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M459.4 151.7c0 1.9 0 3.8 0 5.7 0 58.2-44.3 125.4-125.4 125.4-24.9 0-48.0-7.3-67.5-19.9 3.4 0.4 7.0 0.6 10.6 0.6 20.5 0 39.3-7.0 54.3-18.7-19.1-0.4-35.2-13.0-40.7-30.4 2.7 0.5 5.5 0.8 8.4 0.8 4.1 0 8.1-0.5 11.8-1.4-20.0-4.0-35.0-21.6-35.0-42.7v-0.5c5.9 3.3 12.7 5.3 19.9 5.6-11.8-7.9-19.5-21.4-19.5-36.6 0-8.1 2.2-15.7 6.1-22.2 21.7 26.8 54.2 44.4 90.9 46.3-0.8-3.2-1.3-6.5-1.3-9.9 0-24.1 19.5-43.7 43.7-43.7 12.6 0 24.0 5.3 32.0 13.9 10.0-2.0 19.4-5.6 27.9-10.7-3.3 10.4-10.4 19.1-19.7 24.6 8.9-1.1 17.4-3.4 25.3-6.8-5.9 8.8-13.3 16.5-21.8 22.7z" />
                  </svg>
                  Continue with Twitter
                </button>

                <button className="flex w-full items-center bg-slate-50 text-black justify-start gap-3 rounded-2xl border border-slate-200  px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 text-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 320 512"
                    fill="#1877F2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M279.14 288l14.22-92.66h-88.91V127.28c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S259.3 0 225.36 0c-73.73 0-121.49 44.93-121.49 127.78v71.56H22.89V288h80.98v224h97.2V288z" />
                  </svg>
                  Continue with Facebook
                </button>

                <button onClick ={()=>{signIn("github")}}className="flex w-full items-center bg-slate-50 text-black justify-start gap-3 rounded-2xl border border-slate-200  px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 text-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="#000000"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.76-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.553 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.806 5.625-5.479 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.896-.015 3.286 0 .32.216.694.825.576C20.565 21.796 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>

                <button className="flex w-full items-center bg-slate-50 text-black justify-start gap-3 rounded-2xl border border-slate-200  px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 text-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="#000000"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.365 1.43c0 1.14-.42 2.23-1.181 3.03-.994 1.044-2.233 1.65-3.506 1.61-.054-1.18.375-2.4 1.067-3.27.767-.974 2.115-1.7 3.301-1.7.097 0 .188.005.277.011zm4.05 13.89c-.05-2.64 1.107-4.64 3.452-6.1-1.286-1.89-3.28-2.88-5.28-2.88-2.24 0-4.35 1.32-5.29 1.32-.95 0-2.4-1.25-3.96-1.25-2.09 0-4.07 1.22-5.16 3.1-2.21 3.8-.57 9.41 1.59 12.51 1.06 1.55 2.32 3.3 3.98 3.24 1.62-.07 2.23-1.06 4.18-1.06 1.95 0 2.46 1.06 4.2 1.02 1.76-.04 2.88-1.58 3.93-3.13 1.25-1.82 1.76-3.59 1.78-3.68-.04-.02-3.36-1.28-3.42-5.07z" />
                  </svg>
                  Continue with Apple
                </button>
              </div>
            </div>

            <div className="hidden rounded-[1.5rem] bg-slate-50 text-black lg:block"></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
