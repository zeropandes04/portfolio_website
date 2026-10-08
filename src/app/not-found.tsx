import Link from "next/link";
import { ArrowLeft } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 md:py-40 text-center">
      <p className="font-mono text-sm text-accent mb-6">404</p>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-fg mb-4">
        Page not found
      </h1>
      <p className="text-muted text-lg mb-10">
        This project doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2 rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Back to home
      </Link>
    </div>
  );
}
