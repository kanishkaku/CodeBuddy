import { Link } from 'wasp/client/router';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const phrases = [
    'Real GitHub Experience',
    'Industry Recognition',
    'Career Growth',
    'Professional Network'
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    let timeoutId: NodeJS.Timeout;

    if (typedText.length < currentPhrase.length) {
      timeoutId = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }, 100);
    } else {
      timeoutId = setTimeout(() => {
        setTypedText('');
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [typedText, currentIndex, phrases]);

  return (
    <section className="relative pt-20 pb-20 dark:bg-slate-900/75">
      {/* Gradient Overlay - Updated for better dark mode blending */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900/90 bg-white dark:bg-grid-white/[0.02] bg-grid-black/[0.05]">
        <div className="absolute pointer-events-none inset-0 dark:bg-slate-900/90 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-16 pb-12">
            {/* Hero content */}
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center -mx-4">
                
                {/* Left Column */}
                <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                  <div className="max-w-lg">
                    {/* Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 mb-8 animate-bounce">
                      <span className="text-xs text-slate-400">🎯Bridge the Gap Between Learning & Industry →</span>
                    </div>
                    
                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                      <span className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
                        Transform Your Code Into
                      </span>
                      <br />
                      <span className="text-blue-600 dark:text-blue-400 min-h-[1.2em] inline-block">
                        {typedText}
                        <span className="animate-pulse">|</span>
                      </span>
                    </h1>
                    
                    {/* Description */}
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                      Stop building todo apps. Start solving{' '}
                      <span className="text-blue-500 dark:text-blue-400 font-medium">real problems</span>
                      {' '}for{' '}
                      <span className="text-blue-500 dark:text-blue-400 font-medium">real companies</span>.
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/tasks"
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200"
                      >
                        Get Started
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">1000+</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Active Projects</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">500+</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Students Hired</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">95%</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Code Editor */}
                <div className="w-full lg:w-1/2 px-4">
                  <div className="relative mx-auto max-w-lg">
                    <div className="relative">
                      {/* Code editor mockup with dark theme */}
                      <div className="bg-slate-900/80 dark:bg-slate-900/60 rounded-xl shadow-2xl overflow-hidden border border-slate-800/40">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="text-sm text-slate-400 font-mono">main.js</div>
                        </div>
                        <div className="p-4 font-mono text-sm">
                          <div className="text-slate-500">// Your journey to real-world impact starts here</div>
                          <div className="text-blue-400 mt-2">async function <span className="text-yellow-300">buildCareer</span>() {`{`}</div>
                          <div className="text-slate-300 ml-4">const skills = [<span className="text-green-400">'problem-solving'</span>];</div>
                          <div className="text-slate-300 ml-4">const impact = await <span className="text-blue-400">solveRealProblems</span>();</div>
                          <div className="text-blue-400 ml-4">return <span className="text-purple-400">createSuccess</span>(skills, impact);</div>
                          <div className="text-blue-400">{`}`}</div>
                        </div>
                      </div>
                      
                      {/* Floating notification badges */}
                      <div className="absolute -top-4 -right-4 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg animate-bounce">
                        +1 GitHub Star ⭐
                      </div>
                      <div className="absolute -bottom-4 -left-4 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-full shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                        PR Merged! 🎉
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}