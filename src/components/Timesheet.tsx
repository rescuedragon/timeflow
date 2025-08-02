import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  project: string;
  subproject: string;
  description: string;
}

interface TimesheetProps {
  timeEntries: TimeEntry[];
}

// ProgressBar Component
interface ProgressBarProps {
  currentHours: number;
  targetHours?: number;
  color?: string;
  enabled?: boolean;
  className?: string;
}

const ProgressBar = ({
  currentHours,
  targetHours = 8,
  color = '#8B5CF6',
  enabled = false,
  className = ''
}: ProgressBarProps): JSX.Element => {
  const progressPercentage = 100; // Temporarily set to 100% to see animation
  const hours = (currentHours / 3600).toFixed(1);

  const windRef = useRef<HTMLDivElement>(null);
  const [waves, setWaves] = useState<number[]>([]);
  const [boats, setBoats] = useState<{ id: number; top: number; speed: number; type: string; }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate wind effect particles
  useEffect(() => {
    if (!enabled || !windRef.current) return;

    const createWindParticles = () => {
      windRef.current!.innerHTML = '';

      const particleCount = 12;
      const baseSize = 2;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full pointer-events-none';

        const left = Math.random() * progressPercentage;
        const top = Math.random() * 80 + 10;
        const size = Math.random() * baseSize + baseSize;
        const delay = Math.random() * 4;
        const duration = Math.random() * 8 + 6;
        const opacity = Math.random() * 0.3 + 0.05;
        const blur = Math.random() * 3 + 1;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.opacity = `${opacity}`;
        particle.style.filter = `blur(${blur}px)`;
        particle.style.background = `rgba(255, 255, 255, ${opacity})`;
        particle.style.animation = `windFloat ${duration}s ease-in-out ${delay}s infinite`;

        windRef.current!.appendChild(particle);
      }
    };

    createWindParticles();
  }, [enabled, progressPercentage]);

  // Add subtle waves approximately once per minute
  useEffect(() => {
    if (!enabled) return;

    const waveInterval = setInterval(() => {
      setWaves(prev => [...prev, Date.now()]);
      setTimeout(() => {
        setWaves(prev => prev.slice(1));
      }, 3000);
    }, 60000 + Math.random() * 15000);

    return () => clearInterval(waveInterval);
  }, [enabled]);

  // Add mini boats every 15 minutes
  useEffect(() => {
    if (!enabled) return;

    const boatInterval = setInterval(() => {
      const boatTypes = ['sailboat', 'motorboat', 'canoe', 'fish', 'whale', 'shark', 'mermaid', 'turtle', 'buoy', 'jellyfish'];
      const randomType = boatTypes[Math.floor(Math.random() * boatTypes.length)];

      // Distribute across the entire height of the water with more variation
      let top;
      if (['fish', 'whale', 'shark', 'mermaid', 'jellyfish'].includes(randomType)) {
        top = Math.random() * 30 + 50; // 50-80% depth (deeper)
      } else if (randomType === 'turtle') {
        top = Math.random() * 20 + 40; // 40-60% depth (middle)
      } else {
        top = Math.random() * 25 + 20; // 20-45% depth (surface)
      }

      // Vary the speed based on the type
      let speed;
      if (['fish', 'shark'].includes(randomType)) {
        speed = 15 + (Math.random() * 5); // Faster
      } else if (['whale', 'turtle'].includes(randomType)) {
        speed = 25 + (Math.random() * 10); // Slower
      } else {
        speed = 20 + (Math.random() * 8 - 4); // Medium
      }

      setBoats(prev => [...prev, {
        id: Date.now(),
        top,
        speed,
        type: randomType
      }]);
    }, 900000);

    return () => clearInterval(boatInterval);
  }, [enabled]);

  // Remove boats after they complete their journey
  useEffect(() => {
    if (!enabled) return;

    const cleanup = setInterval(() => {
      setBoats(prev => prev.filter(boat => Date.now() - boat.id <= (boat.speed + 6) * 1000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, [enabled]);

  // Calculate muted color for background
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgb = hexToRgb(color);
  const mutedColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;

  const renderBoat = (type: string) => {
    const boatSVGs = {
      sailboat: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <path d="M6 26L28 26C28 26 26 22 24 22L8 22C6 22 6 26 6 26Z" fill="#8B4513" />
          <path d="M8 22L24 22L24 20L8 20Z" fill="#D2691E" />
          <path d="M16 20L16 8L10 16L16 20Z" fill="#FF6B6B" />
          <path d="M16 20L16 6L22 14L16 20Z" fill="#4ECDC4" />
          <path d="M16 6L16 4" stroke="#654321" strokeWidth="1" />
          <circle cx="7" cy="24" r="1" fill="#FFD700" />
          <circle cx="25" cy="24" r="1" fill="#FFD700" />
        </svg>
      ),
      motorboat: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0 18 24;2 18 24;0 18 24;-2 18 24;0 18 24" keyTimes="0;0.25;0.5;0.75;1" dur="4s" repeatCount="indefinite" />
            <path d="M4 22 Q6 24, 8 24 L28 24 Q30 24, 32 22 L28 20 Q26 18, 24 20 L12 20 Q10 18, 8 20 Z" fill="url(#motorboatGradient)" />
            <rect x="14" y="18" width="8" height="4" fill="#FFFFFF" />
            <circle cx="16" cy="20" r="1" fill="#87CEEB" />
            <circle cx="20" cy="20" r="1" fill="#87CEEB" />
            <polygon points="22,18 24,16 26,18" fill="#FF0000" />
          </g>
          <defs>
            <linearGradient id="motorboatGradient" x1="4" y1="24" x2="32" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#2563EB" />
              <stop offset="0.4" stopColor="#2563EB" />
              <stop offset="0.5" stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      ),
      canoe: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <path d="M4 22C4 22 6 18 10 18L26 18C30 18 32 22 32 22C32 24 30 26 26 26L10 26C6 26 4 24 4 22Z" fill="url(#canoeGradient)" />
          <path d="M8 20L28 20C28 20 28 22 28 22L8 22C8 22 8 20 8 20Z" fill="#D2691E" />
          <path d="M14 16L16 10L18 16Z" fill="#CD853F" />
          <path d="M18 16L20 10L22 16Z" fill="#CD853F" />
          <path d="M15 10L21 10" stroke="#8B4513" strokeWidth="1" />
          <defs>
            <linearGradient id="canoeGradient" x1="4" y1="22" x2="32" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B4513" />
              <stop offset="1" stopColor="#A0522D" />
            </linearGradient>
          </defs>
        </svg>
      ),
      fish: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <ellipse cx="18" cy="18" rx="12" ry="6" fill="url(#fishGradient)" />
            <path d="M14 16 L10 14 L10 18 Z" fill="#FF6B35" />
            <path d="M22 16 L26 14 L26 18 Z" fill="#FF6B35" />
            <path d="M18 12 L20 10 L22 12 Z" fill="#FF6B35" />
            <circle cx="14" cy="16" r="1.5" fill="#FFFFFF" />
            <circle cx="14" cy="16" r="0.5" fill="#000000" />
            <g transform="translate(30,18)">
              <animateTransform attributeName="transform" type="rotate" values="0;15;0;-15;0" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" additive="sum" />
              <polygon points="0,0 4,-2 4,2" fill="#FF6B35" />
            </g>
          </g>
          <defs>
            <linearGradient id="fishGradient" x1="6" y1="18" x2="30" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF4500" />
              <stop offset="0.4" stopColor="#FF6B35" />
              <stop offset="0.5" stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#FF8C42" />
              <stop offset="1" stopColor="#FF8C42" />
            </linearGradient>
          </defs>
        </svg>
      ),
      whale: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <path d="M32 20C32 24 28 28 24 28L16 28C12 28 8 24 8 20C8 16 12 12 16 12L24 12C28 12 32 16 32 20Z" fill="url(#whaleGradient)" />
            <path d="M10 18C10 18 12 16 14 16C16 16 18 18 18 18" fill="#4A90E2" />
            <circle cx="26" cy="18" r="1" fill="#FFFFFF" />
            <path d="M14 10L16 16L12 16Z" fill="#4A90E2" />
            <path d="M32 20L34 18L34 22Z" fill="#87CEEB" />
            <circle cx="18" cy="14" r="2" fill="#87CEEB" />
            <circle cx="24" cy="14" r="1" fill="#87CEEB">
              <animate attributeName="cy" from="14" to="10" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="25" cy="14" r="1" fill="#87CEEB">
              <animate attributeName="cy" from="14" to="10" dur="1s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite" />
            </circle>
          </g>
          <defs>
            <linearGradient id="whaleGradient" x1="8" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A90E2" />
              <stop offset="1" stopColor="#87CEEB" />
            </linearGradient>
          </defs>
        </svg>
      ),
      shark: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <path d="M32 18C32 22 28 26 24 26L12 26C8 26 4 22 4 18C4 14 8 10 12 10L24 10C28 10 32 14 32 18Z" fill="url(#sharkGradient)" />
          <path d="M18 10L20 6L22 10" fill="#708090" />
          <path d="M24 18L28 16L28 20Z" fill="#708090" />
          <circle cx="14" cy="20" r="0.5" fill="#FFFFFF" />
          <path d="M12 18L8 16L8 20Z" fill="#708090" />
          <defs>
            <linearGradient id="sharkGradient" x1="4" y1="18" x2="32" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#708090" />
              <stop offset="1" stopColor="#B0C4DE" />
            </linearGradient>
          </defs>
        </svg>
      ),
      mermaid: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,1;0,0;0,-1;0,0" dur="3s" repeatCount="indefinite" />
            <path d="M22 22C22 24 20 26 18 26C16 26 14 24 14 22C14 20 16 18 18 18C20 18 22 20 22 22Z" fill="#20B2AA" />
            <path d="M24 26C24 28 22 30 20 30L16 30C14 30 12 28 12 26C12 24 14 22 18 22C22 22 24 24 24 26Z" fill="url(#mermaidGradient)" />
            <path d="M18 24L14 28L18 26L22 28Z" fill="#20B2AA" />
            <path d="M16 20L18 16L20 20" fill="#FFB6C1" />
            <circle cx="17" cy="18" r="0.5" fill="#FFFFFF" />
            <circle cx="19" cy="18" r="0.5" fill="#FFFFFF" />
            <path d="M16 14C16 14 18 12 20 14" stroke="#FFB6C1" strokeWidth="1" />
          </g>
          <defs>
            <linearGradient id="mermaidGradient" x1="12" y1="26" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#48D1CC" />
              <stop offset="1" stopColor="#20B2AA" />
            </linearGradient>
          </defs>
        </svg>
      ),
      turtle: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <ellipse cx="18" cy="20" rx="12" ry="8" fill="url(#turtleGradient)" />
            <path d="M10 20L8 22L10 24" fill="#228B22" />
            <path d="M26 20L28 22L26 24" fill="#228B22" />
            <circle cx="18" cy="14" r="3" fill="#228B22" />
            <circle cx="17" cy="13" r="0.5" fill="#FFFFFF" />
            <circle cx="19" cy="13" r="0.5" fill="#FFFFFF" />
            <path d="M14 18L16 16L18 18L20 16L22 18" stroke="#006400" strokeWidth="1" />
            <path d="M12 20L14 22L16 20" stroke="#006400" strokeWidth="1" />
            <path d="M20 20L22 22L24 20" stroke="#006400" strokeWidth="1" />
          </g>
          <defs>
            <linearGradient id="turtleGradient" x1="6" y1="20" x2="30" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#228B22" />
              <stop offset="1" stopColor="#32CD32" />
            </linearGradient>
          </defs>
        </svg>
      ),
      buoy: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0;0,2;0,0" dur="3s" repeatCount="indefinite" />
            <ellipse cx="18" cy="22" rx="4" ry="6" fill="url(#buoyGradient)" />
            <ellipse cx="18" cy="18" rx="4" ry="2" fill="#FFFFFF" />
            <ellipse cx="18" cy="26" rx="4" ry="2" fill="#FFFFFF" />
            <path d="M16 14L18 10L20 14" stroke="#FF0000" strokeWidth="1" />
            <circle cx="18" cy="28" r="2" fill="#4169E1" />
            <path d="M18 30L18 34" stroke="#4169E1" strokeWidth="1" />
          </g>
          <defs>
            <linearGradient id="buoyGradient" x1="14" y1="22" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF4500" />
            </linearGradient>
          </defs>
        </svg>
      ),
      jellyfish: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <ellipse cx="18" cy="16" rx="8" ry="6" fill="url(#jellyfishGradient)" opacity="0.8">
              <animate attributeName="ry" values="6;7;6;5;6" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <path d="M12 22C12 22 14 26 14 30" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8" />
            <path d="M16 22C16 22 16 28 18 32" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8" />
            <path d="M20 22C20 22 20 28 18 32" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8" />
            <path d="M24 22C24 22 22 26 22 30" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8" />
            <circle cx="16" cy="14" r="1" fill="#FFFFFF" opacity="0.6" />
            <circle cx="20" cy="14" r="1" fill="#FFFFFF" opacity="0.6" />
          </g>
          <defs>
            <linearGradient id="jellyfishGradient" x1="10" y1="16" x2="26" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF69B4" />
              <stop offset="1" stopColor="#FFB6C1" />
            </linearGradient>
          </defs>
        </svg>
      )
    };

    return boatSVGs[type] || boatSVGs.sailboat;
  };

  if (!enabled) {
    return (
      <div className={`mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in backdrop-blur-sm overflow-hidden relative ${className}`}>
        <div className="flex items-center justify-between relative z-10 rounded-2xl overflow-hidden">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Time Today</div>
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{hours} hrs</div>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 dark:border-gray-700 overflow-hidden">
              <div className="text-2xl font-bold text-white">{Math.round(parseFloat(hours))}</div>
            </div>
          </div>
        </div>
      </div>
    ) as JSX.Element;
  }

  return (
    <div
      ref={containerRef}
      className={`mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in relative backdrop-blur-sm overflow-hidden min-h-[180px] ${className}`}
      style={{
        isolation: 'isolate',
        borderRadius: '1rem'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" />

      <div
        className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-1000 ease-out"
        style={{
          width: `${progressPercentage}%`,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        }}
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `linear-gradient(135deg, ${mutedColor} 0%, ${color} 100%)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,40 C20,20 40,60 60,30 C80,60 100,20 100,40 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
            backgroundSize: '200% 100%',
            animation: 'waveMove 15s ease-in-out infinite alternate'
          }}
        />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,60 C15,40 35,70 50,50 C65,70 85,40 100,60 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
            backgroundSize: '150% 100%',
            animation: 'waveMove 20s ease-in-out infinite alternate'
          }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C10,30 30,70 50,50 C70,70 90,30 100,50 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
            backgroundSize: '250% 100%',
            animation: 'waveMove 18s ease-in-out infinite alternate-reverse'
          }}
        />

        <div ref={windRef} className="absolute inset-0" />

        <div
          className="absolute top-0 left-0 w-full h-20 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)`,
            opacity: 0.15,
            mixBlendMode: 'overlay'
          }}
        />

        {boats.map(boat => (
          <div
            key={boat.id}
            className="absolute pointer-events-none"
            style={{
              top: `${boat.top}%`,
              left: '0%',
              animation: `${boat.type === 'fish' || boat.type === 'jellyfish' ? 'fishSwim' : 'boatFloat'} ${boat.speed}s linear forwards, ${boat.type === 'buoy' ? 'buoyBob' : boat.type === 'jellyfish' ? 'jellyfishFloat' : 'boatBob'} 3s ease-in-out infinite`,
              zIndex: 15,
              width: '30px',
              height: '30px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          >
            {renderBoat(boat.type)}
          </div>
        ))}
      </div>

      <div
        className="absolute top-0 bottom-0 transition-all duration-1000 ease-out"
        style={{
          left: `${progressPercentage}%`,
          width: '2px',
          marginLeft: '-1px',
          zIndex: 10,
          background: `linear-gradient(to bottom, transparent, ${color} 20%, ${color} 80%, transparent)`,
          boxShadow: `0 0 12px ${mutedColor}`
        }}
      />

      <div
        className="absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-out"
        style={{
          width: `${progressPercentage}%`,
          background: `linear-gradient(90deg, transparent, ${color})`,
          zIndex: 5
        }}
      />

      <div className="absolute top-4 left-4 z-20">
        <button
          className="backdrop-blur-sm rounded-xl px-4 py-3 shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(34, 99, 235, 0.9) 100%)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(147, 51, 234, 1) 0%, rgba(34, 99, 235, 1) 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(34, 99, 235, 0.9) 100%)';
          }}
          disabled={false}
          onClick={() => {
            const allTypes = [
              'sailboat', 'motorboat', 'canoe', 'buoy', 'yacht', 'submarine',
              'turtle', 'starfish', 'seahorse', 'crab', 'seaweed',
              'fish', 'whale', 'shark', 'mermaid', 'jellyfish', 'dolphin', 'octopus', 'sunfish',
              'seagull', 'pelican', 'albatross'
            ];

            const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
            let top, speed;

            if (['seagull', 'pelican', 'albatross'].includes(randomType)) {
              top = Math.random() * 15 + 5;
              speed = 15 + (Math.random() * 10);
            } else if (['fish', 'whale', 'shark', 'mermaid', 'jellyfish', 'dolphin', 'octopus', 'sunfish'].includes(randomType)) {
              top = Math.random() * 30 + 50;
              speed = ['jellyfish', 'octopus'].includes(randomType) ? 30 + (Math.random() * 15) : 15 + (Math.random() * 5);
            } else if (['turtle', 'starfish', 'seahorse', 'crab', 'seaweed'].includes(randomType)) {
              top = Math.random() * 20 + 40;
              speed = 25 + (Math.random() * 10);
            } else {
              top = Math.random() * 25 + 20;
              speed = 20 + (Math.random() * 8 - 4);
            }

            setBoats(prev => [...prev, {
              id: Date.now(),
              top,
              speed,
              type: randomType
            }]);
          }}
        >
          <div className="text-3xl font-bold text-white tracking-tight">{hours} hrs</div>
        </button>
      </div>

      {waves.map((id) => (
        <div
          key={id}
          className="absolute bottom-0 left-0 w-full h-12 pointer-events-none"
          style={{
            animation: `waveRipple 3s ease-out`,
            background: `radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
            zIndex: 15
          }}
        />
      ))}

      <style>{`
        @keyframes waveMove {
          0% { background-position-x: 200%; }
          100% { background-position-x: 0%; }
        }
        
        @keyframes windFloat {
          0% { 
            transform: translate(0, 0);
            opacity: 0.05;
          }
          30% { 
            transform: translate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 40 + 15}px, -${Math.random() * 15 + 5}px);
            opacity: 0.25;
          }
          70% { 
            transform: translate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 50 + 20}px, -${Math.random() * 25 + 10}px);
            opacity: 0.1;
          }
          100% { 
            transform: translate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 60 + 30}px, -${Math.random() * 35 + 15}px);
            opacity: 0;
          }
        }
        
        @keyframes waveRipple {
          0% {
            opacity: 0.5;
            transform: translateY(0) scale(1, 0.2);
          }
          30% {
            opacity: 0.7;
            transform: translateY(-10px) scale(1.2, 0.5);
          }
          60% {
            opacity: 0.4;
            transform: translateY(-20px) scale(1.5, 0.8);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(2, 1);
          }
        }
        
        @keyframes boatFloat {
          0% { 
            left: -5%;
            opacity: 0;
            transform: translateY(0) rotate(0deg);
          }
          5% { 
            opacity: 1;
          }
          25% {
            transform: translateY(-12px) rotate(-4deg);
          }
          40% {
            transform: translateY(8px) rotate(3deg);
          }
          55% {
            transform: translateY(-16px) rotate(-7deg);
          }
          70% {
            transform: translateY(12px) rotate(5deg);
          }
          85% {
            transform: translateY(-8px) rotate(-3deg);
          }
          95% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% { 
            left: 100%;
            opacity: 0;
            transform: translateY(0) rotate(0deg);
          }
        }
        
        @keyframes fishSwim {
          0% { 
            left: -5%;
            opacity: 0;
            transform: translateY(0) rotate(0deg) scale(0.8);
          }
          5% { 
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
          15% { 
            transform: translateY(-18px) rotate(-8deg) scale(1.1);
          }
          30% { 
            transform: translateY(12px) rotate(5deg) scale(0.9);
          }
          45% { 
            transform: translateY(-22px) rotate(-10deg) scale(1.2);
          }
          60% { 
            transform: translateY(18px) rotate(7deg) scale(0.8);
          }
          75% { 
            transform: translateY(-12px) rotate(-5deg) scale(1);
          }
          90% {
            transform: translateY(6px) rotate(3deg) scale(0.9);
          }
          95% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
          100% { 
            left: 100%;
            opacity: 0;
            transform: translateY(0) rotate(0deg) scale(0.8);
          }
        }
        
        @keyframes buoyBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          15% { transform: translateY(-8px) rotate(-3deg); }
          35% { transform: translateY(5px) rotate(1deg); }
          65% { transform: translateY(-6px) rotate(2deg); }
          85% { transform: translateY(3px) rotate(-1deg); }
        }
        
        @keyframes boatBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          20% { transform: translateY(-6px) rotate(-3deg); }
          40% { transform: translateY(3px) rotate(1deg); }
          60% { transform: translateY(-4px) rotate(2deg); }
          80% { transform: translateY(2px) rotate(-1deg); }
        }
        
        @keyframes jellyfishFloat {
          0%, 100% { 
            transform: translateY(0) scale(1);
          }
          25% { 
            transform: translateY(-5px) scale(1.08);
          }
          50% { 
            transform: translateY(3px) scale(0.95);
          }
          75% { 
            transform: translateY(-3px) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
};

// Timesheet Component
const Timesheet: React.FC<TimesheetProps> = ({ timeEntries }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate total hours for progress bar
  const calculateTotalHours = () => {
    const today = new Date().toDateString();
    const todayEntries = timeEntries.filter(entry => entry.date === today);

    let totalMinutes = 0;
    todayEntries.forEach(entry => {
      const [hours, minutes, seconds] = entry.totalTime.split(':').map(Number);
      totalMinutes += hours * 60 + minutes + Math.round(seconds / 60);
    });

    return totalMinutes / 60; // Convert to hours
  };

  const totalHours = calculateTotalHours();
  const progressPercentage = 100; // Temporarily set to 100% to see animation

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayEntries = () => {
    const dateString = currentDate.toDateString();
    return timeEntries.filter(entry => entry.date === dateString);
  };

  const getWeekEntries = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });
  };

  const aggregateWeeklyData = () => {
    const weekEntries = getWeekEntries();
    const projectTotals: { [key: string]: number } = {};

    weekEntries.forEach(entry => {
      const [hours, minutes] = entry.totalTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const projectKey = `${entry.project} - ${entry.subproject}`;

      if (!projectTotals[projectKey]) {
        projectTotals[projectKey] = 0;
      }
      projectTotals[projectKey] += totalMinutes;
    });

    return Object.entries(projectTotals).map(([project, minutes]) => ({
      project,
      totalTime: `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}:00`
    }));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="h-full flex flex-col animate-fade-up max-w-6xl mx-auto p-4">
      {/* Premium Progress Bar Section */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
        <div className="relative">
          <ProgressBar
            currentHours={totalHours * 3600}
            enabled={true}
            color="#0EA5E9"
            className="rounded-3xl shadow-2xl border-0"
          />
        </div>
      </div>

      {/* Single Merged Container */}
      <Card className="flex-1 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden min-h-[120%]">
        <div className="p-8">
          {/* Premium View Toggle */}
          <div className="flex bg-gradient-to-r from-slate-100/80 to-slate-50/80 rounded-xl p-1.5 mb-6 shadow-sm border border-slate-200/50">
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              onClick={() => setViewMode('weekly')}
              className={`flex-1 rounded-lg font-semibold py-2.5 px-4 transition-all duration-300 ${viewMode === 'weekly'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:shadow-lg hover:from-purple-600 hover:to-blue-600'
                : 'text-slate-600 hover:bg-white/80 hover:shadow-sm hover:text-slate-700'
                }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Weekly View
            </Button>
            <Button
              variant={viewMode === 'daily' ? 'default' : 'ghost'}
              onClick={() => setViewMode('daily')}
              className={`flex-1 rounded-lg font-semibold py-2.5 px-4 transition-all duration-300 ${viewMode === 'daily'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:shadow-lg hover:from-purple-600 hover:to-blue-600'
                : 'text-slate-600 hover:bg-white/80 hover:shadow-sm hover:text-slate-700'
                }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Daily View
            </Button>
          </div>

          {/* Enhanced Date Navigation */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {viewMode === 'daily' ? 'Daily Timesheet' : 'Weekly Summary'}
              </h3>
              {viewMode === 'weekly' && (() => {
                const startOfWeek = new Date(currentDate);
                const dayOfWeek = startOfWeek.getDay();
                const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                startOfWeek.setDate(currentDate.getDate() + mondayOffset);
                
                let totalWeekMinutes = 0;
                for (let i = 0; i < 7; i++) {
                  const day = new Date(startOfWeek);
                  day.setDate(startOfWeek.getDate() + i);
                  const dayEntries = timeEntries.filter(entry => entry.date === day.toDateString());
                  dayEntries.forEach(entry => {
                    const [hours, minutes] = entry.totalTime.split(':').map(Number);
                    totalWeekMinutes += hours * 60 + minutes;
                  });
                }
                const totalWeekHours = (totalWeekMinutes / 60).toFixed(1);
                
                return (
                  <div className="text-sm text-slate-600">
                    Hours this week: <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {totalWeekHours} hours
                    </span>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('prev')}
                className="w-10 h-10 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border-0 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </Button>

              <div className="text-center min-w-[240px] py-2 px-4 bg-gradient-to-r from-slate-50/80 to-slate-100/80 rounded-lg border border-slate-200/50">
                <div className="font-semibold text-base text-slate-800">
                  {viewMode === 'daily' ? formatDate(currentDate) :
                    `Week of ${formatDate(new Date(currentDate.getTime() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1) * 24 * 60 * 60 * 1000))}`}
                </div>
                {isToday(currentDate) && viewMode === 'daily' && (
                  <Badge className="mt-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm text-xs">
                    Today
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('next')}
                className="w-10 h-10 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border-0 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </Button>
            </div>
          </div>

          {/* Enhanced Time Entries Content */}
          <div>
            {viewMode === 'daily' ? (
              <div className="space-y-4">
                {getDayEntries().length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-slate-50/80 to-slate-100/80 rounded-2xl border border-slate-200/50">
                    <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Clock className="w-10 h-10 text-slate-500" />
                    </div>
                    <p className="text-xl font-bold text-slate-700 mb-2">No time entries for this day</p>
                    <p className="text-slate-500 font-medium">Start tracking time to see entries here</p>
                  </div>
                ) : (
                  getDayEntries().map((entry) => (
                    <Card key={entry.id} className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200/50 font-semibold px-3 py-1">
                              {entry.project}
                            </Badge>
                            <Badge className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300/50 font-semibold px-3 py-1">
                              {entry.subproject}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-slate-600 mb-2">
                            <span className="font-mono bg-slate-100 px-3 py-1 rounded-xl">{entry.startTime} - {entry.endTime}</span>
                            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-mono">{entry.totalTime}</span>
                          </div>
                          {entry.description && (
                            <p className="text-slate-600 mt-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/50">{entry.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Weekly Calendar Grid */}
                <div className="grid grid-cols-7 gap-x-4 gap-y-3">
                  {(() => {
                    const startOfWeek = new Date(currentDate);
                    // Calculate Monday as start of week
                    const dayOfWeek = startOfWeek.getDay();
                    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday (0), go back 6 days, otherwise go to Monday
                    startOfWeek.setDate(currentDate.getDate() + mondayOffset);
                    
                    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const days = [];
                    
                    for (let i = 0; i < 7; i++) {
                      const day = new Date(startOfWeek);
                      day.setDate(startOfWeek.getDate() + i);
                      
                      // Calculate hours for this day
                      const dayEntries = timeEntries.filter(entry => entry.date === day.toDateString());
                      let totalMinutes = 0;
                      dayEntries.forEach(entry => {
                        const [hours, minutes] = entry.totalTime.split(':').map(Number);
                        totalMinutes += hours * 60 + minutes;
                      });
                      const dayHours = (totalMinutes / 60).toFixed(1);
                      
                      const isToday = day.toDateString() === new Date().toDateString();
                      const isWeekend = i === 5 || i === 6; // Saturday (5) or Sunday (6)
                      
                      days.push(
                        <Card 
                          key={i} 
                          className={`py-3 px-2 backdrop-blur-sm border rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
                            isWeekend 
                              ? 'bg-slate-100/40 border-slate-300/30 opacity-60' 
                              : 'bg-slate-50/10 border-slate-200/50'
                          } ${
                            isToday && !isWeekend ? 'ring-2 ring-blue-400/50 bg-gradient-to-br from-blue-50/60 to-purple-50/60' : ''
                          }`}
                        >
                          <div className="text-center">
                            <div className={`text-base font-medium mb-1 ${
                              isWeekend ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {weekDays[i]}
                            </div>
                            <div className={`text-xl font-bold mb-1 ${
                              isToday && !isWeekend ? 'text-blue-600' : 
                              isWeekend ? 'text-slate-400' : 'text-slate-800'
                            }`}>
                              {day.getDate()}
                            </div>
                            <div className={`text-xs mb-2 ${
                              isWeekend ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {day.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                            <div className={`text-sm font-medium ${
                              isWeekend 
                                ? 'text-slate-400'
                                : parseFloat(dayHours) > 0 
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                                  : 'text-slate-400'
                            }`}>
                              {dayHours}h
                            </div>
                          </div>
                        </Card>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Timesheet;