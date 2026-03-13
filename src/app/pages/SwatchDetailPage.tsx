import { SwatchCard } from "../components/SwatchCard";
import { TwitterEmbed } from "../components/TwitterEmbed";
import { BrandProductModal } from "../components/BrandProductModal";
import { ArrowLeft, Image, Heart, Bell, ArrowUpDown, Edit2, X, Plus, Check } from "lucide-react";
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

  interface OtherOptionProduct {
      slug: string;
      name: string;
    optionName: string;
    brandNameKo: string;
    nameKo: string;
    optionNameKo: string;
    description: string;
    officialImageUrl: string | null;
    isCurrent: boolean;
    isParent: boolean;
  }

  interface ProductDetail {
    slug: string;
    brandSlug: string;
    brandLogoUrl: string;
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
    otherOptions: OtherOptionProduct[];
  }
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1200);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState("인기순 정렬");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTags, setEditedTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#C9B8A8");
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
  const [editedProductImage, setEditedProductImage] = useState<string | null>(null);
  const [editedProductImageFile, setEditedProductImageFile] = useState<File | null>(null);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const [isAddOptionModalOpen, setIsAddOptionModalOpen] = useState(false);

  const sortOptions = ["인기순 정렬", "최신순 정렬", "좋아요순 정렬", "북마크순 정렬"];
  const randomColors = ["#C9B8A8", "#D4A5B0", "#B87070", "#C8927A", "#9B7585"];


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

  // 수정 모드 진입
  const handleEditClick = () => {
    if (!product) return;
    setIsEditMode(true);
    setEditedTags([...product?.tags]);
    setEditedProductImage(null);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTags([]);
    setShowAddTagInput(false);
    setNewTagName("");
    setNewTagColor("#C9B8A8");
    setEditedProductImage(null);
  };

  // 태그 삭제
  const handleDeleteTag = (index: number) => {
    const updated = editedTags.filter((_, i) => i !== index);
    setEditedTags(updated);
  };

  // 태그 추가
  const handleAddTag = () => {
    if (newTagName.trim()) {
      setEditedTags([...editedTags, { 
        id: Date.now(),
        tagType: "",
        tagValue: newTagName.trim(),
        color: newTagColor 
      }]);
      setNewTagName("");
      setNewTagColor("#C9B8A8");
      setShowAddTagInput(false);
    }
  };

  // 이미지 업로드 핸들러
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedProductImage(imageUrl);
      setEditedProductImageFile(file);
    }
  };

  

  // 저장
  const handleSave = async () => {
    setIsSaving(true);
    
    // 서버에 저장하는 로직 (실제로는 API 호출)
    try {
      const formData = new FormData();

      formData.append("data", new Blob([JSON.stringify({
        name: product?.name,
          nameKo: product?.nameKo,
          option: product?.optionName,
          optionKo: product?.optionNameKo,
          description: product?.description,
          addTags: editedTags.filter(t => !product?.tags.some(pt => pt.id === t.id)),
          removeTags: product?.tags
            .filter(pt => !editedTags.some(t => t.id === pt.id))
            .map(t => t.id)
      })], { type: "application/json" }));

      if (editedProductImageFile) {
        formData.append("image", editedProductImageFile);
      }

      console.log(slug);

      const res = await fetch(`http://localhost:8080/api/product/${slug}`, {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          setShowSaveSuccessModal(true);
          setProduct(data);
        }
        
    } catch (e) {
      console.error('저장실패라능', e);
    } 
    setProduct(prev => prev ? { ...prev, tags: editedTags } : null);//
    setIsEditMode(false);
    setEditedTags([]);
    setEditedProductImage(null);
    setIsSaving(false);
   
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    
    // 즉시 UI 업데이트
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);
    
    // 서버에 요청 (실제로는 API 호출)
    console.log("서버에 좋아요 상태 전송:", { liked: newLikedState, count: newLikeCount });
    
    // 시뮬레이션: 서버 응답 대기
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log("좋아요 저장 완료");
    } catch (error) {
      // 에러 발생 시 원래 상태로 롤백
      console.error("좋아요 저장 실패:", error);
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
    }
  };

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
      <BrandProductModal
          isOpen={isAddOptionModalOpen}
          onClose={() => setIsAddOptionModalOpen(false)}
          selectedBrandSlug={product.brandSlug}
          selectedProductSlug={product.otherOptions.find(p => p.isParent)?.slug}
      />

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
            <div className="w-full md:w-1/4 relative">
              {isEditMode ? (
                <>
                  <div 
                    onClick={() => document.getElementById('productImageUpload')?.click()}
                    className="relative cursor-pointer group"
                  >
                    <img 
                      src={editedProductImage || `http://localhost:8080${product?.officialImageUrl}`}
                      alt={product?.nameKo}
                      className="w-full rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                        <Edit2 className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">사진 변경</p>
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    id="productImageUpload"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                </>
              ) : (
                <img 
                  src={`http://localhost:8080${product?.officialImageUrl}`}
                  alt={product?.nameKo}
                  className="w-full rounded-lg"
                />
              )}
            </div>
            
            {/* 제품 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-3xl">{product?.brandNameKo} {product?.nameKo}</h1>
                {!isEditMode && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">수정</span>
                  </button>
                )}
              </div>
              <h1 className="text-3xl">{product?.optionNameKo}</h1>
              
              {/* 컬러 태그들 */}
              {!isEditMode ? (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map((tag) => (
                    <div 
                      key={tag.tagValue}
                      className="px-3 py-1 rounded text-xs"
                      style={{ backgroundColor: tag.color ?? randomColors[tag.id % randomColors.length], color: '#fff' }}
                    >
                      {tag.tagValue}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editedTags.map((tag, index) => (
                      <div 
                        key={index}
                        className="px-3 py-1 rounded text-xs flex items-center gap-2 group"
                        style={{ backgroundColor: tag.color ?? randomColors[tag.id % randomColors.length], color: '#fff' }}
                      >
                        <span>{tag.tagValue}</span>
                        <button
                          onClick={() => handleDeleteTag(index)}
                          className="opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {!showAddTagInput && (
                      <button
                        onClick={() => setShowAddTagInput(true)}
                        className="px-3 py-1 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>태그 추가</span>
                      </button>
                    )}
                  </div>
                  
                  {/* 태그 추가 입력 */}
                  {showAddTagInput && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3 max-w-md">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="태그 이름"
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTag();
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddTag}
                          disabled={!newTagName.trim()}
                          className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          추가
                        </button>
                        <button
                          onClick={() => {
                            setShowAddTagInput(false);
                            setNewTagName("");
                            setNewTagColor("#C9B8A8");
                          }}
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 수정 모드 버튼들 */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>저장중...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>저장</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
              
              {/* 아이콘 섹션 */}
              <div className="flex items-center gap-6 pb-6 mb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-400">
                  <Image className="w-5 h-5" />
                  <span className="text-sm">142</span>
                </div>
                
                <button
                  onClick={handleLikeToggle}
                  className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Heart 
                    className="w-5 h-5" 
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </button>
                <span className="text-sm text-gray-400">{likeCount.toLocaleString()}</span>
                
                <div 
                  className="relative"
                  onMouseEnter={() => setShowNotificationTooltip(true)}
                  onMouseLeave={() => setShowNotificationTooltip(false)}
                >
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Bell 
                      className="w-5 h-5" 
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                  
                  {/* 툴팁 */}
                  {showNotificationTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
                      제품 할인 알림을 받을 수 있습니다
                      {/* 화살표 */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 브랜드 정보 */}
              <button 
                key={product.brandSlug}
                onClick={() => navigate('/brand')}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors"
              >
                <img 
                  src={`http://localhost:8080${product.brandLogoUrl}`}
                  alt="브랜드 로고" 
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="text-left">
                  <p className="text-base font-medium text-gray-900">{product.brandNameKo}</p>
                  <p className="text-xs text-gray-500">{product.brandName}</p>
                </div>
              </button>
            </div>

            {/* 이 제품의 다른 옵션들 */}
            <div className="hidden lg:block w-64">
              <h3 className="text-sm text-gray-500 mb-4">이 제품의 다른 옵션 보기</h3>
              <div className="space-y-3">
                {product.otherOptions.map((option) => (
                  <button
                    key={option.slug}
                    onClick={() => navigate(`/product/${option.slug}`)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      option.isCurrent 
                        ? 'bg-gray-100 border-2 border-gray-900' 
                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <img 
                      src={`http://localhost:8080${option?.officialImageUrl ?? ''}`}
                      alt={option.name} 
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0 pt-0.5">
                      <p className={`text-sm truncate ${option.isCurrent ? 'font-medium' : ''}`}>
                        {option.nameKo}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{option.optionNameKo}</p>
                    </div>
                  </button>
                ))}

                {/* 옵션 추가 버튼 */}
                <button
                  onClick={() => setIsAddOptionModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm text-gray-600">옵션 추가</p>
                  </div>
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

      {showSaveSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* 성공 메시지 모달 */}
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  className="w-8 h-8 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                저장 완료
              </h3>
              <p className="text-sm text-gray-600">
                변경사항이 저장되었습니다.
              </p>
            </div>
            
            <button
              onClick={() => setShowSaveSuccessModal(false)}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}