import React, { useRef, useState } from 'react';

interface FloatCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt degrees (default 6)
  elevation?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const FloatCard: React.FC<FloatCardProps> = ({
  children,
  className = '',
  depth = 6,
  elevation = 'md',
  interactive = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(null);
  };

  const elevationClasses = {
    sm: 'shadow-[0_4px_20px_rgba(24,26,31,0.04)] hover:shadow-[0_8px_30px_rgba(24,26,31,0.08)]',
    md: 'shadow-[0_8px_30px_rgba(24,26,31,0.06)] hover:shadow-[0_16px_40px_rgba(24,26,31,0.1)]',
    lg: 'shadow-[0_12px_40px_rgba(24,26,31,0.08)] hover:shadow-[0_24px_50px_rgba(24,26,31,0.14)]',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactive
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          : undefined,
        transition: 'transform 0.18s ease-out, box-shadow 0.25s ease',
      }}
      className={`relative overflow-hidden rounded-2xl bg-white border border-[#EBE4DC] transition-all duration-300 ${elevationClasses[elevation]} ${className}`}
    >
      {glarePos && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-20"
          style={{
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.8), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
};
