import { SwatchCard } from "../components/SwatchCard";
import { TwitterEmbed } from "../components/TwitterEmbed";
import { ArrowLeft, Image, Heart, Bookmark, ArrowUpDown } from "lucide-react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export function SwatchDetailPage() {
  const { slug } = useParams();

  interface Tag {
    id: number;
    tagType: string;
    tagValue: string;
    color: string | null;
  }

  interface ProductDetail {
    slug: string;
    brandSlug: string;
    category: string;
    categorySlug: string;
    brandName: string;
    name: string;
    optionName: string;
    brandNameKo: string;
    nameKo: string;
    optionNameKo: string;
    description: string;
    officialImageUrl: string | null;
    tags: Tag[];
  }
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState("인기순 정렬");

  const sortOptions = ["인기순 정렬", "최신순 정렬", "좋아요순 정렬", "북마크순 정렬"];


    useEffect(() => {
      const fetchProduct = async () => {
        const res = await fetch(`http://localhost:8080/api/product/${slug}`, {
          credentials: "include"
        });
        const data = await res.json();
        setProduct(data);
      };
  
      fetchProduct();
    }, [slug]);


  // 사용 가능한 컬러 태그
  const colorTags = [
    { name: "누드", color: "#C9B8A8" },
    { name: "핑크", color: "#D4A5B0" },
    { name: "레드", color: "#B87070" },
    { name: "코랄", color: "#C8927A" },
    { name: "베리", color: "#9B7585" },
  ];

  // 뷰티 제품의 스와치 데이터
  const swatches = [
    {
      id: 1,
      images: ["https://images.unsplash.com/photo-1714420076326-476283c9fcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudWRlJTIwbGlwc3RpY2slMjB0dWJlfGVufDF8fHx8MTc3MjYwMTQwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
      name: "01 소프트 누드",
      description: "일상에 잘 어울리는 부드러운 누드 베이지 톤. 어떤 메이크업에도 자연스럽게 매치됩니다.",
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
      name: "02 로맨틱 핑크",
      description: "사랑스러운 핑크 컬러로 생기있는 입술을 연출. 촉촉하고 부드러운 발림성이 특징입니다.",
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1643646805556-350c057663dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFzaWFuJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NzI1NzQzNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "수아",
        date: "2026.03.02 10:15",
      },
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1602260395251-0fe691861b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBsaXBzdGljayUyMGJlYXV0eXxlbnwxfHx8fDE3NzI2MDE0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1563441811597-99b0960e4239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJyeSUyMGxpcHN0aWNrJTIwY29zbWV0aWN8ZW58MXx8fHwxNzcyNjAxNDA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1585387047269-e66bf53002f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXBzdGljayUyMHN3YXRjaCUyMHBhbGV0dGV8ZW58MXx8fHwxNzcyNjAxNDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      name: "03 클래식 레드",
      description: "시간이 지나도 변치 않는 클래식한 레드 컬러. 강렬하면서도 세련된 매력을 선사합니다.",
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1718113460570-45a11d4226db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBjYXN1YWx8ZW58MXx8fHwxNzcyNTI3MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "민지",
        date: "2026.03.02 16:45",
      },
    },
    {
      id: 4,
      images: [
        "https://images.unsplash.com/photo-1770364016601-39c645feea99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBsaXBzdGljayUyMGJlYXV0eXxlbnwxfHx8fDE3NzI2MDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1764333746618-6285bf70db23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVzaCUyMHBvd2RlciUyMGNvbXBhY3R8ZW58MXx8fHwxNzcyNTEyMTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1770981667014-677a0bf91663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXV2ZSUyMGxpcHN0aWNrJTIwdHViZXxlbnwxfHx8fDE3NzI2MDE0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1583012279653-1575246476c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBleWVzaGFkb3clMjBwYWxldHRlfGVufDF8fHx8MTc3MjYwMTQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      name: "04 코랄 오렌지",
      description: "생기 넘치는 코랄 오렌지 컬러. 밝고 화사한 분위기를 연출하기에 완벽합니다.",
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1634052970539-224813476367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaXJsJTIwcG9ydHJhaXQlMjBiZWF1dHklMjBmYWNlfGVufDF8fHx8MTc3MjYwMjA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "서연",
        date: "2026.03.03 09:30",
      },
    },
    {
      id: 5,
      images: [
        "https://images.unsplash.com/photo-1770981667014-677a0bf91663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXV2ZSUyMGxpcHN0aWNrJTIwdHViZXxlbnwxfHx8fDE3NzI2MDE0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1563441811597-99b0960e4239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJyeSUyMGxpcHN0aWNrJTIwY29zbWV0aWN8ZW58MXx8fHwxNzcyNjAxNDA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      name: "05 모브 베리",
      description: "차분하면서도 개성 있는 모브 베리 컬러. 세련된 무드를 표현하고 싶을 때 추천합니다.",
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcyNDcyNzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "유진",
        date: "2026.03.03 13:00",
      },
    },
    {
      id: 6,
      images: ["https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbGlwc3RpY2slMjBjb3NtZXRpY3xlbnwxfHx8fDE3NzI2MDE0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
      name: "06 피치 글로우",
      description: "따뜻한 피치 톤으로 건강한 광채를 더해줍니다. 데일리룩에 잘 어울립니다.",
      userProfile: {
        avatar: "https://images.unsplash.com/photo-1680104072294-e9e15e26c5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGZhY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNTM0NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        username: "준호",
        date: "2026.03.04 11:25",
      },
    },
  ];
if (!product) return <div>로딩중...</div>;
  return (
    <>
      {/* 헤더 - 제품 메인 정보 */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          {/* 뒤로가기 버튼 */}
          <div className="py-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start pb-12">
            {/* 제품 메인 이미지 */}
            <div className="w-full md:w-1/3">
              <img 
                src={`http://localhost:8080${product?.officialImageUrl ?? ''}`}
                alt={product?.nameKo}
                className="w-full rounded-lg"
              />
            </div>
            
            {/* 제품 정보 */}
            <div className="flex-1">
              <h1 className="text-3xl mb-3">{product?.nameKo}</h1>
              <p className="text-xl text-gray-500 mb-6">₩28,000</p>
              
              {/* 컬러 태그들 */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product?.tags.map((tag) => (
                  <div 
                    key={tag.tagValue}
                    className="px-3 py-1 rounded text-xs"
                    style={{ backgroundColor: tag.color ?? '#FFF', color: '#fff' }}
                  >
                    {tag.tagValue}
                  </div>
                ))}
              </div>

              {/* 아이콘 섹션 */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Image className="w-5 h-5" />
                  <span className="text-sm">142</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">1.2k</span>
                </div>
                
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Bookmark 
                    className="w-5 h-5" 
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스와치 카드 그리드 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">컬러 선택</h2>
          
          {/* 정렬 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{sortOption}</span>
            </button>
            
            {sortMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option);
                      setSortMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {swatches.slice(0, 2).map((swatch) => (
            <SwatchCard
              key={swatch.id}
              images={swatch.images}
              name={swatch.name}
              description={swatch.description}
              userProfile={swatch.userProfile}
            />
          ))}
          
          {/* 트위터 임베드 카드 */}
          <TwitterEmbed
            username="모기모기초"
            handle="mogimogi098"
            isVerified={true}
            content={`사진을 대충 찍긴 했는데
쥬디님칼레션 있으면 뭔가 되게 귀엽고(저말고요) 있어보여서(?) 애용합니다..
오시탑말 색 가족팀들 노리는중..`}
            images={swatches[2].images}
            timestamp="1:56 PM · Mar 4, 2026"
            likes={1}
            userProfile={swatches[2].userProfile.avatar}
          />
          
          {swatches.slice(3).map((swatch) => (
            <SwatchCard
              key={swatch.id}
              images={swatch.images}
              name={swatch.name}
              description={swatch.description}
              userProfile={swatch.userProfile}
            />
          ))}
        </div>
      </div>
    </>
  );
}