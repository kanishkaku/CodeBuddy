import { Link } from 'wasp/client/router';

export default function Hero() {
  return (
    <section className="relative isolate px-6 pt-24 sm:pt-28 pb-16 text-center lg:min-h-screen lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Launch Your Coding Career with Real GitHub Tasks 🚀
        </h1>

        <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-600 dark:text-gray-300">
          Solve beginner-friendly GitHub issues. Build your resume, earn referrals from maintainers, and unlock paid task opportunities.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/tasks"
            className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition"
          >
            🔍 Explore Tasks
          </Link>
        </div>
      </div>
    </section>
  );
}
