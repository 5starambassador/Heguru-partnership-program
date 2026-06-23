"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/notification-actions";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { uploadToImageKit } from "@/lib/imagekit-server";

// Primary upload using ImageKit with a fallback to Firebase or direct base64 string
async function uploadImageWorkflow(
  base64Data: string,
  fileName: string,
): Promise<string> {
  try {
    const imageKitUrl = await uploadToImageKit(base64Data, fileName);
    if (imageKitUrl) {
      return imageKitUrl;
    }
  } catch (err) {
    console.error("[ImageKit Workflow Error] Falling back to Firebase:", err);
  }
  return uploadToFirebaseStorage(base64Data, `community_posts/${fileName}`);
}

// Helper to upload base64 image to Firebase Storage with raw base64 fallback
async function uploadToFirebaseStorage(
  base64Data: string,
  path: string,
): Promise<string> {
  try {
    const admin = await getFirebaseAdmin();
    if (!admin) {
      console.warn(
        "[Firebase] Admin SDK not configured. Storing raw base64 data URL in DB.",
      );
      return base64Data;
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.warn(
        "[Firebase] Invalid base64 structure. Storing raw input in DB.",
      );
      return base64Data;
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET ||
      `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
    const bucket = admin.storage().bucket(bucketName);
    const file = bucket.file(path);

    await file.save(buffer, {
      metadata: { contentType: mimeType },
      public: true,
    });

    return `https://storage.googleapis.com/${bucketName}/${path}`;
  } catch (err) {
    console.error("[Firebase Upload Error] Falling back to base64:", err);
    return base64Data;
  }
}

export async function getCommunityPosts() {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  const viewerId = Number(session.userId);
  const viewerType = session.userType === "admin" ? "admin" : "user";

  try {
    // Fetch viewer's campus mapping
    let viewerCampusId: number | null = null;
    let viewerCampusName: string | null = null;

    if (viewerType === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { adminId: viewerId },
        select: { assignedCampus: true },
      });
      viewerCampusName = admin?.assignedCampus || null;
    } else {
      const user = await prisma.user.findUnique({
        where: { userId: viewerId },
        select: { campusId: true, assignedCampus: true, childCampusId: true },
      });
      viewerCampusId = user?.campusId || user?.childCampusId || null;
      viewerCampusName = user?.assignedCampus || null;
    }

    const posts = await prisma.communityPost.findMany({
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            role: true,
            profileImage: true,
            assignedCampus: true,
            campusId: true,
            childCampusId: true,
          },
        },
        admin: {
          select: {
            adminId: true,
            adminName: true,
            role: true,
            profileImage: true,
            assignedCampus: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                fullName: true,
                role: true,
                profileImage: true,
                assignedCampus: true,
              },
            },
            admin: {
              select: {
                adminName: true,
                role: true,
                profileImage: true,
                assignedCampus: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        savedPosts: true,
      },
    });

    // Map and rank posts in memory for premium priority feed sorting
    const mappedPosts = posts.map((post) => {
      const isLikedByMe = post.likes.some(
        (l) =>
          (viewerType === "user" && l.userId === viewerId) ||
          (viewerType === "admin" && l.adminId === viewerId),
      );
      const isSavedByMe = post.savedPosts.some(
        (s) =>
          (viewerType === "user" && s.userId === viewerId) ||
          (viewerType === "admin" && s.adminId === viewerId),
      );

      const authorName =
        post.admin?.adminName || post.user?.fullName || "Partner";
      const authorImage =
        post.admin?.profileImage || post.user?.profileImage || "";
      const authorRole = post.admin
        ? post.admin.role.replace(/_/g, " ")
        : post.user?.role || "Ambassador";
      const authorCampus = post.adminId
        ? "Heguru"
        : post.user?.assignedCampus || "Heguru";

      // Priority weight calculation:
      // Admin post -> Weight 3 (Top priority)
      // Same campus ambassador post -> Weight 2 (Same campus match)
      // Other posts -> Weight 1
      let priorityWeight = 1;

      if (post.adminId) {
        priorityWeight = 3;
      } else if (post.user) {
        const authorCampusId =
          post.user.campusId || post.user.childCampusId || null;
        const authorCampusName = post.user.assignedCampus || null;

        const isSameCampus =
          (viewerCampusId &&
            authorCampusId &&
            viewerCampusId === authorCampusId) ||
          (viewerCampusName &&
            authorCampusName &&
            viewerCampusName.toLowerCase() === authorCampusName.toLowerCase());

        if (isSameCampus) {
          priorityWeight = 2;
        }
      }

      return {
        postId: post.postId,
        content: post.content,
        image: post.image,
        link: post.link,
        createdAt: post.createdAt,
        userId: post.userId,
        adminId: post.adminId,
        authorName,
        authorImage,
        authorRole,
        authorCampus,
        isLikedByMe,
        isSavedByMe,
        likeCount: post.likes.length,
        commentCount: post.comments.length,
        comments: post.comments.map((c) => ({
          commentId: c.commentId,
          content: c.content,
          createdAt: c.createdAt,
          authorName: c.admin?.adminName || c.user?.fullName || "Partner",
          authorImage: c.admin?.profileImage || c.user?.profileImage || "",
          authorRole: c.admin
            ? c.admin.role.replace(/_/g, " ")
            : c.user?.role || "Ambassador",
          authorCampus: c.adminId
            ? "Heguru"
            : c.user?.assignedCampus || "Heguru",
        })),
        priorityWeight,
      };
    });

    // Sort: Group by posting day, admin posts float to top of their day, then same-campus ambassador posts
    mappedPosts.sort((a, b) => {
      const dayA = new Date(a.createdAt).toDateString()
      const dayB = new Date(b.createdAt).toDateString()

      // Different days → most recent day first
      if (dayA !== dayB) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      // Same day → admin posts at top, then same-campus, then others
      if (b.priorityWeight !== a.priorityWeight) {
        return b.priorityWeight - a.priorityWeight
      }

      // Tie-break by time
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return { success: true, posts: mappedPosts };
  } catch (error) {
    console.error("getCommunityPosts error:", error);
    return { success: false, error: "Failed to retrieve feed" };
  }
}

export async function createCommunityPost(
  content: string,
  image?: string,
  link?: string,
) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  const authorId = Number(session.userId);
  // Use userType (not role string) to determine if this is an admin account
  const isAdmin = session.userType === "admin";

  try {
    let finalImageUrl: string | null = null;

    if (image) {
      const fileName = `community_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}.webp`;
      finalImageUrl = await uploadImageWorkflow(image, fileName);
    }

    const data: any = {
      content,
      image: finalImageUrl,
      link: link || null,
    };

    if (isAdmin) {
      data.adminId = authorId;
    } else {
      data.userId = authorId;
    }

    const post = await prisma.communityPost.create({ data });

    revalidatePath("/community");
    return { success: true, post };
  } catch (error) {
    console.error("createCommunityPost error:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function toggleLikePost(postId: number) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  const viewerId = Number(session.userId);
  const isViewerAdmin = session.role === "admin";

  try {
    const post = await prisma.communityPost.findUnique({
      where: { postId },
      select: { userId: true, adminId: true, content: true },
    });

    if (!post) return { success: false, error: "Post not found" };

    const whereClause: any = { postId };
    if (isViewerAdmin) {
      whereClause.adminId = viewerId;
    } else {
      whereClause.userId = viewerId;
    }

    const existingLike = await prisma.postLike.findFirst({
      where: whereClause,
    });

    let liked = false;

    if (existingLike) {
      await prisma.postLike.delete({
        where: { likeId: existingLike.likeId },
      });
    } else {
      const data: any = { postId };
      if (isViewerAdmin) {
        data.adminId = viewerId;
      } else {
        data.userId = viewerId;
      }
      await prisma.postLike.create({ data });
      liked = true;

      // Trigger Notification to Post Author (if not current viewer liking their own post)
      const authorUserId = post.userId;
      const authorAdminId = post.adminId;

      let viewerName = "Someone";
      if (isViewerAdmin) {
        const adminRec = await prisma.admin.findUnique({
          where: { adminId: viewerId },
          select: { adminName: true },
        });
        viewerName = adminRec?.adminName || "Admin";
      } else {
        const userRec = await prisma.user.findUnique({
          where: { userId: viewerId },
          select: { fullName: true },
        });
        viewerName = userRec?.fullName || "Ambassador";
      }
      const snippet =
        post.content.substring(0, 30) + (post.content.length > 30 ? "..." : "");

      if (authorUserId && authorUserId !== viewerId) {
        await createNotification({
          userId: authorUserId,
          title: "❤️ New Like on your post",
          message: `${
            viewerName || "An ambassador"
          } liked your post: "${snippet}"`,
          type: "info",
          link: "/community",
        }).catch((err) => console.error("Like notification failed:", err));
      } else if (authorAdminId && authorAdminId !== viewerId) {
        await createNotification({
          adminId: authorAdminId,
          title: "❤️ New Like on your post",
          message: `${
            viewerName || "An administrator"
          } liked your post: "${snippet}"`,
          type: "info",
          link: "/community",
        }).catch((err) => console.error("Like notification failed:", err));
      }
    }

    revalidatePath("/community");
    return { success: true, liked };
  } catch (error) {
    console.error("toggleLikePost error:", error);
    return { success: false, error: "Like operation failed" };
  }
}

export async function addComment(postId: number, content: string) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  const viewerId = Number(session.userId);
  const isViewerAdmin = session.role === "admin";

  if (!content || content.trim().length === 0) {
    return { success: false, error: "Comment text cannot be empty" };
  }

  try {
    const post = await prisma.communityPost.findUnique({
      where: { postId },
      select: { userId: true, adminId: true, content: true },
    });

    if (!post) return { success: false, error: "Post not found" };

    const data: any = {
      postId,
      content,
    };

    if (isViewerAdmin) {
      data.adminId = viewerId;
    } else {
      data.userId = viewerId;
    }

    const comment = await prisma.postComment.create({ data });

    // Trigger Notification to Post Author
    const authorUserId = post.userId;
    const authorAdminId = post.adminId;

    let viewerName = "Someone";
    if (isViewerAdmin) {
      const adminRec = await prisma.admin.findUnique({
        where: { adminId: viewerId },
        select: { adminName: true },
      });
      viewerName = adminRec?.adminName || "Admin";
    } else {
      const userRec = await prisma.user.findUnique({
        where: { userId: viewerId },
        select: { fullName: true },
      });
      viewerName = userRec?.fullName || "Ambassador";
    }
    const snippet =
      post.content.substring(0, 30) + (post.content.length > 30 ? "..." : "");

    if (authorUserId && authorUserId !== viewerId) {
      await createNotification({
        userId: authorUserId,
        title: "💬 New Comment on your post",
        message: `${
          viewerName || "An ambassador"
        } commented on your post: "${content.substring(0, 30)}..."`,
        type: "info",
        link: "/community",
      }).catch((err) => console.error("Comment notification failed:", err));
    } else if (authorAdminId && authorAdminId !== viewerId) {
      await createNotification({
        adminId: authorAdminId,
        title: "💬 New Comment on your post",
        message: `${
          viewerName || "An administrator"
        } commented on your post: "${content.substring(0, 30)}..."`,
        type: "info",
        link: "/community",
      }).catch((err) => console.error("Comment notification failed:", err));
    }

    revalidatePath("/community");
    return { success: true, comment };
  } catch (error) {
    console.error("addComment error:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function toggleSavePost(postId: number) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  const viewerId = Number(session.userId);
  const isViewerAdmin = session.role === "admin";

  try {
    const whereClause: any = { postId };
    if (isViewerAdmin) {
      whereClause.adminId = viewerId;
    } else {
      whereClause.userId = viewerId;
    }

    const existingSaved = await prisma.savedPost.findFirst({
      where: whereClause,
    });

    let saved = false;

    if (existingSaved) {
      await prisma.savedPost.delete({
        where: { savedId: existingSaved.savedId },
      });
    } else {
      const data: any = { postId };
      if (isViewerAdmin) {
        data.adminId = viewerId;
      } else {
        data.userId = viewerId;
      }
      await prisma.savedPost.create({ data });
      saved = true;
    }

    revalidatePath("/community");
    return { success: true, saved };
  } catch (error) {
    console.error("toggleSavePost error:", error);
    return { success: false, error: "Bookmark operation failed" };
  }
}

export async function deleteCommunityPost(postId: number) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  const viewerId = Number(session.userId);
  const viewerRole = session.role || "";
  const isViewerAdmin = viewerRole === "admin" || viewerRole === "superadmin";

  try {
    const post = await prisma.communityPost.findUnique({
      where: { postId },
      select: { userId: true, adminId: true },
    });

    if (!post) return { success: false, error: "Post not found" };

    // Authorization check:
    // Viewer is post author OR viewer is Admin/Super Admin
    const isAuthor =
      (!isViewerAdmin && post.userId === viewerId) ||
      (isViewerAdmin && post.adminId === viewerId);

    // Check if role has admin clearance
    const hasModerationClearance =
      viewerRole === "Super Admin" ||
      viewerRole === "Admission Admin" ||
      viewerRole.includes("Admin");

    if (!isAuthor && !hasModerationClearance) {
      return {
        success: false,
        error: "You are not authorized to delete this post",
      };
    }

    await prisma.communityPost.delete({
      where: { postId },
    });

    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("deleteCommunityPost error:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
