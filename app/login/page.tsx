'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShieldCheck, Activity, ArrowRight, Lock, Mail, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const [email, setEmail] = useState('elena@primepmo.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/command-center');
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage('An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('elena@primepmo.com');
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col justify-between font-sans relative overflow-hidden bg-grid-technical selection:bg-[#2F80ED] selection:text-white">
      {/* Top Simple Brand Bar */}
      <header className="px-6 py-4 border-b border-[#1B2735] flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#0B1F3A] border border-[#1E5A91] flex items-center justify-center text-[#2F80ED]">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white">
                Coordination Intelligence
              </h1>
              <span className="text-[10px] font-mono font-bold bg-[#0A0F16] text-[#A7B0BC] border border-[#1B2735] px-1.5 py-0.5 rounded">
                AS-01
              </span>
            </div>
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs text-[#A7B0BC] hover:text-[#2F80ED] transition-colors font-medium"
        >
          ← Back to Overview
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* LEFT COLUMN: Enterprise Value Statement */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#0B1F3A] border border-[#1E5A91]/50 px-3 py-1 rounded-full text-xs text-[#2F80ED] font-mono font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>AEC ENTERPRISE MISSION CONTROL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-sans">
            Understand the impact of every change <span className="text-[#2F80ED]">before it becomes a delay.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#A7B0BC] leading-relaxed max-w-md">
            Connect architectural designs, structural models, vendor fabrications, and municipal approvals into one unified dependency control DAG.
          </p>

          <div className="space-y-3 pt-4 border-t border-[#1B2735]">
            <div className="flex items-center gap-3 text-xs text-[#A7B0BC]">
              <div className="h-2 w-2 rounded-full bg-[#2F80ED]"></div>
              <span>Real-time dynamic DAG blast radius calculations</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#A7B0BC]">
              <div className="h-2 w-2 rounded-full bg-[#2F80ED]"></div>
              <span>Automated role-based responsibility matrix & alerts</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#A7B0BC]">
              <div className="h-2 w-2 rounded-full bg-[#2F80ED]"></div>
              <span>Immutable audit trail and immutable project memory</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Enterprise Sign-In Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Enterprise Sign In</h3>
              <p className="text-xs text-[#A7B0BC]">
                Enter your authorized project credentials to open workspace.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-[#3A0B0E] border border-red-500/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in duration-150">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Authentication Failed</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#A7B0BC] uppercase tracking-wider block">
                  Project Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#6F7B88]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#6F7B88] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#A7B0BC] uppercase tracking-wider block">
                    Password
                  </label>
                  <span className="text-[11px] text-[#6F7B88] hover:text-[#2F80ED] cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#6F7B88]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#6F7B88] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1E5A91] hover:bg-[#2F80ED] disabled:bg-[#123B66] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-[#2F80ED]/40 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Command Center</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="pt-4 border-t border-[#1B2735] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#6F7B88]">
                <span>Hackathon Judge Demo Credentials:</span>
                <span className="font-mono text-[#A7B0BC]">elena@primepmo.com</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full text-center text-xs text-[#2F80ED] hover:underline font-semibold bg-[#0B1F3A]/40 border border-[#1E5A91]/40 py-2 rounded-lg transition-colors"
              >
                Auto-fill Demo Credentials & Login
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#1B2735] text-center text-xs text-[#6F7B88] z-10">
        AEC Coordination Intelligence Engine • v1.0.4-prod • Enterprise Security Compliant
      </footer>
    </div>
  );
}
