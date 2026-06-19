"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Bell,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getNotifications, markAsRead } from "@/app/notification-actions";
import { NotificationDetailModal } from "./NotificationDetailModal";
import { NotificationDropdown } from "./NotificationDropdown";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead?: boolean;
  createdAt: Date | string;
}

export function NotificationTicker({
  userName,
  referralCode,
}: {
  userName?: string;
  referralCode?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [selectedNotificationForModal, setSelectedNotificationForModal] =
    useState<Notification | null>(null);

  const fetchLatestNotifications = async () => {
    const res = await getNotifications(1, 10);
    if (res.success && res.notifications && res.notifications.length > 0) {
      // Only scroll the latest 5 messages
      setNotifications((res.notifications as any[]).slice(0, 5));
    } else {
      setNotifications([
        {
          id: 0,
          title: "Welcome!",
          message: "Explore the dashboard and start referring to earn rewards.",
          type: "info",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setIsVisible(true);
  };

  useEffect(() => {
    fetchLatestNotifications();
    const interval = setInterval(fetchLatestNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifications.length > 1 && !isPaused) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
      }, 5000); // 5 seconds per message
      return () => clearInterval(timer);
    }
  }, [notifications.length, isPaused, timerResetKey]);

  // Reset index if notifications change and current index is out of bounds
  useEffect(() => {
    if (currentIndex >= notifications.length && notifications.length > 0) {
      setCurrentIndex(0);
    }
  }, [notifications.length]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
    setTimerResetKey((k) => k + 1);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(
      (prev) => (prev - 1 + notifications.length) % notifications.length,
    );
    setTimerResetKey((k) => k + 1);
  };

  const handleTickerClick = async () => {
    const current = notifications[currentIndex];
    if (current) {
      setSelectedNotificationForModal(current);
      if (!current.isRead) {
        await markAsRead(current.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === current.id ? { ...n, isRead: true } : n)),
        );
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={14} className="text-green-400" />;
      case "warning":
        return <AlertTriangle size={14} className="text-amber-400" />;
      case "error":
        return <XCircle size={14} className="text-red-400" />;
      default:
        return <Info size={14} className="text-blue-400" />;
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  const current = notifications[currentIndex];
  if (!current) return null; // Final safety guard

  return (
    <div className="max-w-[1400px] fixed top-16 left-0 right-0 xl:sticky xl:top-2 z-[110] px-8 py-2 bg-transparent">
      <div className="max-w-container mx-auto flex items-center gap-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          className="relative flex-1 min-w-0 overflow-hidden cursor-pointer group rounded-full border border-white/20 bg-gradient-to-br from-orange-400 via-[var(--primary-orange)] to-[var(--primary-orange-hover)] shadow-[0_10px_30px_rgba(249,115,22,0.35),0_4px_12px_rgba(249,115,22,0.25),inset_0_2px_2px_rgba(255,255,255,0.35),inset_0_-4px_10px_rgba(0,0,0,0.15)]"
          onClick={handleTickerClick}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Premium Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/15 to-transparent pointer-events-none" />

          <div className="absolute -top-10 left-1/4 h-20 w-40 rounded-full bg-white/20 blur-3xl pointer-events-none" />

          <div className="absolute bottom-0 right-0 h-20 w-32 rounded-full bg-orange-900/20 blur-2xl pointer-events-none" />

          {/* Metallic Top Highlight */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-white/50 pointer-events-none" />

          <div className="absolute top-1 left-12 right-12 h-4 rounded-full bg-white/15 blur-md pointer-events-none" />

          <div className="flex items-center h-14 relative z-20">
            {/* Premium Icon Section */}
            <div className="flex items-center gap-3 px-3 shrink-0 h-full">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md scale-125" />

                <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 via-orange-400 to-orange-700 border border-white/30 shadow-[0_4px_15px_rgba(255,255,255,0.15),inset_0_2px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.25)]">
                  {/* Gloss */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white/40 blur-sm" />

                  <Megaphone
                    size={16}
                    className="text-white relative z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                  />
                </div>

                <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                </span>
              </div>

              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.25em] text-white/95 drop-shadow-sm">
                Live Updates
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden h-full flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="flex items-center gap-2.5 h-full px-1"
                >
                  <div className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                    {current.type || "info"}
                  </div>

                  <span className="text-[12px] font-bold text-white line-clamp-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                    {(current.message || "")
                      .replace(
                        /{userName}|{Ambassador}/g,
                        userName || "Ambassador",
                      )
                      .replace(/{referralCode}|{code}/g, referralCode || "")}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Premium Navigation */}
            <div className="px-3 shrink-0 flex items-center gap-2 h-full">
              {notifications.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    title="Previous"
                    className="group/nav flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/25 transition-all duration-300 active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    onClick={handleNext}
                    title="Next"
                    className="group/nav flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/25 transition-all duration-300 active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Large Premium Shimmer */}
          <motion.div
            animate={{
              x: ["-150%", "250%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
              repeatDelay: 1,
            }}
            className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[25deg] pointer-events-none"
          />

          {/* Secondary Gloss Sweep */}
          <motion.div
            animate={{
              x: ["-200%", "250%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "linear",
              repeatDelay: 2,
            }}
            className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[30deg] pointer-events-none"
          />
        </motion.div>

        {/* Bell Icon Dropdown container */}
        <div className="relative shrink-0 h-12 w-12 group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 via-primary-orange to-orange-700 shadow-[0_8px_20px_rgba(249,115,22,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110">
            {/* Top glossy highlight */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white/30 blur-sm" />

            {/* Animated shimmer */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute -left-10 top-0 h-full w-6 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_3s_linear_infinite]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <NotificationDropdown
                userName={userName}
                referralCode={referralCode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      <NotificationDetailModal
        isOpen={!!selectedNotificationForModal}
        onClose={() => setSelectedNotificationForModal(null)}
        notification={selectedNotificationForModal}
        userName={userName}
        referralCode={referralCode}
        getIcon={getIcon}
      />
    </div>
  );
}
