"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_BASE_URL = "http://127.0.0.1:5000";

type User = {
  user_id: string;
  name: string;
  email: string;
  character: string;
  xp: number;
  level: number;
  streak: number;
};

type LeaderboardEntry = {
  name: string;
  xp: number;
  leaderboard_position: number;
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Step 1: Check localStorage for user_id
      const storedUser = localStorage.getItem("finstinct-user");
      if (!storedUser) {
        router.replace("/");
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);

        // Step 2: Verify user_id exists
        if (!parsedUser.user_id) {
          console.error("No user_id found in localStorage");
          router.replace("/");
          return;
        }

        console.log("Fetching profile for user_id:", parsedUser.user_id);

        // Step 3: Fetch profile from Flask backend using user_id
        const profileRes = await fetch(
          `${API_BASE_URL}/api/profile?user_id=${parsedUser.user_id}`
        );

        if (!profileRes.ok) {
          const errorText = await profileRes.text();
          throw new Error(`Failed to fetch profile: ${errorText}`);
        }

        const profileData = await profileRes.json();
        console.log("Profile data received:", profileData);

        if (!isMounted) return;

        // Step 4: Set user state with backend data
        setUser({
          user_id: profileData.id || parsedUser.user_id,
          name: profileData.username || "Player",
          email: profileData.email || parsedUser.email,
          character: profileData.character || "explorer",
          xp: profileData.xp || 0,
          level: profileData.level || 1,
          streak: profileData.streak || 1,
        });

        // Step 5: Fetch leaderboard from backend
        console.log("Fetching leaderboard...");
        const leaderboardRes = await fetch(`${API_BASE_URL}/api/leaderboard`);

        if (!leaderboardRes.ok) {
          const errorText = await leaderboardRes.text();
          throw new Error(`Failed to fetch leaderboard: ${errorText}`);
        }

        const leaderboardData = await leaderboardRes.json();
        console.log("Leaderboard data received:", leaderboardData);

        // Step 6: Format leaderboard data
        // Backend returns: [{username, xp, level}, ...]
        // We need: [{name, xp, leaderboard_position}, ...]
        const formattedLeaderboard: LeaderboardEntry[] = leaderboardData.map(
          (entry: any, index: number) => ({
            name: entry.username || entry.name || "Unknown",
            xp: entry.xp || 0,
            leaderboard_position: index + 1,
          })
        );

        if (isMounted) {
          setLeaderboard(formattedLeaderboard);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Leaderboard error:", err);
        if (isMounted) {
          setError(err.message || "Failed to load leaderboard");
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling to refresh leaderboard every 10 seconds
    const intervalId = setInterval(() => {
      const refreshLeaderboard = async () => {
        try {
          const leaderboardRes = await fetch(`${API_BASE_URL}/api/leaderboard`);
          if (!leaderboardRes.ok) return;

          const leaderboardData = await leaderboardRes.json();
          const formattedLeaderboard: LeaderboardEntry[] = leaderboardData.map(
            (entry: any, index: number) => ({
              name: entry.username || entry.name || "Unknown",
              xp: entry.xp || 0,
              leaderboard_position: index + 1,
            })
          );

          if (isMounted) {
            setLeaderboard(formattedLeaderboard);
          }
        } catch (err) {
          console.error("Failed to refresh leaderboard:", err);
        }
      };

      refreshLeaderboard();
    }, 10000); // Refresh every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []); // Empty array - runs once on mount

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.replace("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Navbar />

      {/* 🏆 Leaderboard Content */}
      <main className="max-w-3xl mx-auto px-6 mt-10">
        <h1 className="text-3xl font-black mb-6 text-center">Leaderboard</h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          See how you stack up against other Finstinct adventurers.
        </p>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur">
          <div className="grid grid-cols-4 px-4 py-3 text-xs font-semibold text-gray-400 border-b border-white/10">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">XP</span>
            <span className="text-right">Badge</span>
          </div>

          <ul>
            {leaderboard.length === 0 ? (
              <li className="px-4 py-8 text-center text-gray-400">
                No players yet. Be the first!
              </li>
            ) : (
              leaderboard.map((entry) => {
                const isCurrentUser = entry.name === user.name;
                return (
                  <li
                    key={entry.leaderboard_position}
                    className={`grid grid-cols-4 px-4 py-3 text-sm items-center ${isCurrentUser
                        ? "bg-yellow-400/5 border-l-4 border-yellow-400"
                        : "border-l-4 border-transparent"
                      }`}
                  >
                    <span className="font-bold text-gray-200">
                      #{entry.leaderboard_position}
                    </span>
                    <span
                      className={`${isCurrentUser ? "text-yellow-300 font-semibold" : "text-gray-200"
                        }`}
                    >
                      {isCurrentUser ? "You" : entry.name}
                    </span>
                    <span className="text-right text-gray-100">
                      {entry.xp} XP
                    </span>
                    <span className="text-right text-xs text-gray-300">
                      {entry.leaderboard_position === 1
                        ? "🥇 Champion"
                        : entry.leaderboard_position === 2
                          ? "🥈 Runner-up"
                          : entry.leaderboard_position === 3
                            ? "🥉 Third"
                            : "⭐ Player"}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
