export default function HowItWorks() {
  const steps = [
    {
      icon: '🧭',
      title: '1. Find Beginner-Friendly Tasks',
      description: 'Use smart filters to discover open GitHub issues based on language, difficulty, and type. Perfect for students getting started.',
    },
    {
      icon: '🛠️',
      title: '2. Solve & Submit Pull Requests',
      description: 'Fork the repo, solve the issue, and submit a pull request just like real developers do. Get feedback and grow your skills.',
    },
    {
      icon: '💼',
      title: '3. Earn Referrals & Paid Tasks',
      description: 'As you contribute more, unlock paid issues and referral opportunities from maintainers and companies hiring.',
    },
  ];

  return (
    <section id='howitworks' className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          How It Works
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          From your first contribution to your first referral or paid task — we've got you covered.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
        {steps.map((step, index) => (
          <div key={index} className="text-center px-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl dark:bg-boxdark mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
            <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
    
  );
}
