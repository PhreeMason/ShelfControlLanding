"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState("");
  const [bookCount, setBookCount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Waitlist form submitted! (Backend not connected yet)");
  };

  return (
    <section id="waitlist" className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Join the waitlist
          </h2>
          <p className="text-center text-slate-600 mb-8">
            Be among the first to get early access when we launch
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-700"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Biggest deadline challenge (optional)"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-700"
              />
            </div>
            <div>
              <select
                value={bookCount}
                onChange={(e) => setBookCount(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-700 text-slate-600"
              >
                <option value="">How many books are you juggling? (optional)</option>
                <option value="5-10">5-10 books</option>
                <option value="11-20">11-20 books</option>
                <option value="20+">20+ books</option>
                <option value="too-many">Too many to count</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-8 py-4 bg-violet-700 text-white font-semibold rounded-lg hover:bg-violet-800 transition-colors"
            >
              Save My Spot
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
