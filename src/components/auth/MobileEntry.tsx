"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface MobileEntryProps {
  mobile: string;
  setMobile: (value: string) => void;
  onNext: () => void;
  loading: boolean;
}

export const MobileEntry = ({
  mobile,
  setMobile,
  onNext,
  loading,
}: MobileEntryProps) => {
  // START FIX: Local loading state to prevent double submission
  const [localLoading, setLocalLoading] = useState(false);

  const handleNext = () => {
    if (loading || localLoading) return;
    if (mobile.length !== 10) return;

    setLocalLoading(true);
    onNext();
    // Reset local loading after 5s just in case (though parent should handle unmount/transition)
    setTimeout(() => setLocalLoading(false), 5000);
  };
  // END FIX

  return (
    <div className="space-y-4">
      <div className="text-center">
        <img
          src="/images/HEGURU-JAPAN-LOGO.jpeg"
          alt="Heguru Japan Logo"
          className="h-14 sm:h-20 w-auto mx-auto  sm:mb-4 mb-5 rounded-md border border-[var(--warm-gray)] shadow-sm"
        />

        <p className="text-[12px] my-5 text-[var(--text-gray)] font-bold uppercase tracking-[0.2em]">
          HEGURU Partnership Program
        </p>

        {/* Main Action Title - Dominant */}
        <h2 className="text-3xl sm:text-4xl font-black text-[var(--deep-black)] tracking-tighter mb-1 mt-6 sm:mb-2 font-heading">
          Member Access
        </h2>
        <p className="text-[var(--text-gray)] text-xs sm:text-sm font-medium tracking-wide">
          Enter your mobile number to begin
        </p>
      </div>

      <div className="space-y-5">
        <div className="group relative">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 z-20 pointer-events-none">
            <span className="text-[var(--text-gray)]/60 font-black text-lg tracking-widest tabular-nums">
              +91
            </span>
            <div className="w-px h-5 bg-black"></div>
          </div>
          <input
            type="tel"
            autoFocus
            autoComplete="tel"
            inputMode="numeric"
            className={`relative z-10 block w-max-content flex mx-auto my-8 bg-white border border-[var(--warm-gray)] rounded-xl pl-24 pr-6 h-14 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-md transition-all text-lg sm:text-xl font-black tracking-[0.15em] sm:tracking-[0.3em] tabular-nums text-left ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder="00000 00000"
            value={mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) setMobile(value);
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && mobile.length === 10 && handleNext()
            }
            maxLength={10}
          />
          {mobile.length > 0 && mobile.length < 10 && (
            <p className="text-center text-[10px] text-[var(--primary-orange)] mt-2 font-bold uppercase tracking-wider animate-pulse">
              {10 - mobile.length} digits remaining
            </p>
          )}
        </div>

        <button
          className={`w-full h-14 rounded-2xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:from-[var(--primary-orange-hover)] hover:to-[#be4800] text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-[var(--primary-orange)]/10 hover:shadow-[var(--primary-orange)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-transparent ${
            mobile.length !== 10 || loading || localLoading
              ? "opacity-50 cursor-not-allowed grayscale"
              : ""
          }`}
          onClick={handleNext}
          disabled={loading || localLoading || mobile.length !== 10}
        >
          {loading || localLoading ? "Authenticating..." : "Secure Access"}
        </button>
      </div>

      <div className="hidden sm:block mt-4"></div>
    </div>
  );
};
