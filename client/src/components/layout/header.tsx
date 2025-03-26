import { Menu, Bell } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
        <button 
          type="button" 
          className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 px-4 flex justify-between">
          <div className="flex-1 flex">
            <div className="md:hidden flex items-center text-lg font-semibold text-gray-800">
              <span className="text-primary">OS</span>Resume
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <button type="button" className="p-1 rounded-full text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center text-lg font-semibold text-gray-800">
                <span className="text-primary">OS</span>Resume
              </div>
              <button 
                type="button" 
                className="text-gray-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="pt-3 pb-4 overflow-y-auto">
              <div className="px-4 pb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h2>
              </div>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="flex items-center px-4 py-2.5 text-sm font-medium text-primary bg-blue-50 border-l-2 border-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </a>
              </Link>
              <Link href="/explore-tasks" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Tasks
                </a>
              </Link>
              <Link href="/my-resume" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  My Resume
                </a>
              </Link>
              <Link href="/saved-tasks" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Saved Tasks
                </a>
              </Link>
              
              <div className="px-4 pt-5 pb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</h2>
              </div>
              <Link href="/learning-center" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Learning Center
                </a>
              </Link>
              <Link href="/help-center" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help Center
                </a>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
