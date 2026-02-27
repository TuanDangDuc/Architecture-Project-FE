import { useState } from "react";

export default function Logo2({
  className = "w-32 h-32 text-white",
}: {
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
        <polygon points="28,20 40,10 40,40 28,40" />
        <polygon points="60,10 72,20 72,40 60,40" />
        <rect x="44" y="44" width="12" height="12" />
        <polygon points="12,44 12,82 28,82 28,60 50,80 72,60 72,82 88,82 88,44 72,44 50,65 28,44" />
      </svg>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="Mai Huong Architects Logo"
      className={`${className} object-contain filter brightness-0 invert`}
      onError={() => setImgError(true)}
    />
  );
}
