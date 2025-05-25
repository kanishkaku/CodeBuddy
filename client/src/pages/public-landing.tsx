import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { CheckIcon, Code2Icon, BriefcaseIcon, GraduationCapIcon, UsersIcon } from 'lucide-react';

export default function PublicLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">OSResume</div>
          <nav>
            <Button asChild variant="ghost" className="mr-2">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent mb-6">
              Build Your Resume with Real-World Experience
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              OSResume connects students with open source projects to help you gain 
              practical experience, build your resume, and launch your tech career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-300 rounded-lg blur opacity-75"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1607798748738-b15c40d33d57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Student working on laptop" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-primary-50" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How OSResume Works</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A simple process to help you build real-world skills and showcase them on your resume
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Code2Icon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-2xl">Find Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Browse through our curated list of open source tasks that match your skill level and interests
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <BriefcaseIcon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-2xl">Complete Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Contribute to real projects, get your pull requests merged, and build practical experience
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCapIcon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-2xl">Build Your Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Track your contributions and automatically generate a professional resume to showcase your skills
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose OSResume</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Stand out to employers with a resume backed by real-world experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-World Experience</h3>
                <p className="text-gray-700">
                  Contribute to actual projects used by real people and organizations around the world
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Learn Industry Standards</h3>
                <p className="text-gray-700">
                  Experience professional development workflows including code reviews, testing, and documentation
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Build Network</h3>
                <p className="text-gray-700">
                  Connect with project maintainers, fellow contributors, and grow your professional network
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Portfolio Generator</h3>
                <p className="text-gray-700">
                  Automatically build an impressive resume and portfolio from your contributions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Get started for free or unlock premium features with our affordable plans
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Access to starter tasks</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Basic resume builder</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Track up to 5 contributions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Community forum access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-none shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Student</CardTitle>
                <CardDescription>For serious students</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Access to all tasks</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Advanced resume builder with templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Unlimited contribution tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Weekly project recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <CardDescription>For graduates & job seekers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Everything in Student</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Custom portfolio website</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Project mentor matching</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Resume review by professionals</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span>Job opportunity alerts</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Hear from students who've landed jobs and internships with help from OSResume
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <UsersIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Alex Johnson</h3>
                  <p className="text-gray-500">Computer Science Student</p>
                </div>
                <p className="text-gray-700">
                  "OSResume helped me land my first internship at a tech company. The projects I contributed to gave me real experience to talk about in interviews."
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <UsersIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Priya Patel</h3>
                  <p className="text-gray-500">Software Engineering Graduate</p>
                </div>
                <p className="text-gray-700">
                  "The resume I built with OSResume stood out to recruiters. I had real projects to show instead of just class projects everyone else had."
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <UsersIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Michael Chen</h3>
                  <p className="text-gray-500">Self-taught Developer</p>
                </div>
                <p className="text-gray-700">
                  "As someone without a CS degree, OSResume gave me the practical experience I needed to prove my skills to employers. Now I'm working as a full-time developer."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Future?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Start contributing to real projects and building your resume today. Join thousands of students already on their way to tech career success.
          </p>
          <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8">
            <Link href="/login">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">OSResume</h3>
              <p className="text-gray-400">
                Building student resumes with real open source experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Learning Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} OSResume. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}