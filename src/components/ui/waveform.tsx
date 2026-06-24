"use client";

import { useEffect, useRef } from "react";

interface WaveformProps {
  isRecording: boolean;
  audioAnalyser?: AnalyserNode | null;
}

export default function Waveform({ isRecording }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    
    // Draw static waves when not recording
    if (!isRecording) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(100, 116, 139, 0.4)"; // muted color
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      // Draw a subtle flat wave
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.05) * 2;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Draw active animated waves when recording
    let phase = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.15;
      
      // We will draw 3 overlapping waves with different opacity and phase offsets
      const waves = [
        { amplitude: 18, frequency: 0.03, speed: 0.1, color: "rgba(13, 148, 136, 0.8)", lineWidth: 2 },
        { amplitude: 10, frequency: 0.05, speed: -0.15, color: "rgba(99, 102, 241, 0.5)", lineWidth: 1.5 },
        { amplitude: 6, frequency: 0.08, speed: 0.05, color: "rgba(20, 184, 166, 0.3)", lineWidth: 1 }
      ];
      
      waves.forEach((wave) => {
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        
        for (let x = 0; x < width; x++) {
          // Draw wave centered vertically
          const activePhase = phase * wave.speed;
          const y = height / 2 + Math.sin(x * wave.frequency + activePhase) * wave.amplitude * (Math.sin(x/width * Math.PI) + 0.1);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  return (
    <div className="relative w-full h-24 bg-secondary/20 rounded-xl overflow-hidden border border-border/50 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
      {!isRecording && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Scribe Idle
          </span>
        </div>
      )}
    </div>
  );
}
