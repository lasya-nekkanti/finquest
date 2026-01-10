"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { signup } from "@/lib/api";

const characters = [
  { id: "explorer", label: "Explorer", image: "/characters/explorer.png" },
  { id: "strategist", label: "Strategist", image: "/characters/strategist.png" },
  { id: "dreamer", label: "Dreamer", image: "/characters/dreamer.png" },
  { id: "realist", label: "Realist", image: "/characters/realist.png" },
];

const features = [
  {
    icon: "💰",
    title: "Budgeting & Expense Management",
    description: "Master smart spending through interactive games",
  },
  {
    icon: "📈",
    title: "Investing & Savings Simulations",
    description: "Learn investment strategies in risk-free scenarios",
  },
  {
    icon: "💳",
    title: "Credit, Debt & Decision-Making",
    description: "Navigate financial challenges with confidence",
  },
  {
    icon: "🏆",
    title: "XP, Levels & Leaderboards",
    description: "Level up your finance skills and compete with friends",
  },
];

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [character, setCharacter] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Auto-redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("finstinct-user");
    if (storedUser) {
      router.replace("/dashboard");
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) return null; // prevent flicker

  const canStart = Boolean(name && email && password && character);

  const handleStart = async () => {
    if (!canStart || loading) return;

    setLoading(true);
    setError(null);

    try {
      const streak = 1;
      const { user_id } = await signup(email, password, name, character!, streak);
      
      // Store user data in localStorage
      const user = {
        user_id,
        name,
        email,
        character: character!,
        xp: 0,
        streak: 1,
        lastLoginDate: new Date().toISOString(),
      };

      localStorage.setItem("finstinct-user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create account"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-7xl">
        {/* Two-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Value Proposition & Features */}
          <div className="space-y-8 animate-fade-in">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Learn Finance Through
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400">
                  Interactive Games
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Master real-world money skills by playing engaging mini-games. 
                Earn XP, level up, build streaks, and compete on leaderboards, all while 
                learning budgeting, investing, and financial decision-making.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-5 hover:border-green-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20 animate-slide-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl md:text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1 text-sm md:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <span>Earn XP & Level Up</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">🔥</span>
                <span>Build Streaks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">🎮</span>
                <span>Interactive Learning</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sign Up Form */}
          <div className="w-full max-w-xl lg:max-w-none">
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/10">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-black text-center mb-2">
                Finance Quest
              </h2>
              <p className="text-center text-gray-300 mb-6 md:mb-8">
                Start your journey today
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm mb-1 text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a secure password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                />
                <p className="mt-1 text-xs text-gray-400">
                  This is just for this device; do not reuse important passwords.
                </p>
              </div>

              {/* Character Selection */}
              <h3 className="text-lg font-bold mb-4 text-center text-gray-200">
                Choose Your Character
              </h3>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {characters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCharacter(c.id)}
                    className={`
                      rounded-2xl p-3 md:p-4 flex flex-col items-center gap-2 md:gap-3
                      border-2 transition-all duration-200
                      ${
                        character === c.id
                          ? "border-green-400 bg-green-400/10 scale-105 shadow-lg shadow-green-400/30"
                          : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/30"
                      }
                    `}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-800/50">
                      <Image
                        src={c.image}
                        alt={c.label}
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    </div>

                    <span className="font-bold text-sm md:text-base">{c.label}</span>
                  </button>
                ))}
              </div>

              {/* Start Button */}
              <button
                onClick={handleStart}
                disabled={!canStart || loading}
                className={`
                  w-full py-4 rounded-full font-extrabold text-lg transition-all mb-4
                  ${
                    canStart && !loading
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-[0_6px_0_#15803d] hover:translate-y-1 hover:shadow-[0_4px_0_#15803d] active:translate-y-2 active:shadow-[0_2px_0_#15803d]"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Creating Account...
                  </span>
                ) : (
                  "Start Adventure 🚀"
                )}
              </button>

              {/* Login link */}
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
