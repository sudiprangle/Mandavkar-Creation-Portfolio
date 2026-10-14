import React, { useState } from 'react';
import { Lock, ArrowLeft, Camera, AlertCircle } from 'lucide-react';
import { adminLogin } from '../../services/store';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const user = await adminLogin(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col justify-center py-10 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Back to site header button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo and title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-md">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal uppercase tracking-wide">
            Studio Admin Portal
          </h2>
          <p className="mt-2 text-xs text-zinc-400 font-light">
            MANDAVKAR CREATION — Secure Management Sign In
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-[#0d0d10] py-8 px-6 sm:px-10 border border-zinc-800 rounded-xl shadow-2xl relative">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 font-light">
          Secured with Supabase Authentication & Role-Based Access Control.
        </p>
      </div>
    </div>
  );
};
