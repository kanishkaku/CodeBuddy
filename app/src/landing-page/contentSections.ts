import type { NavigationItem } from '../client/components/NavBar/NavBar';
import { routes } from 'wasp/client/router';

export const landingPageNavigationItems: NavigationItem[] = [
  { name: 'Features', to: '#features' },
  { name: 'How It Works', to: '#howitworks' },
  { name: 'Pricing', to: routes.PricingPageRoute.to },
  { name: 'Testimonials', to: '#testimonials' },
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
    // { name: 'Documentation', href: '#' },
    // { name: 'Blog', href: BlogUrl },
  ],
  company: [
    { name: 'Contact Us', href: routes.ContactUsRoute.to },
    { name: 'Privacy Policy', href: routes.PrivacyPolicyRoute.to },
    { name: 'Terms of Service', href: routes.TermsOfServiceRoute.to },
  ],
};
