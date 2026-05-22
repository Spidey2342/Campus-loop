import React from 'react'

// Base shimmer animation block
function Shimmer({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
  )
}

// ── Feed reel skeleton — full screen card ─────────────────────────────────
export function ReelSkeleton() {
  return (
    <div className="h-screen w-full bg-zinc-950 relative flex flex-col justify-end p-4 gap-3">
      {/* Video background shimmer */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-900 to-zinc-950" />

      {/* Right action bar */}
      <div className="absolute right-3 bottom-32 flex flex-col gap-5 items-center">
        <Shimmer className="w-10 h-10 rounded-full" />
        <Shimmer className="w-10 h-10 rounded-full" />
        <Shimmer className="w-10 h-10 rounded-full" />
        <Shimmer className="w-10 h-10 rounded-full" />
      </div>

      {/* Bottom info */}
      <div className="relative z-10 space-y-2 mb-16">
        <div className="flex items-center gap-2">
          <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
          <Shimmer className="w-32 h-4" />
        </div>
        <Shimmer className="w-3/4 h-3" />
        <Shimmer className="w-1/2 h-3" />
      </div>
    </div>
  )
}

// ── Notification skeleton row ──────────────────────────────────────────────
export function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Shimmer className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="w-3/4 h-3" />
        <Shimmer className="w-1/3 h-2" />
      </div>
      <Shimmer className="w-10 h-10 rounded-lg flex-shrink-0" />
    </div>
  )
}

// ── Profile grid skeleton ──────────────────────────────────────────────────
export function ProfileGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <Shimmer key={i} className="aspect-square rounded-none" />
      ))}
    </div>
  )
}

// ── Profile header skeleton ────────────────────────────────────────────────
export function ProfileHeaderSkeleton() {
  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center gap-4">
        <Shimmer className="w-20 h-20 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="w-32 h-4" />
          <Shimmer className="w-24 h-3" />
          <div className="flex gap-4 mt-2">
            <Shimmer className="w-12 h-8 rounded-lg" />
            <Shimmer className="w-12 h-8 rounded-lg" />
            <Shimmer className="w-12 h-8 rounded-lg" />
          </div>
        </div>
      </div>
      <Shimmer className="w-full h-3" />
      <Shimmer className="w-2/3 h-3" />
      <Shimmer className="w-full h-10 rounded-xl" />
    </div>
  )
}

// ── Comment skeleton row ───────────────────────────────────────────────────
export function CommentSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Shimmer className="w-9 h-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="w-24 h-3" />
        <Shimmer className="w-full h-3" />
        <Shimmer className="w-1/2 h-3" />
      </div>
    </div>
  )
}

// ── Discover school card skeleton ──────────────────────────────────────────
export function SchoolCardSkeleton() {
  return (
    <div className="min-w-[110px] bg-white/10 rounded-xl p-3 text-center flex-shrink-0">
      <Shimmer className="w-12 h-12 mx-auto rounded-xl mb-2" />
      <Shimmer className="w-16 h-3 mx-auto mb-1" />
      <Shimmer className="w-12 h-2 mx-auto" />
    </div>
  )
}

// ── Trending tag skeleton ──────────────────────────────────────────────────
export function TrendingSkeleton() {
  return (
    <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Shimmer className="w-5 h-4" />
        <div className="space-y-2">
          <Shimmer className="w-24 h-4" />
          <Shimmer className="w-16 h-3" />
        </div>
      </div>
      <Shimmer className="w-14 h-7 rounded-full" />
    </div>
  )
}

// ── User row skeleton (search results, school members) ────────────────────
export function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
      <Shimmer className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="w-32 h-3" />
        <Shimmer className="w-24 h-2" />
      </div>
      <Shimmer className="w-20 h-8 rounded-full flex-shrink-0" />
    </div>
  )
}

// ── Message conversation row skeleton ─────────────────────────────────────
export function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Shimmer className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="w-28 h-3" />
        <Shimmer className="w-40 h-2" />
      </div>
      <Shimmer className="w-8 h-2" />
    </div>
  )
}

export default Shimmer