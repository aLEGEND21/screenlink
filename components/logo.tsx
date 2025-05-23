import { Monitor } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center justify-center rounded-md bg-primary p-1 text-primary-foreground">
        <Monitor className={sizeClasses[size]} />
      </div>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]}`}>Screenlink</span>
      )}
    </Link>
  );
}
