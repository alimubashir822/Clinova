"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ScoreRing({ score, size = 60, strokeWidth = 5 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  let strokeColor = "stroke-destructive";
  let glowColor = "shadow-destructive/20";
  if (score >= 90) {
    strokeColor = "stroke-accent";
    glowColor = "shadow-accent/20";
  } else if (score >= 70) {
    strokeColor = "stroke-yellow-500";
    glowColor = "shadow-yellow-500/20";
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Ring */}
        <circle
          className="text-muted/20"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Foreground Progress Ring */}
        <circle
          className={`transition-all duration-1000 ease-out ${strokeColor}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Inner Score Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold tracking-tight">
          {score}%
        </span>
      </div>
    </div>
  );
}
