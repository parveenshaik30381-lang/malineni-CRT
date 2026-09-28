import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getFirebaseAuthErrorMessage } from '../utils/authErrors';

export const EmailVerificationBanner: React.FC = () => {
  const { user, sendVerificationEmail, reloadUser } = useAuth();
  const [resending, setResending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setFeedback(null);
    try {
      await sendVerificationEmail();
      setFeedback({
        type: 'success',
        message: `Verification link successfully dispatched to ${user.email}. Please check your inbox and spam folder.`,
      });
      setCooldown(60); // 60s cooldown to prevent Firebase rate limits
    } catch (err: any) {
      console.error('Error resending verification:', err);
      const code = err?.code || '';
      const msg = code ? getFirebaseAuthErrorMessage(code) : (err?.message || 'Failed to resend verification email.');
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setFeedback(null);
    try {
      const refreshedUser = await reloadUser();
      if (refreshedUser?.emailVerified) {
        setFeedback({
          type: 'success',
          message: 'Hooray! Your email address has been verified. Welcome to full FarmMind AI access!',
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Email is not yet verified. Please click the link inside the confirmation email sent to you, then click this button again.',
        });
      }
    } catch (err: any) {
      console.error('Error reloading user status:', err);
      setFeedback({
        type: 'error',
        message: 'Could not refresh verification status right now. Please try again.',
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="border-b border-amber-300 bg-amber-50/90 text-amber-900 shadow-sm dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Info side */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-200/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Email Verification Required</p>
                <span className="rounded bg-amber-200 px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:bg-amber-900/90 dark:text-amber-100">
                  Action Needed
                </span>
              </div>
              <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300">
                A verification link was sent to <strong className="font-semibold text-amber-950 dark:text-amber-100">{user.email}</strong>. 
                Please verify your email to unlock all secure FarmMind AI features.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100/80 disabled:opacity-60 dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-100 dark:hover:bg-amber-900/80"
              title="Click after you've opened the email link"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Checking...' : "I've Verified (Check Status)"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-60 dark:bg-amber-700 dark:hover:bg-amber-600"
            >
              <Send className="h-3.5 w-3.5" />
              {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
            </button>
          </div>
        </div>

        {/* Feedback alert if present */}
        {feedback && (
          <div
            className={`mt-2.5 flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium transition ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200'
                : 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
