import { LoginForm } from 'wasp/client/auth';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <span className="text-4xl mb-2">🔐</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Sign in to your ForgeMyCode account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}