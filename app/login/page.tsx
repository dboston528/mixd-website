'use client'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setError('');
    setSocialLoading(provider);

    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithApple();
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar></Navbar>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-center mb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Login
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <div className="relative flex items-center">
                <span className="flex-grow border-t border-gray-200"></span>
                <span className="mx-3 text-xs uppercase tracking-wide text-gray-500">or continue with</span>
                <span className="flex-grow border-t border-gray-200"></span>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoading !== null}
                  className="inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C34 32.7 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.2-.4-3.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.1 15.3 18.7 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 15.5 4 8.3 8.5 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.2l-6.3-5.2C29.4 36 26.8 37 24 37c-5.4 0-10-3.3-11.7-8L6.2 30.1C8.2 36.3 14.5 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 3.7-3.4 6.8-6.9 8.3l6.3 5.2C37.3 39.2 40 34 40 28c0-1.1-.1-2.2-.4-3.5z" />
                  </svg>
                  {socialLoading === 'google' ? 'Connecting...' : 'Google'}
                </button>
                {/* <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={socialLoading !== null}
                  className="inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 17" className="h-5 w-5 fill-current">
                    <path d="M10.707 0c-.922.063-2.014.654-2.646 1.418-.582.701-1.094 1.77-.9 2.814 1.015.03 2.06-.592 2.681-1.365.602-.738 1.04-1.792.865-2.867zm2.726 12.125c-.053-.04-2.084-1.196-2.035-4.495.034-2.848 2.283-4.07 2.37-4.123-.515-.75-1.319-1.36-1.997-1.727-.628-.338-1.282-.672-2.216-.681-.888-.009-1.653.297-2.204.297-.55 0-1.257-.288-2.046-.282-.947.006-1.822.343-2.449.681-.781.42-1.633 1.007-2.231 1.98-1.376 2.224-1.138 6.439.945 9.575.666.984 1.557 2.095 2.676 2.105.998.01 1.425-.648 2.669-.654 1.244-.006 1.627.66 2.625.65 1.12-.01 1.968-1.052 2.634-2.036.717-1.053 1.013-2.075 1.032-2.125z" />
                  </svg>
                  {socialLoading === 'apple' ? 'Connecting...' : 'Apple'}
                </button> */}
              </div>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <a href="/signup" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 font-medium">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
