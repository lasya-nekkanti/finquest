"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function FeedbackPage() {
  const router = useRouter();
  const [levelsFeedback, setLevelsFeedback] = useState<string>("");
  const [gamesFeedback, setGamesFeedback] = useState<string[]>([]);
  const [learningRating, setLearningRating] = useState<number>(0);
  const [openText, setOpenText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if at least one field is filled
  const canSubmit =
    levelsFeedback !== "" ||
    gamesFeedback.length > 0 ||
    learningRating > 0 ||
    openText.trim() !== "";

  const handleGameFeedbackToggle = (option: string) => {
    setGamesFeedback((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call (frontend-only per requirements)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Reset form
    setLevelsFeedback("");
    setGamesFeedback([]);
    setLearningRating(0);
    setOpenText("");
    setIsSubmitting(false);

    // Show success message briefly, then redirect
    alert("Thank you for your feedback! 🎮");
    router.push("/dashboard");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen pt-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Game Feedback
          </h1>
          <p className="text-lg text-gray-300">
            Help us improve your learning experience.
          </p>
        </div>

        <div className="space-y-6">
          {/* Levels Feedback Section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📊</span> Levels Feedback
            </h3>
            <div className="space-y-2">
              {["Too easy", "Balanced", "Too hard"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-white/10 hover:border-green-400/50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="levels"
                    value={option}
                    checked={levelsFeedback === option}
                    onChange={(e) => setLevelsFeedback(e.target.value)}
                    className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-400 focus:ring-2"
                  />
                  <span className="text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Games Feedback Section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎮</span> Games Feedback
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["Fun", "Confusing", "Too long", "Too short", "Challenging"].map(
                (option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-white/10 hover:border-green-400/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={gamesFeedback.includes(option)}
                      onChange={() => handleGameFeedbackToggle(option)}
                      className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400 focus:ring-2"
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Learning Experience Section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⭐</span> Learning Experience
            </h3>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setLearningRating(rating)}
                  className={`text-4xl md:text-5xl transition-transform hover:scale-110 ${
                    learningRating >= rating
                      ? "opacity-100 filter drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                      : "opacity-40 hover:opacity-70"
                  }`}
                  aria-label={`Rate ${rating} out of 5`}
                >
                  {rating <= 2 ? "😞" : rating === 3 ? "😐" : "😊"}
                </button>
              ))}
              {learningRating > 0 && (
                <span className="text-gray-400 text-sm ml-2">
                  {learningRating}/5
                </span>
              )}
            </div>
          </div>

          {/* Open Text Feedback Section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>💬</span> Additional Feedback
            </h3>
            <textarea
              value={openText}
              onChange={(e) => setOpenText(e.target.value)}
              placeholder="Tell us what you liked or what we can improve…"
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`
                flex-1 py-3 px-6 rounded-full font-bold text-base transition-all
                ${
                  canSubmit && !isSubmitting
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-[0_4px_0_#15803d] hover:translate-y-1 hover:shadow-[0_3px_0_#15803d] active:translate-y-2 active:shadow-[0_2px_0_#15803d]"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Submitting...
                </span>
              ) : (
                "Submit Feedback"
              )}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-6 rounded-full font-bold text-base bg-gray-800/50 border border-white/10 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
