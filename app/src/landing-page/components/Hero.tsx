import { Link } from 'wasp/client/router';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const phrases = [
    'Real GitHub Experience',
    'Industry Recognition',
    'Career Opportunities',
    'Professional Network'
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    const timeoutId = setTimeout(() => {
      if (typedText.length < currentPhrase.length) {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      } else {
        setTimeout(() => {
          setTypedText('');
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, typedText.length < currentPhrase.length ? 100 : 50);

    return () => clearTimeout(timeoutId);
  }, [typedText, currentIndex]);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-28 lg:flex lg:items-center lg:min-h-screen">
        <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:flex-auto lg:text-left">
          {/* Animated badge */}
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg mb-8 animate-bounce">
            <span className="mr-2">🎯</span>
            Bridge the Gap Between Learning & Industry
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
              Transform Your Code Into
            </span>
            <br />
            <span className="text-blue-600 dark:text-blue-400 min-h-[1.2em] inline-block">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl">
            Stop building todo apps. Start solving <span className="font-semibold text-blue-600 dark:text-blue-400">real problems</span> for 
            <span className="font-semibold text-purple-600 dark:text-purple-400"> real companies</span>. 
            Get the experience employers actually want to see.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-8 text-center lg:text-left">
            <div className="group">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Students Hired</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/tasks"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <span className="mr-2">🚀</span>
              Start Building Your Portfolio
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </Link>
            
            <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500">
              <span className="mr-2">📊</span>
              See Success Stories
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Trusted by students from:</p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">MIT</div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">Stanford</div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">Berkeley</div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">CMU</div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">Georgia Tech</div>
            </div>
          </div>
        </div>

        {/* Right side visual */}
        <div className="mt-16 lg:mt-0 lg:ml-16 lg:flex-none lg:w-1/2">
          <div className="relative">
            {/* Code editor mockup */}
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-400 font-mono">main.js</div>
                <div className="w-6"></div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-green-400">// Your next contribution starts here</div>
                <div className="text-blue-300 mt-2">function <span className="text-yellow-300">solveProblem</span>() {"{"}</div>
                <div className="text-purple-300 ml-4 mt-1">const <span className="text-white">solution</span> = <span className="text-green-300">'innovative'</span>;</div>
                <div className="text-purple-300 ml-4">const <span className="text-white">impact</span> = <span className="text-green-300">'real-world'</span>;</div>
                <div className="text-blue-300 ml-4 mt-2">return <span className="text-white">buildCareer</span>(<span className="text-white">solution, impact</span>);</div>
                <div className="text-blue-300">{"}"}</div>
                <div className="mt-4 text-gray-500">
                  <span className="animate-pulse">●</span> Ready to make your mark?
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
              +1 GitHub Star ⭐
            </div>
            <div className="absolute bottom-4 -left-4 bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
              Pull Request Merged! 🎉
            </div>
            <div className="absolute top-1/2 -right-8 bg-purple-500 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce" style={{ animationDelay: '2s' }}>
              Interview Request 📩
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}