import { FeedCard } from "../components/FeedCard";
import { DiscountCard } from "../components/DiscountCard";
import { Tweet } from "react-tweet";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
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

export function HomePage() {
  const navigate = useNavigate();
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("립스틱");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/home/dashboard", { credentials: "include" })
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(() => {});
  }, []);

  const categories = ["립스틱", "하이라이터", "블러셔", "아이섀도우", "립틴트"];
// 좋아요 많은 제품들
  const popularProducts = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1602260395251-0fe691861b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBsaXBzdGljayUyMGJlYXV0eXxlbnwxfHx8fDE3NzI2MDE0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1563441811597-99b0960e4239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJyeSUyMGxpcHN0aWNrJTIwY29zbWV0aWN8ZW58MXx8fHwxNzcyNjAxNDA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1585387047269-e66bf53002f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXBzdGljayUyMHN3YXRjaCUyMHBhbGV0dGV8ZW58MXx8fHwxNzcyNjAxNDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1714420076326-476283c9fcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudWRlJTIwbGlwc3RpY2slMjB0dWJlfGVufDF8fHx8MTc3MjYwMTQwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      productName: "벨벳 매트 립스틱",
      swatchCount: 142,
      likeCount: 1200,
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwZmFjZSUyMHByb2ZpbGV8ZW58MXx8fHwxNzcyNjAyMDQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "지은",
        date: "2026.03.01 14:20",
      },
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbGlwc3RpY2slMjBjb3NtZXRpY3xlbnwxfHx8fDE3NzI2MDE0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1635263282145-253319c75fd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMGxpcHN0aWNrJTIwbWFrZXVwfGVufDF8fHx8MTc3MjYwMTQwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      productName: "로맨틱 핑크 립스틱",
      swatchCount: 89,
      likeCount: 856,
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1643646805556-350c057663dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFzaWFuJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NzI1NzQzNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "수아",
        date: "2026.03.02 10:15",
      },
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1770364016601-39c645feea99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBsaXBzdGljayUyMGJlYXV0eXxlbnwxfHx8fDE3NzI2MDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      productName: "코랄 오렌지 립스틱",
      swatchCount: 52,
      likeCount: 634,
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1634052970539-224813476367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaXJsJTIwcG9ydHJhaXQlMjBiZWF1dHklMjBmYWNlfGVufDF8fHx8MTc3MjYwMjA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "서연",
        date: "2026.03.03 09:30",
      },
    },
    {
      id: 4,
      images: [
        "https://images.unsplash.com/photo-1690214392595-297a43d5b6f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdobGlnaHRlciUyMG1ha2V1cCUyMGNvc21ldGljfGVufDF8fHx8MTc3MjYwODg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1764333746618-6285bf70db23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVzaCUyMHBvd2RlciUyMGNvbXBhY3QlMjBiZWF1dHl8ZW58MXx8fHwxNzcyNjA4ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1676918325488-d4cd70b58f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVzaGFkb3clMjBwYWxldHRlJTIwbWFrZXVwJTIwY29sb3JmdWx8ZW58MXx8fHwxNzcyNTEyMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      productName: "글로우 하이라이터",
      swatchCount: 73,
      likeCount: 921,
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcyNDcyNzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "유진",
        date: "2026.03.03 13:00",
      },
    },
  ];

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
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {categoryMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-200 rounded-lg shadow-sm z-10 overflow-hidden">
                {categories.map((category, index) => (
                  <div key={category}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {category}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/swatch/${product.id}`)}
              className="cursor-pointer"
            >
              <FeedCard
                images={product.images}
                productName={product.productName}
                userProfile={product.userProfile}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 mb-10">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">// 피드</p>
        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1200: 4}}>
          <Masonry gutter="12px">
            {popularProducts.slice(0, 2).map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/swatch/${product.id}`)}
                className="cursor-pointer"
              >
                <FeedCard
                  images={product.images}
                  productName={product.productName}
                  swatchCount={product.swatchCount}
                  likeCount={product.likeCount}
                  userProfile={product.userProfile}
                />
              </div>
            ))}

            {/* 트위터 임베드 추가 */}
            <div className="flex flex-col">
              <Tweet id="2033875454248292820" />
            </div>

            {popularProducts.slice(2).map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/swatch/${product.id}`)}
                className="cursor-pointer"
              >
                <FeedCard
                  images={product.images}
                  productName={product.productName}
                  swatchCount={product.swatchCount}
                  likeCount={product.likeCount}
                  userProfile={product.userProfile}
                />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
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