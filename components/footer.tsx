import { Logo } from "@/components/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background w-full border-t">
      <div className="flex w-full justify-center px-4">
        <div className="max-w-7xl py-8 text-center">
          <div className="grid grid-cols-1 justify-items-center gap-3">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm">
              Screenlink provides simple, secure screen sharing for everyone.
              Share your screen instantly with just a click.
            </p>
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Made with ❤️ by{" "}
              <Link
                href="https://github.com/aLEGEND21"
                className="text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                Arnav
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
