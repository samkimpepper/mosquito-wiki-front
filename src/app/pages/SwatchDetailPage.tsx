import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router";
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
              onClick={() => { setLiked(!liked); setLikeCount(c => liked ? c - 1 : c + 1); }}
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

// 목 데이터 (서버 API 연결 예정)
const mockFeed: FeedItem[] = [
  {
    type: "swatch",
    id: 1,
    user: { name: "cosmetictic", handle: "@cosmetictic", avatar: defaultProfile },
    time: "1h",
    description: "디올 썸머 꿀뤼르 뜬 거 보고 디올 쓰고 싶어서 3꿀 코랄캔버스랑 블러서 데이지 꺼냈으요ㅋ 둘 다 넘 예쁘고 잘 어울리고~~~s2",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=400",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    ],
    likeCount: 5,
    commentCount: 0,
    retweetCount: 1,
    viewCount: 144,
    isLiked: false,
    isBookmarked: false,
  },
  {
    type: "tweet",
    id: 2,
    tweetId: "2034784404560912792",
    user: { name: "지은", handle: "@jieun_beauty", avatar: defaultProfile },
    time: "3h",
  },
  {
    type: "swatch",
    id: 3,
    user: { name: "kimloveS2", handle: "@kimloveS2", avatar: defaultProfile },
    time: "53m",
    description: "롬앤 주시래스팅티트 20호 발색 너무 예뻐서 참을 수가 없어요 🌸",
    images: [
      "https://images.unsplash.com/photo-1638225304129-eae5c3604d9c?w=600",
    ],
    likeCount: 12,
    commentCount: 3,
    retweetCount: 0,
    viewCount: 89,
    isLiked: false,
    isBookmarked: false,
  },
  {
    type: "swatch",
    id: 4,
    user: { name: "makeuplog", handle: "@makeuplog", avatar: defaultProfile },
    time: "2h",
    description: "맥 루비우 드디어 득템!! 색감이 진짜 미쳤다",
    images: [
      "https://images.unsplash.com/photo-1563441811597-99b0960e4239?w=400",
      "https://images.unsplash.com/photo-1602260395251-0fe691861b56?w=400",
      "https://images.unsplash.com/photo-1585387047269-e66bf53002f5?w=400",
      "https://images.unsplash.com/photo-1714420076326-476283c9fcfa?w=400",
    ],
    likeCount: 34,
    commentCount: 7,
    retweetCount: 2,
    viewCount: 312,
    isLiked: true,
    isBookmarked: true,
  },
];

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

    // TODO: 서버 API 연결
    // const res = await fetch(`http://localhost:8080/api/swatch?page=${page}&size=10`, { credentials: "include" });
    // const data = await res.json();
    // setPosts(prev => [...prev, ...data.content]);
    // setHasMore(!data.last);
    // setPage(p => p + 1);

    // 목 데이터 (임시)
    setTimeout(() => {
      setPosts(prev => [
        ...prev,
        ...mockFeed.map(p => ({ ...p, id: prev.length + p.id })),
      ]);
      setPage(p => p + 1);
      if (page >= 2) setHasMore(false);
      setLoading(false);
    }, 400);
  }, [loading, hasMore, page]);

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
