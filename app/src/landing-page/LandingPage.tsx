import { faqs, footerNavigation, } from './contentSections';
import Hero from './components/Hero';
import Clients from './components/Clients';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';

export default function LandingPage() {
  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      <main className='isolate dark:bg-boxdark-2'>
        <Hero />
        {/* <Clients /> */}
        <HowItWorks />
        <Features />
        <Testimonials />
        {/* <FAQ faqs={faqs} /> */}
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
