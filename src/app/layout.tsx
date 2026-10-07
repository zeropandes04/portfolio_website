import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { profile } from "@/lib/profile";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-24">
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-muted">
            <span>
              &copy; {new Date().getFullYear()} {profile.name}
            </span>
            <div className="flex items-center gap-6">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg transition-colors"
              >
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
