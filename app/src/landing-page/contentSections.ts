import type { NavigationItem } from '../client/components/NavBar/NavBar';
import { routes } from 'wasp/client/router';
import { DocsUrl, BlogUrl } from '../shared/common';
import daBoiAvatar from '../client/static/da-boi.webp';
import avatarPlaceholder from '../client/static/avatar-placeholder.webp';

export const landingPageNavigationItems: NavigationItem[] = [
  { name: 'Features', to: '#features' },
  { name: 'How It Works', to: '#howitworks' },
  { name: 'Pricing', to: routes.PricingPageRoute.to },
  {name: 'Testimonials', to: '#testimonials' },
  { name: 'Blog', to: BlogUrl },
];
export const features = [
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
export const testimonials = [
  {
    name: 'Aarav Patel',
    role: 'CS Student, NIT Trichy',
    quote:
      'Before this platform, I only worked on college projects. Now I’ve contributed to real GitHub repos, added them to my resume, and landed two interviews thanks to maintainers recommending me!',
    image: '/avatars/aarav.png', // optional, or use a placeholder
  },
  {
    name: 'Sara Thomas',
    role: 'Frontend Intern, Bangalore',
    quote:
      'I was struggling to stand out as a fresher. Solving good-first-issues gave me something solid to talk about in interviews — plus I even got paid for a couple of tasks!',
    image: '/avatars/sara.png',
  },
  {
    name: 'Neel Roy',
    role: 'Self-taught Dev, Kolkata',
    quote:
      'Getting real-world experience without applying for jobs felt impossible. This made it easy to contribute, build credibility, and grow my portfolio.',
    image: '/avatars/neel.png',
  },
];
export const howItWorks = [
  {
    title: '1. Find Beginner-Friendly Tasks',
    desc: 'Use filters to discover GitHub issues based on language, difficulty, and task type.',
    icon: '🧭',
  },
  {
    title: '2. Contribute and Get Reviewed',
    desc: 'Solve tasks, submit PRs, and get real feedback from maintainers.',
    icon: '🛠️',
  },
  {
    title: '3. Earn Referrals or Paid Work',
    desc: 'Your public contributions speak for themselves. Some tasks even pay.',
    icon: '💼',
  },
];



export const faqs = [
  {
    id: 1,
    question: 'Whats the meaning of life?',
    answer: '42.',
    href: 'https://en.wikipedia.org/wiki/42_(number)',
  },
];
export const footerNavigation = {
  app: [
    { name: 'Documentation', href: DocsUrl },
    { name: 'Blog', href: BlogUrl },
  ],
  company: [
    { name: 'About', href: 'https://wasp.sh' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};
