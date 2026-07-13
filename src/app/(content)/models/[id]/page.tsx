"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Play, Image as ImageIcon, Crown, Shield, Camera, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCard } from "@/components/shared/video-card";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { useAuth } from "@/components/layout/auth-provider";
import { useMembership } from "@/components/layout/membership-provider";
import type { MembershipPlan } from "@/types";

const mockModels: Record<string, {
  id: string;
  name: string;
  bio: string;
  coverGradient: string;
  avatarGradient: string;
  photosCount: number;
  videosCount: number;
  requiredMembership: MembershipPlan;
}> = {
  "1": { id: "1", name: "Sara H.", bio: "Fashion model and content creator. Passionate about art, photography, and connecting with my audience. Join me on my journey through exclusive photos and behind-the-scenes content.", coverGradient: "from-rose-900 via-pink-900 to-purple-900", avatarGradient: "from-rose-500 to-pink-500", photosCount: 25, videosCount: 12, requiredMembership: "silver" },
  "2": { id: "2", name: "Meron T.", bio: "Lifestyle influencer sharing daily moments, fashion tips, and exclusive content. Silver members get full access to my gallery.", coverGradient: "from-blue-900 via-cyan-900 to-teal-900", avatarGradient: "from-blue-500 to-cyan-500", photosCount: 18, videosCount: 8, requiredMembership: "silver" },
  "3": { id: "3", name: "Bethlehem A.", bio: "VIP content creator. Gold members unlock my complete collection including exclusive videos and premium photoshoots.", coverGradient: "from-amber-900 via-orange-900 to-yellow-900", avatarGradient: "from-amber-500 to-orange-500", photosCount: 32, videosCount: 15, requiredMembership: "gold" },
  "4": { id: "4", name: "Tsion W.", bio: "Free content creator. Enjoy my public gallery and videos. Subscribe to my premium channels for more!", coverGradient: "from-green-900 via-emerald-900 to-teal-900", avatarGradient: "from-green-500 to-emerald-500", photosCount: 20, videosCount: 10, requiredMembership: "free" },
  "5": { id: "5", name: "Hanna K.", bio: "Dancer and performer. Silver members get exclusive access to my rehearsal videos and behind-the-scenes content.", coverGradient: "from-purple-900 via-fuchsia-900 to-pink-900", avatarGradient: "from-purple-500 to-fuchsia-500", photosCount: 15, videosCount: 6, requiredMembership: "silver" },
  "6": { id: "6", name: "Selam M.", bio: "Exclusive VIP model. Gold membership unlocks my complete library of premium content, photosets, and private videos.", coverGradient: "from-indigo-900 via-violet-900 to-purple-900", avatarGradient: "from-indigo-500 to-violet-500", photosCount: 28, videosCount: 14, requiredMembership: "gold" },
};

const mockGallery = [
  { id: "g1", gradient: "from-pink-500/30 via-rose-500/30 to-red-500/30", isVip: false },
  { id: "g2", gradient: "from-purple-500/30 via-violet-500/30 to-indigo-500/30", isVip: false },
  { id: "g3", gradient: "from-amber-500/30 via-yellow-500/30 to-orange-500/30", isVip: true },
  { id: "g4", gradient: "from-teal-500/30 via-cyan-500/30 to-sky-500/30", isVip: false },
  { id: "g5", gradient: "from-rose-500/30 via-pink-500/30 to-fuchsia-500/30", isVip: true },
  { id: "g6", gradient: "from-blue-500/30 via-indigo-500/30 to-violet-500/30", isVip: false },
  { id: "g7", gradient: "from-green-500/30 via-emerald-500/30 to-teal-500/30", isVip: false },
  { id: "g8", gradient: "from-violet-500/30 via-purple-500/30 to-fuchsia-500/30", isVip: true },
];

const mockModelVideos = [
  { id: "mv1", title: "Welcome Video", gradient: "from-rose-900/50 via-pink-900/50 to-purple-900/50", isVip: false, duration: "3:45", category: "Intro" },
  { id: "mv2", title: "Behind the Scenes", gradient: "from-blue-900/50 via-cyan-900/50 to-teal-900/50", isVip: false, duration: "8:20", category: "BTS" },
  { id: "mv3", title: "VIP Exclusive Shoot", gradient: "from-amber-900/50 via-orange-900/50 to-yellow-900/50", isVip: true, duration: "15:00", category: "VIP" },
  { id: "mv4", title: "Personal Vlog", gradient: "from-purple-900/50 via-fuchsia-900/50 to-pink-900/50", isVip: false, duration: "12:30", category: "Vlog" },
];

export default function ModelProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const { canAccess } = useMembership();
  const model = mockModels[params.id as string];
  const [activeTab, setActiveTab] = useState("photos");

  if (!model) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Model not found</h2>
          <Link href="/models" className="mt-2 inline-flex items-center gap-1 text-sm text-gold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to models
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = model.requiredMembership !== "free" && !canAccess(model.requiredMembership);
  const initials = model.name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="flex flex-col">
      {/* Cover image */}
      <div className={`relative h-48 sm:h-64 bg-gradient-to-br ${model.coverGradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <Link
          href="/models"
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/50 backdrop-blur-sm transition-colors hover:bg-background/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Membership badge on cover */}
        {model.requiredMembership !== "free" && (
          <div className="absolute right-4 top-4 z-10">
            <Badge className="bg-gold/90 text-black border-0 backdrop-blur-sm shadow-lg">
              <Crown className="mr-1 h-3 w-3" />
              {model.requiredMembership === "silver" ? "Silver+" : "Gold"}
            </Badge>
          </div>
        )}
      </div>

      {/* Profile section */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="relative -mt-16 mb-6 flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
          <Avatar className="h-28 w-28 ring-4 ring-background sm:h-32 sm:w-32">
            <AvatarFallback className={`bg-gradient-to-br ${model.avatarGradient} text-2xl font-bold text-white`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center sm:mt-0 sm:pb-2 sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">{model.name}</h1>
              <FavoriteButton itemType="model" itemId={model.id} />
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Camera className="h-4 w-4" />
                {model.photosCount} photos
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                {model.videosCount} videos
              </span>
              {model.requiredMembership !== "free" && (
                <Badge className="bg-gold/10 text-gold border border-gold/20 text-xs">
                  <Lock className="mr-1 h-3 w-3" />
                  {model.requiredMembership === "silver" ? "Silver Required" : "Gold Required"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <motion.p
          className="mb-8 max-w-2xl text-sm text-muted-foreground/80 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {model.bio}
        </motion.p>

        {/* Locked overlay for non-members */}
        {isLocked ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gold/20 bg-gold/[0.02] py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 mb-4">
              <Lock className="h-8 w-8 text-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {model.requiredMembership === "gold" ? "Gold Membership Required" : "Silver Membership Required"}
            </h3>
            <p className="text-sm text-muted-foreground/70 mb-6 max-w-md text-center">
              Upgrade your membership to access {model.name}&apos;s exclusive photos, videos, and content.
            </p>
            <Link href={user ? "/membership" : "/register"}>
              <Button className="bg-gold text-black hover:bg-gold-dark">
                <Crown className="mr-2 h-4 w-4" />
                {user ? "Upgrade Now" : "Join HabeshaWii"}
              </Button>
            </Link>
          </div>
        ) : (
          /* Content tabs */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="mb-6 bg-card/50 border border-border/50">
              <TabsTrigger value="photos" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <ImageIcon className="mr-2 h-4 w-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Play className="mr-2 h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photos">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {mockGallery.map((img) => {
                  const imgIsLocked = img.isVip && !canAccess("gold");
                  return (
                    <div key={img.id} className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border border-border/30 group">
                      <div className={`absolute inset-0 bg-gradient-to-br ${img.gradient} transition-transform duration-500 group-hover:scale-105`} />
                      {img.isVip && (
                        <div className="absolute right-2 top-2">
                          <Badge className="bg-vip/90 text-[10px] text-white border-0">VIP</Badge>
                        </div>
                      )}
                      {imgIsLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Lock className="h-6 w-6 text-white/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {mockModelVideos.map((v) => {
                  const vidIsLocked = v.isVip && !canAccess("gold");
                  return (
                    <div key={v.id} className="relative">
                      <VideoCard
                        title={v.title}
                        duration={v.duration}
                        category={v.category}
                        gradient={v.gradient}
                        isVIP={v.isVip}
                        views={Math.floor(Math.random() * 10000)}
                      />
                      {vidIsLocked && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-[2px]">
                          <Lock className="h-5 w-5 text-gold" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
