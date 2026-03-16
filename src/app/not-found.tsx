import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 text-center">
      <p className="text-6xl mb-6">🔍</p>
      <h1 className="text-3xl font-bold text-neutral-900 mb-3">
        Page not found
      </h1>
      <p className="text-neutral-500 mb-8">
        This project doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
