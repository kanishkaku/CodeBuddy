import React from 'react';
import { Link as WaspRouterLink } from 'wasp/client/router';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Privacy Policy</h1>
        <p className="text-lg text-bodydark mb-8 text-gray-700 dark:text-gray-300">
          Your privacy is important to us at ForgeMyCode. This policy explains what information we collect and how we use it.
        </p>
        <ul className="text-left text-gray-600 dark:text-gray-400 mb-8 space-y-3">
          <li>
            <strong>1. Information We Collect:</strong> We only collect your name and email address when you register or use our platform.
          </li>
          <li>
            <strong>2. How We Use Your Information:</strong> Your name and email are used to create and manage your account, provide access to platform features, and communicate important updates or information related to your use of ForgeMyCode.
          </li>
          <li>
            <strong>3. Data Sharing:</strong> We do not sell or share your personal information with third parties, except as required by law or to provide essential platform services (such as authentication).
          </li>
          <li>
            <strong>4. Data Security:</strong> We take reasonable measures to protect your information from unauthorized access, loss, or misuse.
          </li>
          <li>
            <strong>5. Data Retention:</strong> Your information is retained as long as your account is active or as needed to provide you with our services. You may request deletion of your account and data at any time by contacting us.
          </li>
          <li>
            <strong>6. Changes to This Policy:</strong> We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
          </li>
          <li>
            <strong>7. Contact:</strong> If you have any questions about this policy or your data, please contact us at admin@forgemycode.com.
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