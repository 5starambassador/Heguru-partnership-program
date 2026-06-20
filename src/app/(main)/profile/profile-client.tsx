"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Phone,
  Award,
  Calendar,
  Shield,
  Edit2,
  Check,
  X,
  Upload,
  Mail,
  MapPin,
  Trash2,
  ArrowRight,
  User,
  Camera,
  Settings,
  LogOut,
  ChevronRight,
  HelpCircle,
  CreditCard,
  Lock,
  Smartphone,
  Download,
  GraduationCap,
  ChevronLeft,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { PrivacyModal } from "@/components/PrivacyModal";
import { requestAccountDeletion } from "@/app/deletion-actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import { PageAnimate, PageItem } from "@/components/PageAnimate";
import Link from "next/link";
import { GRADES } from "@/lib/constants";
import { getCampuses } from "@/app/campus-actions";
import { getGradesForCampus } from "@/lib/grade-utils";
import { ifscSchema, accountNumberSchema } from "@/lib/validators";

interface ProfileClientProps {
  user: {
    userId?: number;
    adminId?: number;
    fullName: string;
    mobileNumber?: string;
    adminMobile?: string;
    role: string;
    referralCode?: string;
    assignedCampus?: string;
    yearFeeBenefitPercent?: number;
    longTermBenefitPercent?: number;
    profileImage?: string;
    email?: string;
    address?: string;
    createdAt: string;
    confirmedReferralCount?: number;
    studentFee?: number;
    // New fields
    childName?: string;
    grade?: string;
    childEprNo?: string;
    childCampusId?: number;
    empId?: string;
    transactionId?: string;
    childInHeguru?: boolean;
    status?: string;
    benefitStatus?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    securedValue?: number;
    projectedValue?: number;
    academicYear?: string;
  };
  logoutAction: () => Promise<{ success: boolean; error?: string }>;
}

import { useRouter } from "next/navigation";

export default function ProfileClient({
  user,
  logoutAction,
}: ProfileClientProps) {
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email || "");
  const [address, setAddress] = useState(user.address || "");
  const [bankName, setBankName] = useState(user.bankName || "");
  const [accountNumber, setAccountNumber] = useState(user.accountNumber || "");
  const [ifscCode, setIfscCode] = useState(user.ifscCode || "");

  const [childEprNo, setChildEprNo] = useState(user.childEprNo || "");
  const [childName, setChildName] = useState(user.childName || "");
  const [grade, setGrade] = useState(user.grade || "");
  const [academicYear, setAcademicYear] = useState(
    (user as any).academicYear || "2026-2027",
  );
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [childCampusId, setChildCampusId] = useState<string>(
    user.childCampusId ? user.childCampusId.toString() : "",
  );

  useEffect(() => {
    const fetchCampuses = async () => {
      const res = await getCampuses();
      if (res.success && res.campuses) {
        setCampuses(res.campuses);
      }
    };
    if ((user.role === "Staff" && user.childInHeguru) || user.role === "Parent")
      fetchCampuses();
  }, [user.role, user.childInHeguru]);

  // Derived or safe default stats
  const referralCount = user.confirmedReferralCount || 0;
  // Use projectedValue passed from server side calculations (Matches Dashboard Projected Growth)
  const totalEarned =
    user.projectedValue !== undefined ? user.projectedValue : 0;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setUploading(true);
      try {
        const response = await fetch("/api/profile/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        });
        if (response.ok) {
          setProfileImage(base64String);
          toast.success("Photo updated successfully");
        } else {
          toast.error("Failed to upload photo");
        }
      } catch (error) {
        toast.error("Error uploading photo");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        fullName,
        email,
        address,
        ...(isEditingProfile &&
          ((user.role === "Staff" && user.childInHeguru) ||
            user.role === "Parent") && {
            childEprNo,
            childName,
            grade,
            childCampusId: childCampusId ? parseInt(childCampusId) : undefined,
            academicYear,
          }),
        ...(isEditingBank && {
          bankName,
          accountNumber,
          ifscCode,
        }),
      };

      if (isEditingBank) {
        if (ifscCode) {
          const result = ifscSchema.safeParse(ifscCode);
          if (!result.success) {
            toast.error(result.error.issues[0].message);
            setSaving(false);
            return;
          }
        }
        if (accountNumber) {
          const result = accountNumberSchema.safeParse(accountNumber);
          if (!result.success) {
            toast.error(result.error.issues[0].message);
            setSaving(false);
            return;
          }
        }
      }

      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditingProfile(false);
        setIsEditingBank(false);
        router.refresh();
      } else {
        const data = await response.json();
        // Show specific functionality error if available
        toast.error(data.details || data.error || "Failed to update profile");
        console.error("Update failed:", data);
      }
    } catch {
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setEmail(user.email || "");
    setAddress(user.address || "");
    setBankName((user as any).bankName || "");
    setAccountNumber((user as any).accountNumber || "");
    setIfscCode((user as any).ifscCode || "");
    setChildEprNo((user as any).childEprNo || "");
    setChildName((user as any).childName || "");
    setGrade((user as any).grade || "");
    setAcademicYear((user as any).academicYear || "2026-2027");
    setIsEditingProfile(false);
    setIsEditingBank(false);
  };

  const handleDeleteRequest = async () => {
    const res = await requestAccountDeletion();
    if (res.success) {
      toast.success("Deletion request submitted to Super Admin.");
    } else {
      toast.error(res.error || "Failed to submit request");
    }
  };

  return (
    <div className="relative w-full font-[family-name:var(--font-outfit)]">
      {/* Main Content Container */}
      <PageAnimate className="relative z-10 w-full max-w-sm mx-auto flex flex-col pb-24 gap-6">
        <PageItem>
          <Link
            href="/dashboard"
            className="w-max px-4  h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm group"
          >
            <ArrowLeft
              size={18}
              className="text-gray-600 group-hover:text-gray-700 transition-colors"
            />
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
              Back
            </span>
          </Link>
        </PageItem>
        <header className="py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-[var(--deep-black)] tracking-tight uppercase  leading-none mb-1 font-heading">
                My Profile
              </h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em]">
              Edit Your Profile
            </p>
            </div>
          </div>

      <div className="flex items-center gap-3">
  {!isEditingProfile && !isEditingBank && (
    <button
      onClick={() => setIsEditingProfile(true)}
      className="rounded-full flex items-center justify-center transition-all text-primary-orange-hover hover:scale-110 cursor-pointer"
      role="button"
      aria-label="Edit Profile"
    >
        <div className="rounded-full p-2 border border-primary-orange">
          <Edit size={24} color="var(--primary-orange)" />
        </div>
      
    </button>
  )}
</div>
        </header>

        {/* Hero Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/20 to-transparent opacity-40" />

          {/* Avatar with ring */}
          <div className="relative mb-4 group">
            <div className="relative w-24 h-24 rounded-full border-4 border-slate-50 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden shadow-md">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-slate-700">
                  {fullName ? fullName.charAt(0) : <User />}
                </span>
              )}
            </div>

            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white text-slate-600 hover:text-slate-800 flex items-center justify-center border border-gray-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <Camera size={12} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 rounded-full">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-1 font-heading">
            {fullName}
          </h2>

          {user.yearFeeBenefitPercent !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6 text-[var(--primary-orange)]">
              <Star
                size={10}
                className="fill-[var(--primary-orange)] text-[var(--primary-orange)]"
              />
              <span className="text-[9px] font-black uppercase tracking-widest font-heading">
                {referralCount >= 5 ? "Prestigious Partner" : "Ambassador"}
              </span>
            </div>
          )}

          {/* Professional Metrics - MATCHES DASHBOARD STAT CARDS */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
              <span className="text-xl font-black text-slate-800 mb-0.5 font-heading">
                {referralCount}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                Confirmed Referrals
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
              <span className="text-xl font-black text-slate-800 mb-0.5 font-heading">
                ₹{(user as any).securedValue?.toLocaleString("en-IN") || "0"}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                Total Yield
              </span>
            </div>
          </div>
        </div>

        {/* Potential Growth Indicator */}
        {(user as any).projectedValue > (user as any).securedValue && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[9px] text-amber-800/80 font-black uppercase tracking-widest mb-1 font-heading">
                Projected Potential
              </p>
              <p className="text-lg font-black text-amber-700 tracking-tight font-heading">
                ₹{(user as any).projectedValue?.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-200 text-amber-600 shadow-sm">
              <Award size={18} />
            </div>
          </div>
        )}

        {/* Student Details Card (For Parents & Staff with Linked Children) */}
        {((user as any).childName || (user as any).childEprNo) && (
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/20 to-transparent opacity-40" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide font-heading">
                      Student Details
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {(() => {
                        const isVerified = (user as any).childInHeguru;
                        const s = (user as any).benefitStatus;

                        if (isVerified) {
                          return (
                            <>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 font-heading">
                                Verified
                              </span>
                            </>
                          );
                        }

                        if (s === "PendingVerification") {
                          return (
                            <>
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 font-heading">
                                Pending Check
                              </span>
                            </>
                          );
                        }

                        return (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 font-heading">
                                Action Required
                              </span>
                            </div>
                            <button
                              onClick={() => setIsEditingProfile(true)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-1 font-heading"
                            >
                              <Edit2 size={8} strokeWidth={3} />
                              Fix Details
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 relative z-10 border-t border-slate-100 pt-3 mt-3">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    Student Name
                  </p>
                  <p className="text-sm font-bold text-slate-700 tracking-tight truncate">
                    {(user as any).childName || "Pending..."}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    Grade
                  </p>
                  <p className="text-sm font-bold text-slate-700 tracking-tight font-heading">
                    {(user as any).grade || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    ERP Number
                  </p>
                  <p className="text-xs font-mono text-blue-600 font-bold tracking-wider">
                    {(user as any).childEprNo || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    Campus
                  </p>
                  <p className="text-xs font-bold text-slate-700 tracking-tight truncate font-heading">
                    {user.role === "Staff"
                      ? campuses.find(
                          (c) => c.id === (user as any).childCampusId,
                        )?.campusName || "Loading..."
                      : (user as any).assignedCampus || "Heguru"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    Academic Year
                  </p>
                  <p className="text-sm font-bold text-slate-700 tracking-tight">
                    {(user as any).academicYear || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompt to Link Child if Missing (Parents & Relevant Staff) */}
        {(user.role === "Parent" ||
          (user.role === "Staff" && user.childInHeguru)) &&
          !(user as any).childName &&
          !(user as any).childEprNo && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="w-full bg-white border border-gray-200 rounded-xl p-5 hover:bg-slate-50 transition-all active:scale-[0.99] shadow-sm flex items-center gap-4 text-left relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/25 to-transparent opacity-40" />
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide group-hover:text-[var(--primary-orange)] transition-colors font-heading">
                  Link Child Details
                </h3>
                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                  Claim your <strong>School Fee Discount</strong> by linking
                  your child's ERP details.
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-300 group-hover:text-slate-500 transition-colors"
              />
            </button>
          )}

        {/* Edit Form or Menu List */}
        <div className="space-y-4">
          {/* PROFILE EDIT MODE */}
          {isEditingProfile ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/25 to-transparent opacity-40" />

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                    Edit Personal Details
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors text-slate-500"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-slate-800 focus:border-[var(--primary-orange)] focus:outline-none transition-colors text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Add email address"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-slate-800 focus:border-[var(--primary-orange)] focus:outline-none transition-colors text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Add your address"
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-slate-800 focus:border-[var(--primary-orange)] focus:outline-none transition-colors text-sm font-medium resize-none"
                  />
                </div>

                {/* Child Details Section for Staff (with child opt-in) & Parents */}
                {((user.role === "Staff" && user.childInHeguru) ||
                  user.role === "Parent") && (
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[var(--primary-orange)] uppercase tracking-wide font-heading">
                        Child Details (Heguru)
                      </h3>
                      {(user as any).childInHeguru && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                          <Lock size={10} className="text-emerald-600" />
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider font-heading">
                            Verified & Locked
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                        ERP Number
                      </label>
                      <input
                        type="text"
                        value={childEprNo}
                        onChange={(e) => setChildEprNo(e.target.value)}
                        placeholder="Enter ERP Number"
                        disabled={(user as any).childInHeguru}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 transition-colors focus:outline-none text-sm font-medium ${
                          (user as any).childInHeguru
                            ? "border-transparent bg-slate-50 text-slate-400 cursor-not-allowed shadow-none"
                            : "border-gray-300 focus:border-[var(--primary-orange)]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                        Child Name
                      </label>
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Enter Child Name"
                        disabled={(user as any).childInHeguru}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 transition-colors focus:outline-none text-sm font-medium ${
                          (user as any).childInHeguru
                            ? "border-transparent bg-slate-50 text-slate-400 cursor-not-allowed shadow-none"
                            : "border-gray-300 focus:border-[var(--primary-orange)]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                        Campus
                      </label>
                      <select
                        value={childCampusId}
                        onChange={(e) => {
                          setChildCampusId(e.target.value);
                          setGrade(""); // Reset grade on campus change
                        }}
                        disabled={(user as any).childInHeguru}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 transition-colors focus:outline-none text-sm font-medium ${
                          (user as any).childInHeguru
                            ? "border-transparent bg-slate-50 text-slate-400 cursor-not-allowed shadow-none"
                            : "border-gray-300 focus:border-[var(--primary-orange)] cursor-pointer"
                        }`}
                      >
                        <option value="" className="text-slate-400">
                          Select Campus
                        </option>
                        {campuses.map((c) => (
                          <option
                            key={c.id}
                            value={c.id}
                            className="text-slate-800"
                          >
                            {c.campusName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                        Grade
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        disabled={(user as any).childInHeguru || !childCampusId}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 transition-colors focus:outline-none text-sm font-medium ${
                          (user as any).childInHeguru || !childCampusId
                            ? "border-transparent bg-slate-50 text-slate-400 cursor-not-allowed shadow-none"
                            : "border-gray-300 focus:border-[var(--primary-orange)] cursor-pointer"
                        }`}
                      >
                        <option value="" className="text-slate-400">
                          {!childCampusId
                            ? "Select Campus First"
                            : "Select Grade"}
                        </option>
                        {(() => {
                          const supportedGrades = getGradesForCampus(
                            childCampusId,
                            campuses,
                          );

                          // Fallback: If strict matching returns nothing, show all GRADES to avoid blocking user
                          if (supportedGrades.length === 0) {
                            return (GRADES as readonly string[]).map((g) => (
                              <option
                                key={g}
                                value={g}
                                className="text-slate-800"
                              >
                                {g}
                              </option>
                            ));
                          }

                          return supportedGrades.map((g) => (
                            <option
                              key={g}
                              value={g}
                              className="text-slate-800"
                            >
                              {g}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                        Academic Year
                      </label>
                      <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        disabled={(user as any).childInHeguru}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 transition-colors focus:outline-none text-sm font-medium ${
                          (user as any).childInHeguru
                            ? "border-transparent bg-slate-50 text-slate-400 cursor-not-allowed shadow-none"
                            : "border-gray-300 focus:border-[var(--primary-orange)] cursor-pointer"
                        }`}
                      >
                        <option value="2025-2026">2025-2026</option>
                        <option value="2026-2027">2026-2027</option>
                      </select>
                    </div>
                    {!(user as any).childInHeguru ? (
                      <p className="text-[10px] text-amber-700 ml-1 flex items-start gap-1.5 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <Shield
                          size={12}
                          className="shrink-0 mt-0.5 text-amber-600"
                        />
                        <span>
                          Updating these details will reset your benefit status
                          to <strong>Pending Verification</strong> until
                          approved by Admin.
                        </span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-emerald-700 ml-1 flex items-start gap-1.5 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <Shield
                          size={12}
                          className="shrink-0 mt-0.5 text-emerald-600"
                        />
                        <span>
                          These details are verified. Contact Admin to request
                          changes.
                        </span>
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold uppercase tracking-widest shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 mt-4 font-heading"
                >
                  {saving ? "Saving..." : "Save Profile Only"}
                  {!saving && <Check size={16} />}
                </button>
              </div>
            </div>
          ) : isEditingBank ? (
            /* BANK EDIT MODE */
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/25 to-transparent opacity-40" />

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                    Edit Bank Details
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors text-slate-500"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <Shield
                    size={16}
                    className="text-emerald-600 mt-0.5 shrink-0"
                  />
                  <p className="text-[10px] text-emerald-700 font-bold leading-relaxed">
                    These details are Encrypted & Secure. They will be used for
                    your payout processing.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-slate-800 focus:border-[var(--primary-orange)] focus:outline-none transition-colors text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter Account No."
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-slate-800 focus:border-[var(--primary-orange)] focus:outline-none transition-colors text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0001234"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-slate-800 focus:border-[var(--primary-orange)] focus:outline-none transition-colors text-sm font-medium uppercase"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold uppercase tracking-widest shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 mt-4 font-heading"
                >
                  {saving ? "Saving..." : "Update Bank Details"}
                  {!saving && <Check size={16} />}
                </button>
              </div>
            </div>
          ) : (
            /* READ ONLY MODE */
            <>
              {/* Read-Only Menu Links - Separated Cards for Premium Feel */}
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/10 to-transparent opacity-30" />
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">
                      Mobile
                    </p>
                    <p className="text-sm font-bold text-slate-700 tracking-tight font-heading">
                      {user.mobileNumber || user.adminMobile || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/10 to-transparent opacity-30" />
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-bold text-slate-700 tracking-tight font-heading truncate">
                      {email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/10 to-transparent opacity-30" />
                  <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-bold text-slate-700 tracking-tight font-heading truncate">
                      {address || "No address set"}
                    </p>
                  </div>
                </div>

                {/* Bank Details Read-Only Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group relative shadow-sm overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/10 to-transparent opacity-30" />
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <CreditCard size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        Bank Details
                      </p>
                      <button
                        onClick={() => setIsEditingBank(true)}
                        className="p-1 rounded-lg border border-gray-200 hover:bg-slate-100 text-slate-500 hover:text-[var(--primary-orange)] transition-colors"
                        title="Edit Bank Details"
                      >
                        <Edit2 size={10} strokeWidth={3} />
                      </button>
                    </div>
                    {bankName || accountNumber ? (
                      <div className="text-xs text-slate-700 font-mono tracking-tight">
                        <p className="font-bold">{bankName}</p>
                        <p className="font-bold">{accountNumber}</p>
                        <p className="text-slate-400 text-[10px] font-bold">
                          {ifscCode}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs font-bold text-slate-400 tracking-tight">
                          Not Provided
                        </p>
                        <button
                          onClick={() => setIsEditingBank(true)}
                          className="text-[10px] font-black text-emerald-600 uppercase tracking-wider hover:underline font-heading"
                        >
                          Add Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Danger Zone Links */}
              <div className="space-y-4 pt-2">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:bg-slate-50 hover:border-gray-300 transition-all group active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Shield size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm font-heading">
                        Privacy & Security
                      </h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        Manage data & policies
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-slate-500 transition-colors"
                  />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100/50 hover:border-rose-200 transition-all group active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Trash2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-rose-700 text-sm font-heading">
                        Delete Account
                      </h3>
                      <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">
                        Permanent action
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-rose-300 group-hover:text-rose-500 transition-colors"
                  />
                </button>
              </div>
            </>
          )}
        </div>

        {/* App Download / PWA Section */}
        <div className="pt-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 relative overflow-hidden group shadow-sm hover:shadow transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/25 to-transparent opacity-40" />

            <div className="flex items-start gap-4 mb-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                <Smartphone size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1 font-heading">
                  Heguru Mobile App
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wide">
                  Install our official app for a faster experience, offline
                  access, and instant notifications.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                // Dispatch custom event to trigger global install prompt if available
                window.dispatchEvent(new CustomEvent("trigger-PWA-install"));
                toast.info("App Installation Guide Opened", {
                  description:
                    "Follow the steps in the guide to install the app on your home screen.",
                });
              }}
              className="w-full bg-[var(--learning-blue)] hover:bg-blue-600 text-white h-11 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all font-heading"
            >
              <Download size={16} />
              Download App
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="pt-4 pb-4">
          <button
            onClick={async () => {
              try {
                const result = await logoutAction();
                if (result.success) {
                  router.push("/");
                } else {
                  toast.error(result.error || "Failed to sign out");
                }
              } catch (error) {
                console.error("Logout error:", error);
                toast.error("Failed to sign out");
              }
            }}
            className="w-full h-12 rounded-xl border border-gray-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 flex items-center justify-center gap-2 font-bold transition-all active:scale-95 text-xs uppercase tracking-widest font-heading shadow-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <p className="text-center text-[9px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
            Heguru Partnership Program • v2.5.0
          </p>
        </div>
      </PageAnimate>

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Account?"
        description={
          <div className="space-y-2 text-left">
            <p className="font-medium text-slate-850">
              Are you absolutely sure?
            </p>
            <p className="text-sm text-slate-500">
              This will permanently remove your account and all associated data.
              This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Delete My Account"
        variant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          handleDeleteRequest();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
