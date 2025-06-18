interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: 'Aarav Patel',
      role: 'CS Student, NIT Trichy',
      quote:
        'Before this platform, I only worked on college projects. Now I’ve contributed to real GitHub repos, added them to my resume, and landed two interviews thanks to maintainers recommending me!',
    },
    {
      name: 'Sara Thomas',
      role: 'Frontend Intern, Bangalore',
      quote:
        'I was struggling to stand out as a fresher. Solving good-first-issues gave me something solid to talk about in interviews — plus I even got paid for a couple of tasks!',
    },
    {
      name: 'Neel Roy',
      role: 'Self-taught Dev, Kolkata',
      quote:
        'Getting real-world experience without applying for jobs felt impossible. This made it easy to contribute, build credibility, and grow my portfolio.',
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 dark:bg-slate-900 bg-white dark:bg-grid-white/[0.02] bg-grid-black/[0.05]">
        <div className="absolute pointer-events-none inset-0 dark:bg-slate-900/90 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 mb-8">
            <span className="text-xs text-slate-400">💬 Real Success Stories →</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400 sm:text-5xl leading-tight pb-1">
            From Learning to Earning
          </h2>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            See how students like you transformed their careers through real-world contributions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 group flex flex-col"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                "
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                {t.quote}
              </blockquote>

              {/* Author */}
              <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-4">
                <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {t.role}
                </div>
              </div>

              {/* Decorative gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}