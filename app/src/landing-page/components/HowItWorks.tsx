export default function HowItWorks() {
  const steps = [
    {
      icon: '🧭',
      title: '1. Find Beginner-Friendly Tasks',
      description: 'Use smart filters to discover open GitHub issues based on language, difficulty, and type. Perfect for students getting started.',
      gradient: 'from-blue-500/20 via-blue-500/10 to-blue-500/5',
      iconBg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: '🛠️',
      title: '2. Solve & Submit Pull Requests',
      description: 'Fork the repo, solve the issue, and submit a pull request just like real developers do. Get feedback and grow your skills.',
      gradient: 'from-purple-500/20 via-purple-500/10 to-purple-500/5',
      iconBg: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: '💼',
      title: '3. Earn Referrals & Paid Tasks',
      description: 'As you contribute more, unlock paid issues and referral opportunities from maintainers and companies hiring.',
      gradient: 'from-green-500/20 via-green-500/10 to-green-500/5',
      iconBg: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
  ];

  return (
    <section id="howitworks" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.05]">
        <div className="absolute pointer-events-none inset-0 dark:bg-slate-900/90 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      
      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 mb-8">
            <span className="text-xs text-slate-400">🎯 Simple Three Step Process →</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            From your first contribution to your first referral or paid task — we've got you covered.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl border ${step.borderColor} bg-gradient-to-b ${step.gradient} p-8 shadow-xl dark:shadow-slate-900/50 transition-all duration-300 hover:scale-105`}
            >
              {/* Icon */}
              <div className={`absolute -top-4 -right-4 flex h-16 w-16 items-center justify-center rounded-full ${step.iconBg} text-3xl shadow-lg border border-white/10 backdrop-blur-sm`}>
                {step.icon}
              </div>

              {/* Content */}
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Decorative arrow for non-last items */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-12 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-600">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
