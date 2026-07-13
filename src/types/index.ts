export type MembershipPlan = "free" | "bronze" | "silver" | "gold";

export type PaymentStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  membership: MembershipPlan;
  membership_expires_at: string | null;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: string | null;
  category_id: string | null;
  is_premium: boolean;
  is_vip: boolean;
  views: number;
  created_at: string;
}

export interface Short {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_vip: boolean;
  views: number;
  created_at: string;
}

export interface Model {
  id: string;
  name: string;
  bio: string | null;
  profile_photo_url: string | null;
  cover_image_url: string | null;
  photo_count: number;
  video_count: number;
  required_membership: MembershipPlan;
  created_at: string;
}

export interface ModelGallery {
  id: string;
  model_id: string;
  image_url: string;
  is_vip: boolean;
  created_at: string;
}

export interface ModelVideo {
  id: string;
  model_id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  is_vip: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  item_type: "video" | "short" | "model";
  item_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface PaymentSubmission {
  id: string;
  user_id: string;
  plan: MembershipPlan;
  amount: number;
  payment_method: "telebirr" | "cbe";
  receipt_data: string;
  status: PaymentStatus;
  reviewed_by: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface PlanDefinition {
  id: string;
  name: MembershipPlan;
  price: number;
  duration_days: number;
  features: string[];
}
