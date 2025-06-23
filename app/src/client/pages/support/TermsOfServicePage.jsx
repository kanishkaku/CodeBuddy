import React from 'react';
import { Link as WaspRouterLink } from 'wasp/client/router';

export default function TermsOfService() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Terms of Service</h1>
        <p className="text-lg text-bodydark mb-8 text-gray-700 dark:text-gray-300">
          Welcome to ForgeMyCode! By using this platform, you agree to the following terms designed to support students in discovering open source tasks and building their resumes:
        </p>
        <ul className="text-left text-gray-600 dark:text-gray-400 mb-8 space-y-3">
          <li>
            <strong>1. Educational Purpose:</strong> ForgeMyCode is intended to help students find real-world open source tasks for learning and resume building. Please use the platform for its intended educational purpose.
          </li>
          <li>
            <strong>2. Account Responsibility:</strong> You are responsible for maintaining the security of your account and for all activities that occur under your account.
          </li>
          <li>
            <strong>3. Respectful Participation:</strong> Engage respectfully with open source communities and follow the contribution guidelines of each project you participate in.
          </li>
          <li>
            <strong>4. Content Ownership:</strong> You retain rights to your contributions and profile information, but grant ForgeMyCode permission to display your activity and achievements on the platform.
          </li>
          <li>
            <strong>5. No Guarantees:</strong> ForgeMyCode does not guarantee internships, jobs, or acceptance of your contributions by open source projects. The platform is a discovery and learning tool.
          </li>
          <li>
            <strong>6. Platform Changes:</strong> We may update these terms or features at any time. Continued use of ForgeMyCode means you accept the latest terms.
          </li>
          <li>
            <strong>7. Refund and Cancellation Policy:</strong> ForgeMyCode currently charges a one time fee to access the platform.
            <ul className="ml-4 mt-2 list-disc">
              <li>
                <strong>Refunds:</strong> Users may request a refund within 7 days of purchase if they are not satisfied with the service. To request a refund, please contact our support team at admin@forgemycode.com
              </li>
              <li>
                <strong>Cancellations:</strong> Cancellations for a refund are only accepted within 7 days of purchase. No cancellations or refunds will be processed after this 7 day period.
              </li>
            </ul>
          </li>
        </ul>
        <WaspRouterLink
          to="/"
          className="inline-block px-8 py-3 text-white font-semibold bg-yellow-500 rounded-lg hover:bg-yellow-400 transition duration-300"
        >
          Go Back Home
        </WaspRouterLink>
      </div>
    </div>
  );
}