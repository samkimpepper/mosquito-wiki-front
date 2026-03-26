import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { API_BASE } from "../../config";
import { Heart, MessageCircle, Repeat2, Bookmark, Share, MoreHorizontal } from "lucide-react";
import { Tweet } from "react-tweet";
import defaultProfile from "../../assets/default_profile.jpg";

interface SwatchPost {
  type: "swatch";
  id: number;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  time: string;
  description: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  retweetCount: number;
  viewCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface TweetPost {
  type: "tweet";
  id: number;
  tweetId: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  time: string;
}

type FeedItem = SwatchPost | TweetPost;

interface ServerSwatchItem {
  id: number;
  user: {
    name: string;
    handle: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  liked: boolean;
  isBookmarked: boolean;
  sourceType: "UPLOAD" | "TWITTER";
  tweetUrl: string | null;
}

function formatRelativeTime(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function extractTweetId(tweetUrl: string): string {
  return tweetUrl.match(/status(?:es)?\/(\d+)/)?.[1] ?? "";
}

function mapToFeedItem(item: ServerSwatchItem): FeedItem {
  const user = {
    name: item.user.name,
    handle: item.user.handle,
    avatar: item.user.profileImageUrl
      ? item.user.profileImageUrl.startsWith("http")
        ? item.user.profileImageUrl
        : `${API_BASE}${item.user.profileImageUrl}`
      : defaultProfile,
  };
  const time = formatRelativeTime(item.createdAt);

  if (item.sourceType === "TWITTER" && item.tweetUrl) {
    return { type: "tweet", id: item.id, tweetId: extractTweetId(item.tweetUrl), user, time };
  }

  return {
    type: "swatch",
    id: item.id,
    user,
    time,
    description: item.content,
    images: item.images.map(img => img.startsWith("http") ? img : `${API_BASE}${img}`),
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    retweetCount: 0,
    viewCount: 0,
    isLiked: item.liked,
    isBookmarked: item.isBookmarked,
  };
}

function ImageGrid({ images }: { images: string[] }) {
  if (images.length === 1) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 mt-3">
        <img src={images[0]} alt="" className="w-full object-cover max-h-96" />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden border border-gray-200 mt-3">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" className="w-full h-56 object-cover" />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden border border-gray-200 mt-3">
        <img src={images[0]} alt="" className="row-span-2 w-full h-full object-cover" style={{ maxHeight: '280px' }} />
        <img src={images[1]} alt="" className="w-full h-[139px] object-cover" />
        <img src={images[2]} alt="" className="w-full h-[139px] object-cover" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden border border-gray-200 mt-3">
      {images.map((img, i) => (
        <img key={i} src={img} alt="" className="w-full h-36 object-cover" />
      ))}
    </div>
  );
}

function SwatchPostCard({ post }: { post: SwatchPost }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount(c => next ? c + 1 : c - 1);
    try {
      const res = await fetch(`${API_BASE}/api/swatch/like/${post.id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (e) {
      console.error("swatch like error", e);
      setLiked(!next);
      setLikeCount(c => next ? c - 1 : c + 1);
    }
  };

  return (
    <div className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
        </div>

        {/* 본문 */}
        <div className="flex-1 min-w-0">
          {/* 상단: 유저 정보 + 시간 + 메뉴 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-gray-900 truncate">{post.user.name}</span>
              <span className="text-xs text-gray-400 truncate">{post.user.handle}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{post.time}</span>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2">
              <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* 설명 텍스트 */}
          <p className="text-xs text-gray-800 mt-1 leading-relaxed whitespace-pre-wrap">{post.description}</p>

          {/* 이미지 그리드 */}
          {post.images.length > 0 && <ImageGrid images={post.images} />}

          {/* 액션 바 */}
          <div className="flex items-center justify-between mt-3 text-gray-400">
            <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors group">
              <div className="p-1 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              {post.commentCount > 0 && <span className="text-xs">{post.commentCount}</span>}
            </button>

            <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors group">
              <div className="p-1 rounded-full group-hover:bg-green-50 transition-colors">
                <Repeat2 className="w-3.5 h-3.5" />
              </div>
              {post.retweetCount > 0 && <span className="text-xs">{post.retweetCount}</span>}
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors group ${liked ? "text-pink-500" : "hover:text-pink-500"}`}
            >
              <div className="p-1 rounded-full group-hover:bg-pink-50 transition-colors">
                <Heart className={`w-3.5 h-3.5 ${liked ? "fill-pink-500" : ""}`} />
              </div>
              {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-1.5 transition-colors group ${bookmarked ? "text-blue-500" : "hover:text-blue-500"}`}
            >
              <div className="p-1 rounded-full group-hover:bg-blue-50 transition-colors">
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-blue-500" : ""}`} />
              </div>
            </button>

            <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors group">
              <div className="p-1 rounded-full group-hover:bg-blue-50 transition-colors">
                <Share className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SwatchDetailPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: "10" });
      if (id) params.set("productSlug", id);
      const res = await fetch(`${API_BASE}/api/swatch?${params}`, { credentials: "include" });
      const data = await res.json();
      setPosts(prev => [...prev, ...data.content.map(mapToFeedItem)]);
      setHasMore(!data.last);
      setPage(p => p + 1);
    } catch (e) {
      console.error("swatch load error", e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, id]);

  // 초기 로드
  useEffect(() => {
    loadMore();
  }, []);

  // 무한 스크롤
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  return (
    <div className="max-w-xl mx-auto border-x border-gray-100 min-h-screen">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-2.5 z-10">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">// 발색샷</p>
      </div>

      {/* 포스트 목록 */}
      {posts.map((item) =>
        item.type === "tweet" ? (
          <div key={item.id} className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors [&_.react-tweet-theme]:shadow-none [&_.react-tweet-theme]:border-0 [&_.react-tweet-theme]:rounded-none [&_.react-tweet-theme]:bg-transparent [&_.react-tweet-theme]:p-0 [&_.react-tweet-theme]:max-w-none">
            <div className="flex gap-3">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
              </div>
              {/* 본문 */}
              <div className="flex-1 min-w-0">
                {/* 유저 정보 + 시간 */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-semibold text-gray-900">{item.user.name}</span>
                  <span className="text-xs text-gray-400">{item.user.handle}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-gray-300 text-gray-500 text-xs rounded-md ml-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    임베드
                  </span>
                </div>
                {/* 트윗 임베드 */}
                <Tweet id={item.tweetId} />
              </div>
            </div>
          </div>
        ) : (
          <SwatchPostCard key={item.id} post={item} />
        )
      )}

      {/* 로딩 */}
      {loading && (
        <div className="py-8 text-center">
          <p className="text-xs text-gray-300">불러오는 중...</p>
        </div>
      )}

      {/* 무한 스크롤 트리거 */}
      <div ref={bottomRef} className="h-4" />

      {/* 끝 */}
      {!hasMore && !loading && (
        <div className="py-8 text-center border-t border-gray-100">
          <p className="text-xs text-gray-300">모든 발색샷을 불러왔어요</p>
        </div>
      )}
    </div>
  );
}
