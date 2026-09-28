import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  AlertTriangle,
  Mail,
  RefreshCw,
  Send,
  User,
  KeyRound,
  CheckCircle2,
  Calendar,
  Lock,
  Unlock,
  Sprout,
  Droplets,
  Cpu,
  Radio,
  ExternalLink,
  Save,
  Check,
} from 'lucide-react';
import { getFirebaseAuthErrorMessage } from '../utils/authErrors';

export const Dashboard: React.FC = () => {
  const {
    user,
    reloadUser,
    sendVerificationEmail,
    updateUserProfile,
    updateUserPassword,
    signOutUser,
  } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email verification state
  const [refreshingAuth, setRefreshingAuth] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [verificationNotice, setVerificationNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Interactive gated action demo
  const [droneDispatchActive, setDroneDispatchActive] = useState(false);
  const [irrigationStatus, setIrrigationStatus] = useState<'idle' | 'running'>('idle');
  const [gateAttemptBlocked, setGateAttemptBlocked] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleRefreshStatus = async () => {
    setRefreshingAuth(true);
    setVerificationNotice(null);
    try {
      const refreshed = await reloadUser();
      if (refreshed?.emailVerified) {
        setVerificationNotice({
          type: 'success',
          text: 'Great news! Your email verification has been confirmed.',
        });
      } else {
        setVerificationNotice({
          type: 'error',
          text: 'Your email is still marked unverified. Please check your inbox, click the verification link, and click this button again.',
        });
      }
    } catch (err: any) {
      console.error(err);
      setVerificationNotice({
        type: 'error',
        text: 'Failed to refresh status from Firebase. Please try again.',
      });
    } finally {
      setRefreshingAuth(false);
    }
  };

  const handleResendVerification = async () => {
    if (cooldown > 0 || resendingVerification) return;
    setResendingVerification(true);
    setVerificationNotice(null);
    try {
      await sendVerificationEmail();
      setVerificationNotice({
        type: 'success',
        text: `A fresh verification link has been sent to ${user?.email}. Don't forget to check your spam/junk folder.`,
      });
      setCooldown(60);
    } catch (err: any) {
      console.error(err);
      const code = err?.code || '';
      setVerificationNotice({
        type: 'error',
        text: code ? getFirebaseAuthErrorMessage(code) : (err?.message || 'Could not send verification email.'),
      });
    } finally {
      setResendingVerification(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateUserProfile(displayName);
      setProfileMsg({ type: 'success', text: 'Profile display name updated successfully!' });
    } catch (err: any) {
      console.error(err);
      setProfileMsg({ type: 'error', text: err?.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setChangingPassword(true);
    setPasswordMsg(null);
    try {
      await updateUserPassword(newPassword);
      setPasswordMsg({ type: 'success', text: 'Your password has been changed securely.' });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error(err);
      const code = err?.code || '';
      setPasswordMsg({
        type: 'error',
        text: code ? getFirebaseAuthErrorMessage(code) : (err?.message || 'Failed to update password.'),
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Determine provider (password vs google)
  const isPasswordUser = user?.providerData.some((p) => p.providerId === 'password');
  const providerLabel = user?.providerData.map((p) => p.providerId).join(', ') || 'firebase';

  const triggerGatedAction = () => {
    if (!user?.emailVerified) {
      setGateAttemptBlocked(true);
      setTimeout(() => setGateAttemptBlocked(false), 5000);
      return;
    }
    setIrrigationStatus('running');
    setTimeout(() => setIrrigationStatus('idle'), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Welcome Banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-8 text-white shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold uppercase backdrop-blur-md border border-white/20">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                (user?.displayName || user?.email || 'U')[0]
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {user?.displayName ? `Hello, ${user.displayName}` : 'Welcome, Farmer'}
                </h1>
                {user?.emailVerified ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-200 border border-emerald-400/30">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified Account
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-200 border border-amber-400/30">
                    <AlertTriangle className="h-3.5 w-3.5" /> Verification Pending
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-emerald-100/90">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOutUser()}
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 border border-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Subtle decorative background pattern */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Email Verification & Security (2 cols) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Card: Email Verification Status */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    user?.emailVerified
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Email Verification Status
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Firebase Authentication Security Gate
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user?.emailVerified
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                }`}
              >
                {user?.emailVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>

            <div className="mt-4">
              {user?.emailVerified ? (
                <div className="rounded-2xl bg-emerald-50/70 p-4 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-semibold">Your email has been authenticated</p>
                      <p className="mt-1 text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
                        All FarmMind AI features, automated precision irrigation triggers, and sensitive agricultural IoT devices are fully unlocked for your account.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-amber-50/80 p-4 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                      <div>
                        <p className="text-sm font-semibold">Verification link pending confirmation</p>
                        <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                          We sent a verification link to <strong>{user?.email}</strong>. Once you open the link in your email inbox, return here and click <strong>Check Verification Status</strong> to refresh your permissions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions for unverified */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleRefreshStatus}
                      disabled={refreshingAuth}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshingAuth ? 'animate-spin' : ''}`} />
                      {refreshingAuth ? 'Checking Firebase...' : 'Check Verification Status'}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={cooldown > 0 || resendingVerification}
                      className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Send className="h-4 w-4" />
                      {resendingVerification
                        ? 'Sending...'
                        : cooldown > 0
                        ? `Resend available in ${cooldown}s`
                        : 'Resend Verification Email'}
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback toast */}
              {verificationNotice && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-xl p-3 text-xs font-medium ${
                    verificationNotice.type === 'success'
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                  }`}
                >
                  {verificationNotice.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  )}
                  <span>{verificationNotice.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Feature Gate Showcase */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  FarmMind Agricultural Workspace
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Role-based security demonstration: Unlocks with Email Verification
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                Live Simulation
              </span>
            </div>

            {gateAttemptBlocked && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <span>
                  <strong>Access Restricted:</strong> Precision Automated Irrigation requires a verified email address to safeguard hardware equipment. Please verify your email first!
                </span>
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Feature 1: Open to all logged-in */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Unlock className="h-3 w-3" /> Unlocked
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                  Crop Health Telemetry
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Soil nitrogen, phosphorus & NDVI index readings.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Soil Moisture:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">68% (Optimal)</span>
                </div>
              </div>

              {/* Feature 2: Open */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
                    <Radio className="h-4 w-4" />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Unlock className="h-3 w-3" /> Unlocked
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                  Weather Station Feed
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Local microclimate sensors & rain radar predictions.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Temp / Humidity:</span>
                  <span className="text-sky-600 dark:text-sky-400">24°C / 62%</span>
                </div>
              </div>

              {/* Feature 3: Gated behind Email Verification */}
              <div
                className={`rounded-2xl border p-4 transition ${
                  user?.emailVerified
                    ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20'
                    : 'border-amber-200 bg-amber-50/20 dark:border-amber-800 dark:bg-amber-950/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      user?.emailVerified
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}
                  >
                    <Droplets className="h-4 w-4" />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-semibold ${
                      user?.emailVerified
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {user?.emailVerified ? (
                      <>
                        <Unlock className="h-3 w-3" /> Verified Access
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" /> Requires Verification
                      </>
                    )}
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                  Smart Irrigation Valves
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Automated drip actuators across North Field.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={triggerGatedAction}
                    className={`w-full rounded-lg py-1.5 text-xs font-semibold shadow-sm transition ${
                      user?.emailVerified
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {irrigationStatus === 'running'
                      ? 'Cycles Active (Watering...)'
                      : user?.emailVerified
                      ? 'Trigger Irrigation Cycle'
                      : 'Unlock by Verifying Email'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account Info & Profile Management (1 col) */}
        <div className="space-y-8">
          {/* Card: Account Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
              Firebase Security Meta
            </h2>

            <dl className="mt-4 space-y-3 text-xs">
              <div>
                <dt className="text-slate-400">User UID</dt>
                <dd className="font-mono text-slate-700 dark:text-slate-300 break-all select-all">
                  {user?.uid}
                </dd>
              </div>

              <div>
                <dt className="text-slate-400">Authentication Provider</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                  {providerLabel}
                </dd>
              </div>

              <div>
                <dt className="text-slate-400">Account Created</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-300">
                  {user?.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleString()
                    : 'N/A'}
                </dd>
              </div>

              <div>
                <dt className="text-slate-400">Last Sign-In</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-300">
                  {user?.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Card: Update Profile */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
              Update Profile Name
            </h2>

            {profileMsg && (
              <div
                className={`mt-3 rounded-xl p-2.5 text-xs font-medium ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g. Parveen Shaik"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                {savingProfile ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save Name
              </button>
            </form>
          </div>

          {/* Card: Change Password (only if user logged in via password) */}
          {isPasswordUser && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                Change Password
              </h2>

              {passwordMsg && (
                <div
                  className={`mt-3 rounded-xl p-2.5 text-xs font-medium ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="mt-4 space-y-3">
                <div>
                  <label
                    htmlFor="new-pw"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="new-pw"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Min 6 characters"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-new-pw"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-pw"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Repeat new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {changingPassword ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  ) : (
                    <KeyRound className="h-3.5 w-3.5" />
                  )}
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
