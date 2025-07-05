import { useAuth } from 'wasp/client/auth';
import { generateCheckoutSession, getCustomerPortalUrl, useQuery } from 'wasp/client/operations';
import { PaymentPlanId, paymentPlans, prettyPaymentPlanName, SubscriptionStatus } from './plans';
import { AiFillCheckCircle, AiFillStar, AiFillCrown } from 'react-icons/ai';
import { BsLightning } from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../client/cn';

const bestDealPaymentPlanId: PaymentPlanId = PaymentPlanId.Pro;

interface PaymentPlanCard {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
}

export const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard> = {
  [PaymentPlanId.Hobby]: {
    name: prettyPaymentPlanName(PaymentPlanId.Hobby),
    price: '₹1999',
    description: 'Perfect for students and beginners ready to kickstart their coding journey with essential tools.',
    features: [
      'Limited access to curated GitHub tasks',
      'Advanced resume builder template',
      'Interview preparation resources',
    ],
    icon: <BsLightning className="w-6 h-6" />,
  },
  [PaymentPlanId.Pro]: {
    name: prettyPaymentPlanName(PaymentPlanId.Pro),
    price: '₹4999',
    originalPrice: '₹6999',
    description: 'Accelerate your career with advanced features, premium opportunities, and priority support.',
    features: [
      'Everything in Basic plan',
      'Unlimited access to curated GitHub tasks',
      'Access to paid tasks',
      'Get shortlisted for exclusive job opportunities from recruiters',
    ],
    badge: 'Most Popular',
    badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    icon: <AiFillCrown className="w-6 h-6" />,
  },
};

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Final Year CS Student → SDE at Microsoft",
    content: "Started using this platform in my 2nd year. The GitHub tasks gave me real project experience that recruiters loved. Landed my internship because of the portfolio I built here!",
    avatar: "AM"
  },
  {
    name: "Sneha Gupta",
    role: "3rd Year Student → Freelance Developer",
    content: "As a college student, I got access to industry-level projects and an internship opportunity in the project I contributed to. In a short span, I was able to build a resume filled with real-world experience while being a fresher.",
    avatar: "SG"
  }
];

const PricingPage = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: user } = useAuth();
  const isUserSubscribed =
    !!user && !!user.subscriptionStatus && user.subscriptionStatus !== SubscriptionStatus.Deleted;

  const navigate = useNavigate();

  // Redirect subscribed users to /tasks
  useEffect(() => {
    if (isUserSubscribed) {
      navigate('/tasks', { replace: true });
    }
  }, [isUserSubscribed, navigate]);

  const {
    data: customerPortalUrl,
    isLoading: isCustomerPortalUrlLoading,
    error: customerPortalUrlError,
  } = useQuery(getCustomerPortalUrl, { enabled: isUserSubscribed });

  async function handleBuyNowClick(paymentPlanId: PaymentPlanId) {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsPaymentLoading(true);

      const checkoutResults = await generateCheckoutSession(paymentPlanId);

      if (checkoutResults?.sessionUrl) {
        window.open(checkoutResults.sessionUrl, '_self');
      } else {
        throw new Error('Error generating checkout session URL');
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Error processing payment. Please try again later.');
      }
      setIsPaymentLoading(false); // We only set this to false here and not in the try block because we redirect to the checkout url within the same window
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (customerPortalUrlError) {
      setErrorMessage('Error fetching Customer Portal URL');
      return;
    }

    if (!customerPortalUrl) {
      setErrorMessage(`Customer Portal does not exist for user ${user.id}`);
      return;
    }

    window.open(customerPortalUrl, '_blank');
  };

  return (
    <div className='py-16 lg:py-24 from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        {/* Header Section */}
        <div className='mx-auto max-w-4xl text-center mb-16'>
          <div className="flex items-center justify-center mb-6">
            <HiSparkles className="w-8 h-8 text-yellow-500 mr-2" />
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
              Pricing Plans
            </span>
          </div>
          <h1 className='text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white mb-6'>
            Choose Your <span className='bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'>Success Path</span>
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Join thousands of developers who have accelerated their careers with our platform. Start your journey today!
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className='mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className='mx-auto grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 lg:gap-8 mt-8'>
          {Object.values(PaymentPlanId).map((planId) => {
            const plan = paymentPlanCards[planId];
            const isPopular = planId === bestDealPaymentPlanId;
            
            return (
              <div
                key={planId}
                className={cn(
                  'relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl',
                  {
                    'ring-2 ring-yellow-500 transform scale-105': isPopular,
                    'hover:shadow-xl': !isPopular,
                  },
                  isPopular ? 'mt-4' : 'mt-8'
                )}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className={cn(
                      'inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold text-white shadow-lg',
                      plan.badgeColor
                    )}>
                      <AiFillStar className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8 lg:p-10">
                  {/* Plan Header */}
                  <div className="flex items-center mb-4">
                    <div className={cn(
                      'p-2 rounded-lg mr-3',
                      isPopular 
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    )}>
                      {plan.icon}
                    </div>
                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {plan.name}
                    </h3>
                  </div>

                  <p className='text-gray-600 dark:text-gray-300 mb-6 leading-relaxed'>
                    {plan.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through mr-2">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className='text-4xl font-bold text-gray-900 dark:text-white'>
                        {plan.price}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ₹{parseInt(plan.originalPrice.replace('₹', '')) - parseInt(plan.price.replace('₹', ''))} this year!
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className='space-y-4 mb-8'>
                    {plan.features.map((feature, index) => (
                      <li key={index} className='flex items-start'>
                        <AiFillCheckCircle className='h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5 mr-3' />
                        <span className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {!isUserSubscribed && (
                    <button
                      onClick={() => handleBuyNowClick(planId)}
                      disabled={isPaymentLoading}
                      className={cn(
                        'w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                        {
                          'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl focus:ring-yellow-500':
                            isPopular,
                          'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:ring-gray-500':
                            !isPopular,
                          'opacity-50 cursor-not-allowed': isPaymentLoading,
                        }
                      )}
                    >
                      {isPaymentLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        user ? 'Buy Plan' : 'Sign Up to Continue'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Proof */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Trusted by 15,000+ college students worldwide
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                What's included in the money-back guarantee?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                We offer a 7-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;