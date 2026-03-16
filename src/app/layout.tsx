import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { profile } from "@/lib/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} — Product Manager`,
  description: profile.bio,
  openGraph: {
    title: `${profile.name} — Product Manager`,
    description: profile.bio,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-14">{children}</main>
        <footer className="border-t border-neutral-100 py-8 mt-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-neutral-400">
            <span>
              {profile.name} &copy; {new Date().getFullYear()}
            </span>
            <div className="flex items-center gap-4">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-700 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-neutral-700 transition-colors"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
