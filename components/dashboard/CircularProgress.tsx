"use client";

type CircularProgressProps = {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
};

/**
 * Calculate minimum XP required to reach a level
 * Formula: (level - 1) * 100
 * Level 1: 0 XP, Level 2: 100 XP, Level 3: 200 XP, etc.
 */
function calculateXPForLevel(level: number): number {
  return (level - 1) * 100;
}

export default function CircularProgress({
  currentLevel,
  currentXP,
  xpForNextLevel,
}: CircularProgressProps) {
  const xpForCurrentLevel = calculateXPForLevel(currentLevel);
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));

  // Calculate circumference for SVG circle (radius = 45, so circumference ≈ 283)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circular Progress Indicator */}
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-800"
          />
          {/* Progress circle with glow effect */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-yellow-400 transition-all duration-700 ease-out drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
            style={{
              filter: progressPercentage > 0 ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))' : 'none'
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white transition-all duration-300">
            Level {currentLevel}
          </span>
          <span className="text-xs text-gray-400 transition-all duration-300">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>

      {/* Progress details */}
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-yellow-400 font-bold transition-all duration-300">
            {xpProgress} / {xpNeeded} XP
          </span>
        </div>
        <p className="text-xs text-gray-400 text-center transition-all duration-300">
          {xpNeeded - xpProgress > 0
            ? `${Math.round(xpNeeded - xpProgress)} XP until Level ${currentLevel + 1}`
            : `Level ${currentLevel} Complete! 🎉`
          }
        </p>
      </div>
    </div>
  );
}

