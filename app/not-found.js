import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x pb-32 pt-40 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-navy-900">Page not found</h1>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-navy-900 px-6 py-3 font-semibold text-white">Back to home</Link>
    </section>
  );
}
