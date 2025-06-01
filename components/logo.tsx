import Image from "next/image";
import Link from "next/link";
import Icon from "../app/icon.png";

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
      <Image
        src={Icon}
        alt="Screenlink"
        className={`rounded-md ${sizeClasses[size]}`}
      />
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]}`}>Screenlink</span>
      )}
    </Link>
  );
}
