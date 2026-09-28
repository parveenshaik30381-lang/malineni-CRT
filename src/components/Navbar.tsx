import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, ShieldCheck, AlertCircle, LogOut, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentTab: 'login' | 'register';
  setCurrentTab: (tab: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, signOutUser, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/80 backdrop-blur-md dark:border-emerald-800/20 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                FarmMind <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
              <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 sm:inline-block">
                Auth Portal
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Intelligent Agriculture & Secure Cloud Management
            </p>
          </div>
        </div>

        {/* Right side Auth Status */}
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <div className="flex items-center gap-3">
              {/* Verification Tag */}
              <div
                className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  user.emailVerified
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50'
                }`}
                title={user.emailVerified ? 'Email is verified' : 'Email verification pending'}
              >
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Unverified Email</span>
                  </>
                )}
              </div>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 dark:border-slate-800 dark:bg-slate-800/60">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white uppercase">
                    {(user.displayName || user.email || 'U')[0]}
                  </div>
                )}
                <span className="max-w-[130px] truncate text-xs font-medium text-slate-700 dark:text-slate-200 sm:max-w-[180px]">
                  {user.displayName || user.email}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => signOutUser()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-rose-400"
                title="Sign out of FarmMind AI"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : !loading ? (
            <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setCurrentTab('login')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  currentTab === 'login'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('register')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  currentTab === 'register'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
