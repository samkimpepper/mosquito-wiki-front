import { FeedProductCard } from "../components/FeedProductCard";
import { SwatchFeedCard, SwatchFeedItem } from "../components/SwatchFeedCard";
import { API_BASE } from "../../config";
import { DiscountCard } from "../components/DiscountCard";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import defaultProfile from "../../assets/default_profile.jpg";

interface CategoryStat {
  category: string;
  productCount: number;
}

interface DashboardData {
  brandCount: number;
  productCount: number;
  swatchCount: number;
  categoryStats: CategoryStat[];
}

interface PopularProduct {
  slug: string;
  officialImageUrls: string[] | null;
  nameKo: string;
  optionNameKo: string | null;
  brandName: string;
  brandNameKo: string;
  brandLogoUrl: string | null;
  categorySlug: string;
  categoryName: string;
  swatchCount: number;
  likeCount: number;
  viewCount: number;
  tags: { id: number; tagValue: string; color: string | null }[];
  user: { name: string; profileImageUrl: string | null };
}

export function HomePage() {
  const navigate = useNavigate();
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; slug: string }>({ name: "전체", slug: "" });
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderScrollLeft, setSliderScrollLeft] = useState(0);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [popularPage, setPopularPage] = useState(0);
  const [popularIsLast, setPopularIsLast] = useState(false);
  const [popularFetching, setPopularFetching] = useState(false);

  const slideBy = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth / 3;
    sliderRef.current.scrollBy({ left: dir === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  const fetchPopular = (page: number, categorySlug: string) => {
    if (popularFetching) return;
    setPopularFetching(true);
    const params = new URLSearchParams({ page: String(page), size: "9" });
    if (categorySlug) params.set("category", categorySlug);
    fetch(`${API_BASE}/api/home/popular-products?${params}`, { credentials: "include" })
      .then(res => res.json())
      .then((data: { content: PopularProduct[]; last: boolean }) => {
        setPopularProducts(prev => page === 0 ? data.content : [...prev, ...data.content]);
        setPopularIsLast(data.last);
        setPopularPage(page);
      })
      .catch(() => {})
      .finally(() => setPopularFetching(false));
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/home/dashboard`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(() => {});

    fetch(`${API_BASE}/api/category`, { credentials: "include" })
      .then(res => res.json())
      .then((data: { name: string; slug: string }[]) => {
        setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPopularProducts([]);
    fetchPopular(0, selectedCategory.slug);
  }, [selectedCategory]);

  // 최근 편집된 항목들 (임시 목 데이터 - 서버 API 연결 예정)
  const recentlyEdited = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1602260395251-0fe691861b56?w=200",
      title: "헤라 블랙 쿠션",
      author: "지은",
      avatar: defaultProfile,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=200",
      title: "롬앤 주시 래스팅 티트 #20",
      author: "수아",
      avatar: defaultProfile,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1585387047269-e66bf53002f5?w=200",
      title: "맥 루비우 립스틱",
      author: "서연",
      avatar: defaultProfile,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1690214392595-297a43d5b6f1?w=200",
      title: "글로우 하이라이터 #3",
      author: "유진",
      avatar: defaultProfile,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1763502945866-10bdde6e3cd4?w=200",
      title: "페리페라 잉크 더 벨벳",
      author: "지은",
      avatar: defaultProfile,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1638225304129-eae5c3604d9c?w=200",
      title: "디올 어딕트 립스틱",
      author: "수아",
      avatar: defaultProfile,
    },
  ];

  // 인기 발색샷 mock 데이터
  const mockSwatchFeed: SwatchFeedItem[] = [
    {
      type: "swatch",
      user: { name: "지은", handle: "@jieun", avatar: defaultProfile },
      time: "2h",
      description: "롬앤 주시래스팅 틴트 #20 실제 발색이에요. 생각보다 훨씬 선명하고 지속력도 좋아요!",
      images: [
        "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600",
        "https://images.unsplash.com/photo-1638225304129-eae5c3604d9c?w=600",
      ],
      likeCount: 24,
      commentCount: 3,
      isLiked: false,
    },
    {
      type: "swatch",
      user: { name: "수아", handle: "@sua_beauty", avatar: defaultProfile },
      time: "5h",
      description: "헤라 블랙 쿠션 23호 발색입니다. 커버력 대박이에요",
      images: [
        "https://images.unsplash.com/photo-1602260395251-0fe691861b56?w=600",
      ],
      likeCount: 41,
      commentCount: 7,
      isLiked: true,
    },
    {
      type: "tweet",
      tweetId: "2033875454248292820",
      user: { name: "서연", handle: "@seoyeon_tw", avatar: defaultProfile },
      time: "1d",
    },
    {
      type: "tweet",
      tweetId: "2036597317613265064",
      user: { name: "mogimogi098", handle: "@mogimogi098", avatar: defaultProfile },
      time: "3h",
    },
  ];

  // 할인 제품들
  const discountProducts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1690214392595-297a43d5b6f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdobGlnaHRlciUyMG1ha2V1cCUyMGNvc21ldGljfGVufDF8fHx8MTc3MjYwODg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      productName: "하이라이터",
      discountInfo: "40% 롯데온에서 할인",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1764333746618-6285bf70db23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVzaCUyMHBvd2RlciUyMGNvbXBhY3QlMjBiZWF1dHl8ZW58MXx8fHwxNzcyNjA4ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      productName: "블러셔",
      discountInfo: "30% 쿠팡에서 특가",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1638225304129-eae5c3604d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXAlMjB0aW50JTIwdHViZSUyMGtvcmVhbiUyMGJlYXV0eXxlbnwxfHx8fDE3NzI2MDg4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      productName: "립틴트",
      discountInfo: "50% SSG닷컴에서 세일",
    },
  ];


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6 items-start">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0">

      {/* 대시보드 */}
      {dashboard && (
        <div className="border border-gray-200 rounded-xl p-5 mb-8 font-mono">
          <div className="flex gap-8 flex-wrap">
            {/* SYSTEM STATUS */}
            <div className="flex-shrink-0">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">// SYSTEM_STATUS</p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-20">BRAND</span>
                  <span className="text-gray-300 tracking-widest">...........</span>
                  <span className="text-gray-800 font-medium">{dashboard.brandCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-20">PRODUCT</span>
                  <span className="text-gray-300 tracking-widest">...........</span>
                  <span className="text-gray-800 font-medium">{dashboard.productCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-20">SWATCH</span>
                  <span className="text-gray-300 tracking-widest">...........</span>
                  <span className="text-gray-800 font-medium">{dashboard.swatchCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-px self-stretch bg-gray-200" />

            {/* CATEGORY */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">// CATEGORY</p>
              <div className="flex flex-wrap gap-2">
                {dashboard.categoryStats.map((cat) => (
                  <button
                    key={cat.category}
                    className="flex items-center gap-1.5 px-3 py-1 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs text-gray-700">{cat.category}</span>
                    <span className="text-xs text-gray-400">• {cat.productCount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 좋아요 많은 것들 섹션 */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">// 좋아요 많은 것들</h2>

          {/* 카테고리 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span>{selectedCategory.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {categoryMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-200 rounded-lg shadow-sm z-10 overflow-hidden">
                <div>
                  <button
                    onClick={() => { setSelectedCategory({ name: "전체", slug: "" }); setCategoryMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    전체
                  </button>
                  {categories.length > 0 && <div className="h-px bg-gray-100 mx-2" />}
                </div>
                {categories.map((category, index) => (
                  <div key={category.slug}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {category.name}
                    </button>
                    {index < categories.length - 1 && (
                      <div className="h-px bg-gray-100 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          {/* 왼쪽 화살표 */}
          {sliderScrollLeft > 0 && (
            <button
              onClick={() => slideBy("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* 슬라이더 */}
          <div
            ref={sliderRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              setSliderScrollLeft(el.scrollLeft);
              if (!popularIsLast && !popularFetching && el.scrollLeft + el.offsetWidth >= el.scrollWidth - 100) {
                fetchPopular(popularPage + 1, selectedCategory.slug);
              }
            }}
            className="flex gap-3 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {popularProducts.map((product) => (
              <div
                key={product.slug}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="cursor-pointer flex-shrink-0"
                style={{ width: "calc((100% - 24px) / 3)" }}
              >
                <FeedProductCard
                  images={(product.officialImageUrls ?? []).map(url => `${API_BASE}${url}`)}
                  brandName={product.brandNameKo || product.brandName}
                  productName={`${product.nameKo} ${product.optionNameKo ?? ""}`.trim()}
                  categoryName={product.categoryName}
                  swatchCount={product.swatchCount}
                  likeCount={product.likeCount}
                  viewCount={product.viewCount}
                  tags={product.tags}
                />
              </div>
            ))}
          </div>

          {/* 오른쪽 화살표 */}
          <button
            onClick={() => slideBy("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">// 인기 발색샷</h2>
        </div>
        <div className="relative" style={{ maxHeight: '600px', overflow: 'hidden' }}>
          <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
            <Masonry gutter="12px">
              {mockSwatchFeed.map((item, i) => (
                <SwatchFeedCard key={i} {...item} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
          {/* 하단 페이드 */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/swatch')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            더보기
          </button>
        </div>
      </div>

      {/* 할인중인거 섹션 */}
      <div>
        <div className="flex items-center mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">// 할인중인거</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {discountProducts.map((product) => (
            <DiscountCard
              key={product.id}
              image={product.image}
              productName={product.productName}
              discountInfo={product.discountInfo}
            />
          ))}
        </div>
      </div>

      </div>{/* 메인 콘텐츠 끝 */}

      {/* 우측 사이드바 - 최근 편집된 항목들 */}
      <div className="w-44 flex-shrink-0 sticky top-8">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">// 최근 편집</p>
          </div>
          <div className="divide-y divide-gray-100">
            {recentlyEdited.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <img src={item.avatar} alt={item.author} className="w-3.5 h-3.5 rounded-full object-cover" />
                    <span className="text-xs text-gray-400 truncate">{item.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}