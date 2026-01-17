import Link from "next/link";
import { LANDING_CONTENT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* App Name and Tagline */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {LANDING_CONTENT.footer.appName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {LANDING_CONTENT.footer.tagline}
            </p>
          </div>

          {/* Links */}
          {LANDING_CONTENT.footer.links.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {LANDING_CONTENT.footer.links.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            {LANDING_CONTENT.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
