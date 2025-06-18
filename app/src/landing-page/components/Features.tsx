interface Feature {
  name: string;
  description: string;
  icon: string;
  href: string;
};

export default function Features() {
  const features = [
    {
      name: 'Real GitHub Tasks for Practice',
      description: 'Start solving actual GitHub issues instead of mock problems. Gain confidence and coding fluency by contributing to open-source projects.',
      icon: '🧠',
      href: '#',
    },
    {
      name: 'Resume That Stands Out',
      description: 'Each completed task becomes a tangible proof of experience you can showcase in resumes and interviews.',
      icon: '📄',
      href: '#',
    },
    {
      name: 'Get Referred by Maintainers',
      description: 'When you contribute to projects, maintainers and collaborators may vouch for you — opening doors to real tech opportunities.',
      icon: '🤝',
      href: '#',
    },
    {
      name: 'Access Paid Tasks',
      description: 'As you grow your portfolio, you unlock access to exclusive paid open-source issues. Get paid while learning and contributing.',
      icon: '💸',
      href: '#',
    },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 dark:bg-slate-900 bg-white dark:bg-grid-white/[0.02] bg-grid-black/[0.05]">
        <div className="absolute pointer-events-none inset-0 dark:bg-slate-900/90 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 mb-8">
            <span className="text-xs text-slate-400">✨ Built for Students & Developers →</span>
          </div>
          
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400 sm:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Start your journey from learning to earning with our comprehensive platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="relative p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="absolute -top-4 -right-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Content */}
                <dt className="text-xl font-semibold leading-7 text-slate-900 dark:text-white mb-4">
                  {feature.name}
                </dt>
                <dd className="text-base leading-7 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </dd>

                {/* Hover effect link */}
                <div className="mt-4 flex items-center text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
