import { Sidebar } from "../components/Sidebar";
import { FeedCard } from "../components/FeedCard";
import { DiscountCard } from "../components/DiscountCard";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("립스틱");

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
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcyNDcyNzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "유진",
        date: "2026.03.03 13:00",
      },
    },
  ];

  // 할인 제품들
  const discountProducts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1690214392595-297a43d5b6f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdobGlnaHRlciUyMG1ha2V1cCUyMGNvc21ldGljfGVufDF8fHx8MTc3MjYwODg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      text: "하이라이터 40% 롯데온에서 할인",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1764333746618-6285bf70db23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVzaCUyMHBvd2RlciUyMGNvbXBhY3QlMjBiZWF1dHl8ZW58MXx8fHwxNzcyNjA4ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      text: "블러셔 30% 쿠팡에서 특가",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1638225304129-eae5c3604d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXAlMjB0aW50JTIwdHViZSUyMGtvcmVhbiUyMGJlYXV0eXxlbnwxfHx8fDE3NzI2MDg4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      text: "립틴트 50% SSG닷컴에서 세일",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* 좌측 사이드바 */}
      <Sidebar 
        userProfile={{
          avatar: "https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwZmFjZSUyMHByb2ZpbGV8ZW58MXx8fHwxNzcyNjAyMDQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          username: "김채원"
        }}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 ml-64">
        {/* 상단 바 - 로고와 검색창 */}
        <div className="border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <h1 className="text-lg font-medium text-gray-700">모기위키</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="검색"
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
                
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  로그인
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 피드 */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 좋아요 많은 것들 섹션 */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">좋아요 많은 것들</h2>
              
              {/* 카테고리 드롭다운 */}
              <div className="relative">
                <button
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {categoryMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => navigate('/swatch-detail')}
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

          {/* 할인중인거 섹션 */}
          <div>
            <h2 className="text-2xl mb-6">할인중인거</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {discountProducts.map((product) => (
                <DiscountCard
                  key={product.id}
                  image={product.image}
                  text={product.text}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
