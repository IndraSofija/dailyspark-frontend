// DailySpark – Frontend starter (Next.js + Tailwind CSS)

import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-100 p-4">
      <Head>
        <title>DailySpark ✨</title>
        <meta name="description" content="Your daily dose of inspiration" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-4">
          Welcome to <span className="text-yellow-500">DailySpark</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your daily dose of inspirational content, made simple.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-2xl shadow-md transition-all">
          Generate Your Spark 🔥
        </button>
      </main>

      <footer className="mt-12 text-sm text-gray-400">© {new Date().getFullYear()} DailySpark</footer>
    </div>
  );
}

// Tailwind CSS is expected to be configured in tailwind.config.js
// with default setup (postcss & autoprefixer).
