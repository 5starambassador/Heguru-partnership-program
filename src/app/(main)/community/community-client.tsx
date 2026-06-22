"use client";

import React, { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Camera,
  Link2,
  X,
  Send,
  Trash2,
  Loader2,
  Shield,
  Globe,
  Image as ImageIcon,
  BookmarkCheck,
  MapPin as Location,
  MoreVertical,
  Youtube,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { PageAnimate, PageItem } from "@/components/PageAnimate";
import {
  createCommunityPost,
  toggleLikePost,
  addComment,
  toggleSavePost,
  deleteCommunityPost,
  getCommunityPosts,
} from "@/app/community-actions";

interface Post {
  postId: number;
  content: string;
  image: string | null;
  link: string | null;
  createdAt: Date | string;
  userId: number | null;
  adminId: number | null;
  authorName: string;
  authorImage: string;
  authorRole: string;
  authorCampus: string;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  likeCount: number;
  commentCount: number;
  comments: Array<{
    commentId: number;
    content: string;
    createdAt: Date | string;
    authorName: string;
    authorImage: string;
    authorRole: string;
    authorCampus: string;
  }>;
  priorityWeight: number;
}

interface CommunityClientProps {
  currentUser: {
    userId: number;
    fullName: string;
    profileImage: string;
    role: string;
    isAdmin: boolean;
  };
  initialPosts: Post[];
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let compressedBase64 = canvas.toDataURL("image/jpeg", quality);

        // Iteratively compress quality if base64 size exceeds 1MB limit (~1.3MB raw string size)
        while (compressedBase64.length > 1.3 * 1024 * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const getYouTubeId = (url: string | null): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export function CommunityClient({
  currentUser,
  initialPosts,
}: CommunityClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<"feed" | "saved">("feed");

  // Post form states
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  // Comment inputs state map: postId -> comment text
  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [activeMenuPostId, setActiveMenuPostId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshFeed = async () => {
    const res = await getCommunityPosts();
    if (res.success && res.posts) {
      setPosts(res.posts);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile && !youtubeUrl.trim() && !linkUrl.trim()) {
      toast.error("Post content, an image, a link, or a video is required");
      return;
    }

    setIsPosting(true);
    try {
      let compressedBase64: string | undefined = undefined;
      if (imageFile) {
        compressedBase64 = await compressImage(imageFile);
      }

      const finalLink = youtubeUrl.trim() || linkUrl.trim();
      const res = await createCommunityPost(content, compressedBase64, finalLink);
      if (res.success) {
        toast.success("Post shared with the community!");
        setContent("");
        handleRemoveImage();
        setLinkUrl("");
        setShowLinkInput(false);
        setYoutubeUrl("");
        setShowYoutubeInput(false);
        await refreshFeed();
      } else {
        toast.error(res.error || "Failed to create post");
      }
    } catch (error) {
      toast.error("An error occurred while sharing your post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    // Optimistic UI Update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.postId === postId) {
          return {
            ...p,
            isLikedByMe: !p.isLikedByMe,
            likeCount: p.isLikedByMe ? p.likeCount - 1 : p.likeCount + 1,
          };
        }
        return p;
      }),
    );

    const res = await toggleLikePost(postId);
    if (!res.success) {
      // Revert on failure
      await refreshFeed();
      toast.error("Failed to register like");
    }
  };

  const handleSave = async (postId: number) => {
    // Optimistic UI Update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.postId === postId) {
          return {
            ...p,
            isSavedByMe: !p.isSavedByMe,
          };
        }
        return p;
      }),
    );

    const res = await toggleSavePost(postId);
    if (res.success) {
      toast.success(
        res.saved ? "Post saved to bookmarks" : "Post removed from bookmarks",
      );
    } else {
      await refreshFeed();
      toast.error("Failed to save post");
    }
  };

  const handleCommentSubmit = async (postId: number) => {
    const text = commentTexts[postId] || "";
    if (!text.trim()) return;

    // Clear comment input immediately
    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));

    const res = await addComment(postId, text);
    if (res.success) {
      toast.success("Comment added");
      await refreshFeed();
    } else {
      toast.error(res.error || "Failed to post comment");
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action is permanent.",
      )
    )
      return;

    const res = await deleteCommunityPost(postId);
    if (res.success) {
      toast.success("Post deleted successfully");
      setPosts((prev) => prev.filter((p) => p.postId !== postId));
    } else {
      toast.error(res.error || "Failed to delete post");
    }
  };

  const handleNativeShare = async (post: Post) => {
    const postUrl = `${window.location.origin}/community?post=${post.postId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.authorName}'s Post`,
          text: post.content,
          url: postUrl,
        });
        toast.success("Shared successfully");
      } catch (err) {
        console.error("Native share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success("Post link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  const filteredPosts =
    activeTab === "saved" ? posts.filter((p) => p.isSavedByMe) : posts;

  return (
    <PageAnimate className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
      {/* Feed Section */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--deep-black)] uppercase font-heading">
              Ambassador Community
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-1">
              Connect, Share, and Inspire
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "feed"
                  ? "bg-white text-primary-orange-hover shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Feed
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "saved"
                  ? "bg-white text-primary-orange-hover shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookmarkCheck size={14} />
              Bookmarks
            </button>
          </div>
        </div>

        {/* Create Post Card */}
        {activeTab === "feed" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="md:flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center text-xs font-black text-white bg-primary-orange-hover rounded-full ring-2 ring-orange-100 shadow-md shrink-0 select-none">
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    currentUser.fullName[0].toUpperCase()
                  )}

                  
                </div>

                <span className="font-medium font-heading capitalize">{currentUser.fullName}</span>
                </div>
                <div className="flex-1 md:border-t-0 border-t md:mt-0 mt-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Share something with the community, ${
                      currentUser.fullName.split(" ")[0]
                    }...`}
                    className="w-full min-h-[80px] bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary-orange-hover/20 outline-none resize-none transition-all"
                    maxLength={1000}
                  />
                </div>
              </div>

              {/* Image Attachment Preview */}
              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-150 max-h-[300px] flex items-center justify-center bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="max-h-[300px] w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors shadow-lg"
                    title="Remove photo"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Link Attachment Input */}
              {showLinkInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 border border-orange-100 bg-orange-50/50 rounded-xl p-2.5"
                >
                  <Link2 size={16} className="text-primary-orange-hover" />
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Paste link here (e.g. https://example.com)"
                    className="flex-1 bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 border-none outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl("");
                      setShowLinkInput(false);
                    }}
                    className="p-1 hover:bg-slate-200/50 rounded"
                  >
                    <X size={14} className="text-slate-400" />
                  </button>
                </motion.div>
              )}

              {/* YouTube Video Attachment Input */}
              {showYoutubeInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 border border-red-200 bg-red-50/50 rounded-xl p-2.5"
                >
                  <Video size={16} className="text-red-500 shrink-0" />
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => {
                      setYoutubeUrl(e.target.value);
                      if (e.target.value.trim()) {
                        setLinkUrl("");
                        setShowLinkInput(false);
                      }
                    }}
                    placeholder="Paste YouTube video link (e.g. https://youtube.com/watch?v=...)"
                    className="flex-1 bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 border-none outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setYoutubeUrl("");
                      setShowYoutubeInput(false);
                    }}
                    className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                  >
                    <X size={14} className="text-slate-400" />
                  </button>
                </motion.div>
              )}

              {/* Actions & Submit */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-primary-orange-hover bg-slate-55 hover:bg-orange-50/50 border border-slate-150 rounded-xl transition-all text-xs font-black uppercase tracking-wider"
                    title="Add Photo"
                  >
                    <Camera size={14} />
                    <span className="hidden sm:inline">Add Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkInput((prev) => !prev);
                      if (!showLinkInput) {
                        setShowYoutubeInput(false);
                        setYoutubeUrl("");
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl transition-all text-xs font-black uppercase tracking-wider ${
                      showLinkInput
                        ? "text-primary-orange-hover bg-orange-50/70 border-orange-200"
                        : "text-slate-500 hover:text-primary-orange-hover bg-slate-55 hover:bg-orange-50/50 border-slate-150"
                    }`}
                    title="Add Link"
                  >
                    <Link2 size={14} />
                    <span className="hidden sm:inline">Add Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowYoutubeInput((prev) => !prev);
                      if (!showYoutubeInput) {
                        setShowLinkInput(false);
                        setLinkUrl("");
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl transition-all text-xs font-black uppercase tracking-wider ${
                      showYoutubeInput
                        ? "text-red-600 bg-red-50 border-red-200"
                        : "text-slate-500 hover:text-red-500 bg-slate-55 hover:bg-red-50/50 border-slate-150"
                    }`}
                    title="Add YouTube Video"
                  >
                    <Video size={14} />
                    <span className="hidden sm:inline">Add Video</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isPosting || (!content.trim() && !imageFile && !youtubeUrl.trim() && !linkUrl.trim())}
                  className="flex items-center gap-2 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                >
                  {isPosting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span className="hidden sm:inline">Sharing...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Feed Stream */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center shadow-sm">
              <Users size={48} className="mx-auto text-slate-350 mb-3" />
              <h3 className="font-bold text-slate-700">
                No community posts found
              </h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                Be the first to post something in the feed!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <motion.div
                key={post.postId}
                layout
                className={`md:bg-white md:rounded-2xl md:p-5 shadow-sm relative md:overflow-hidden overflow-visible transition-all duration-300 ${
                  post.adminId
                    ? "border-amber-200 shadow-[0_4px_20px_rgba(245,158,11,0.06)]"
                    : "border-slate-200"
                }`}
              >
                {/* Admin priority indicator badge */}
                {post.adminId && (
                  <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                )}

                {/* Card Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 flex items-center justify-center text-xs font-black text-white bg-primary-orange-hover rounded-full ring-2 ring-orange-100 shadow-md shrink-0 overflow-hidden">
                      {post.authorImage ? (
                        <img
                          src={post.authorImage}
                          alt={post.authorName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        post.authorName[0].toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-black text-sm text-[var(--deep-black)] uppercase tracking-tight truncate">
                          {post.authorName}
                        </span>
                        {post.adminId ? (
                          <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <Shield size={8} /> Admin Post
                          </span>
                        ) : (
                          <span className="bg-slate-50 border border-slate-150 text-slate-500 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                            {post.authorRole}
                          </span>
                        )}
                      </div>

                      <p className="md:text-[9px] text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="flex items-center gap-1">
                          <Location size={10} className="text-slate-350" />
                          <span>{post.authorCampus}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Desktop Only: Delete Button */}
                  {(currentUser.isAdmin ||
                    (post.userId && post.userId === currentUser.userId) ||
                    (post.adminId &&
                      post.adminId === currentUser.userId)) && (
                    <button
                      onClick={() => handleDeletePost(post.postId)}
                      className="hidden sm:block text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all shrink-0"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  {/* Mobile Only: 3-Dot Dropdown Menu */}
                  <div className="relative sm:hidden shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuPostId(activeMenuPostId === post.postId ? null : post.postId);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-all"
                      title="Options"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuPostId === post.postId && (
                      <>
                        {/* Click-away overlay */}
                        <div
                          className="fixed inset-0 z-40 bg-transparent"
                          onClick={() => setActiveMenuPostId(null)}
                        />
                        
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-100">
                          {/* Option 1: Save / Bookmark */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(post.postId);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Bookmark
                              size={16}
                              className={
                                post.isSavedByMe
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-slate-400"
                              }
                            />
                            <span>{post.isSavedByMe ? "Bookmarked" : "Save Post"}</span>
                          </button>

                          {/* Option 2: Delete (Conditional) */}
                          {(currentUser.isAdmin ||
                            (post.userId && post.userId === currentUser.userId) ||
                            (post.adminId &&
                              post.adminId === currentUser.userId)) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(post.postId);
                                setActiveMenuPostId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-55 transition-colors border-t border-slate-100"
                            >
                              <Trash2 size={16} className="text-red-500" />
                              <span>Delete Post</span>
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Post content */}
                <div className="mt-4">
                  <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line select-text">
                    {post.content}
                  </p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="mt-4 rounded-md overflow-hidden border border-slate-100 flex items-center justify-center bg-slate-50 max-h-[450px]">
                    <img
                      src={post.image}
                      alt="Community Attachment"
                      className="max-h-[450px] w-auto object-contain hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                )}

                {/* YouTube Video Player Embed — CodePen overlay-hide technique:
                    iframe is 300% wide, offset -100% left so the corner UI overlays
                    (title, avatar, share) are pushed off-screen while the video stays centred.
                    overflow:hidden on the container clips those off-screen areas. */}
                {post.link && getYouTubeId(post.link) && (
                  <div
                    className="mt-4 rounded-xl border border-slate-100 bg-black overflow-hidden"
                    style={{ aspectRatio: "16/9", width: "100%" }}
                  >
                    <iframe
                      title={`Video by ${post.authorName}`}
                      src={`https://www.youtube.com/embed/${getYouTubeId(post.link)}?controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&color=white&iv_load_policy=3&disablekb=1&fs=0`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{
                        width: "300%",
                        height: "100%",
                        marginLeft: "-100%",
                        border: 0,
                        display: "block",
                      }}
                    />
                  </div>
                )}

                {/* Attached Link (only for non-YouTube links) */}
                {post.link && !getYouTubeId(post.link) && (
                  <div className="mt-3">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-orange-100 bg-orange-50/40 text-primary-orange-hover hover:bg-orange-50 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all no-underline shadow-sm"
                    >
                      <Link2 size={14} className="text-primary-orange-hover" />
                      <span>Visit Attached Link</span>
                    </a>
                  </div>
                )}

                <hr className="border-slate-100 my-4" />

                {/* Social Interactions & Metrics Row */}
                <div className="flex items-center justify-between text-slate-500 text-xs font-black uppercase tracking-wider">
                  <div className="flex gap-4">
                    {/* Like Toggle */}
                    <button
                      onClick={() => handleLike(post.postId)}
                      className={`flex items-center gap-1.5 hover:text-red-500 transition-all ${
                        post.isLikedByMe
                          ? "text-red-500 font-black"
                          : "text-slate-500"
                      }`}
                    >
                      <Heart
                        size={18}
                        className={
                          post.isLikedByMe
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-slate-400"
                        }
                      />
                      <span>{post.likeCount}</span>
                      <span className="hidden sm:inline"> Likes</span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      onClick={() =>
                        setOpenComments((prev) => ({
                          ...prev,
                          [post.postId]: !prev[post.postId],
                        }))
                      }
                      className="flex items-center gap-1.5 hover:text-primary-orange-hover transition-all text-slate-500"
                    >
                      <MessageCircle size={18} className="text-slate-400" />
                      <span>{post.commentCount}</span>
                      <span className="hidden sm:inline"> Comments</span>
                    </button>
                  </div>

                  <div className="flex gap-3">
                    {/* Share */}
                    <button
                      onClick={() => handleNativeShare(post)}
                      className="flex items-center gap-1.5 hover:text-emerald-600 transition-all text-slate-500"
                      title="Share post"
                    >
                      <Share2 size={18} className="text-slate-400" />
                      <span className="hidden sm:inline"> Share</span>
                    </button>

                    {/* Save Bookmark (Desktop Only) */}
                    <button
                      onClick={() => handleSave(post.postId)}
                      className={`hidden sm:flex items-center gap-1.5 hover:text-amber-500 transition-all ${
                        post.isSavedByMe
                          ? "text-amber-500 font-black"
                          : "text-slate-500"
                      }`}
                      title="Save to bookmarks"
                    >
                      <Bookmark
                        size={18}
                        className={
                          post.isSavedByMe
                            ? "fill-amber-500 text-amber-500 scale-110"
                            : "text-slate-400"
                        }
                      />
                      <span className="hidden sm:inline"> Save</span>
                    </button>
                  </div>
                </div>

                {/* Comments Drawer / Box */}
                <AnimatePresence>
                  {openComments[post.postId] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 border-t border-slate-50 pt-4 space-y-4 overflow-hidden"
                    >
                      {/* Scrollable list of comments */}
                      {post.comments.length > 0 && (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.commentId}
                              className="flex gap-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100"
                            >
                              <div className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-white bg-primary-orange-hover rounded-lg shadow-sm overflow-hidden shrink-0">
                                {comment.authorImage ? (
                                  <img
                                    src={comment.authorImage}
                                    alt={comment.authorName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  comment.authorName[0].toUpperCase()
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-xs text-[var(--deep-black)] uppercase tracking-tight">
                                    {comment.authorName}
                                  </span>
                                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                    {comment.authorRole}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-1 select-text font-medium">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment form */}
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-white bg-primary-orange-hover rounded-lg shadow-sm overflow-hidden shrink-0 select-none">
                          {currentUser.profileImage ? (
                            <img
                              src={currentUser.profileImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            currentUser.fullName[0].toUpperCase()
                          )}
                        </div>
                        <input
                          type="text"
                          value={commentTexts[post.postId] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({
                              ...prev,
                              [post.postId]: e.target.value,
                            }))
                          }
                          placeholder="Add a comment..."
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary-orange-hover/20 outline-none transition-all"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCommentSubmit(post.postId);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.postId)}
                          disabled={!(commentTexts[post.postId] || "").trim()}
                          className="p-2.5 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white rounded-xl disabled:opacity-40 shadow-sm active:scale-95 transition-all"
                          title="Send comment"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Sidebar Guidelines Section */}
      <div className="w-full lg:w-[320px] shrink-0 space-y-6">
        {/* Guidelines */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-primary-orange-hover rounded-xl border border-orange-100">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Feed Guidelines
              </h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Community Rules
              </p>
            </div>
          </div>
          <hr className="border-slate-100" />
          <ul className="space-y-3.5 text-xs text-slate-600 font-medium pl-4 list-disc">
            <li>
              Share referral success stories, promotional insights, and updates.
            </li>
            <li>Post high-quality images and keep content within 1MB.</li>
            <li>
              Respect other ambassadors. Admin announcements take highest
              priority.
            </li>
            <li>
              Likes and comments on your posts will trigger live updates in your
              notification bell.
            </li>
          </ul>
        </div>

        {/* Quick Profile Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center text-sm font-black text-white bg-primary-orange-hover rounded-xl ring-2 ring-orange-100 shadow-md overflow-hidden select-none">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.fullName[0].toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-none">
                {currentUser.fullName}
              </h3>
              <span className="inline-block bg-orange-50 text-primary-orange-hover text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-2">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
}
