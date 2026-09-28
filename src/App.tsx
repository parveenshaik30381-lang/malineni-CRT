import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { Sprout, ShieldCheck, Mail, Lock, CheckCircle2, Leaf, BarChart3, Wifi } from 'lucide-react';

function MainApp() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/25">
            <Sprout className="h-8 w-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">FarmMind AI</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verifying secure Firebase session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Global verification banner when user is logged in */}
      <EmailVerificationBanner />

      {/* Main Content Area */}
      {user ? (
        <main>
          <Dashboard />
        </main>
      ) : (
        <main className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
          {/* Subtle background decoration */}
          <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-600/10" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-600/10" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Platform Branding & Features Showcase (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800 backdrop-blur-sm dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Powered by Firebase Authentication & Email Verification</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                    Intelligent agriculture,{' '}
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                      secure by design.
                    </span>
                  </h1>
                  <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 leading-relaxed sm:text-lg">
                    FarmMind AI connects field sensors, drone imaging, and AI agronomist models to optimize your crop yields. Protect your farming hardware and analytics with industry-standard cryptographic authentication.
                  </p>
                </div>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Verification</h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Automatic verification links protect telemetry from spoofing and unauthorized access.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Secure Passwords</h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Real-time entropy meters, salt hashing, and self-service password recovery.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Live Farm Analytics</h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Instant access to soil moisture, localized weather predictions, and crop scouting.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      <Wifi className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Precision IoT Gate</h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Sensitive irrigation actuators and drone sprayers require validated credentials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Metrics */}
                <div className="flex items-center gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Google Identity Platform
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Instant Token Refresh
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Rate-Limit Protected
                  </span>
                </div>
              </div>

              {/* Right Column: Form Container (5 cols) */}
              <div className="flex justify-center lg:col-span-5">
                {currentTab === 'login' ? (
                  <LoginForm onSwitchToRegister={() => setCurrentTab('register')} />
                ) : (
                  <RegisterForm onSwitchToLogin={() => setCurrentTab('login')} />
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200/60 bg-white/60 py-6 text-center text-xs text-slate-400 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p>© 2026 FarmMind AI (farmmindai.firebaseapp.com). All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>Firebase Auth v11</span>
            <span>•</span>
            <span>Security Rules Protected</span>
            <span>•</span>
            <span>Email Verification Flow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
