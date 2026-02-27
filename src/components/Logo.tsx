export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left Pillar */}
      <polygon points="28,20 40,10 40,40 28,40" />
      {/* Right Pillar */}
      <polygon points="60,10 72,20 72,40 60,40" />
      {/* Center Square */}
      <rect x="44" y="44" width="12" height="12" />
      {/* M Shape */}
      <polygon points="12,44 12,82 28,82 28,60 50,80 72,60 72,82 88,82 88,44 72,44 50,65 28,44" />
    </svg>
  );
}
