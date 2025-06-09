interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="bg-white dark:bg-boxdark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Real students. Real contributions. Real impact.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-boxdark-2 p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
            >
              <blockquote className="text-gray-700 dark:text-gray-200 text-md italic">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
              </figcaption>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}