import React from 'react';
import { Link as WaspRouterLink } from 'wasp/client/router';

export default function ContactUsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h1>
        <p className="text-lg text-bodydark mb-8 text-gray-700 dark:text-gray-300">
          We're here to help! If you have any questions, concerns, or need support, please reach out to us using the information below.
        </p>
        <ul className="text-left text-gray-600 dark:text-gray-400 mb-8 space-y-3">
          <li>
            <strong>Registered Company Address:</strong><br />
            KU7 Technologies Pvt. Ltd.<br />
            34/35, Nrupathunga Nagar,<br />
            J.P. Nagar 7th Phase, Bengaluru, Karnataka 560078,<br />
            India
          </li>
          <li>
            <strong>Domestic Telephone Number:</strong><br />
            +91 84314 86653
          </li>
          <li>
            <strong>Email:</strong><br />
            admin@forgemycode.com
          </li>
          <li>
            <strong>Support Hours:</strong><br />
            Monday to Friday, 10:00 AM - 6:00 PM IST
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