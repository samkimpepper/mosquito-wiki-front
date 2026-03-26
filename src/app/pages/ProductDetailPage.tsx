import { SwatchCard } from "../components/SwatchCard";
import { API_BASE } from "../../config";
import { Tweet } from "react-tweet";
import { BrandProductModal } from "../components/BrandProductModal";
import { UploadModal } from "../components/UploadModal";
import { ImageUploader } from "../components/ImageUploader";
import { ArrowLeft, Image, Heart, Bell, ArrowUpDown, Edit2, X, Plus, Check, ChevronRight, Copy } from "lucide-react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import defaultProfile from "../../assets/default_profile.jpg";

export function ProductDetailPage() {
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
    officialImageUrls: string[];
    liked: boolean;
    likeCount: number;
    swatchCount: number;
    tags: Tag[];
    otherOptions: OtherOptionProduct[];
  }

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [editedCategory, setEditedCategory] = useState("");
  type ImageItem = { id: string; file: File | null; existingUrl: string | null } | null;
  const [editedProductImages, setEditedProductImages] = useState<(ImageItem | null)[]>([]);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductNameEn, setEditedProductNameEn] = useState("");
  const [editedOptionName, setEditedOptionName] = useState("");
  const [editedOptionNameEn, setEditedOptionNameEn] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [categories, setCategories] = useState<{ slug: string; name: string; }[]>([]);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [swatchList, setSwatchList] = useState<{ id: number; sourceType: string; tweetUrl: string | null; images: string[]; name: string; description: string; likeCount: number; userProfile: { avatar: string; username: string; handle: string; date: string } }[]>([]);
  const [swatchLoading, setSwatchLoading] = useState(false);
  

  const sortOptions = ["인기순 정렬", "최신순 정렬", "좋아요순 정렬", "북마크순 정렬"];
  const randomColors = ["#C9B8A8", "#D4A5B0", "#B87070", "#C8927A", "#9B7585"];


    useEffect(() => {
      const fetchProduct = async () => {
        const res = await fetch(`${API_BASE}/api/product/${slug}`, {
          credentials: "include"
        });
        const data = await res.json();
        setProduct(data);
        setIsLiked(data.liked);
      };
  
      fetchProduct();
    }, [slug]);

    useEffect(() => {
      fetch(`${API_BASE}/api/category`, {
        credentials: "include"
      })
        .then(res => res.json())
        .then((data: { slug: string; name: string; }[]) => setCategories(data));
    }, []);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxImage(null); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  useEffect(() => {
    if (!slug) return;
    setSwatchList([]);
    const load = async () => {
      setSwatchLoading(true);
      try {
        const url = `${API_BASE}/api/swatch?page=0&size=9&productSlug=${encodeURIComponent(slug)}`;
        console.log("[ProductDetailPage] swatch fetch url:", url);
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        console.log("[ProductDetailPage] swatch fetch response:", data);
        setSwatchList(data.content.map((item: any) => {
          const lines = (item.content ?? "").split("\n");
          return {
            id: item.id,
            sourceType: item.sourceType,
            tweetUrl: item.tweetUrl ?? null,
            images: (item.images ?? []).map((img: string) => img.startsWith("http") ? img : `${API_BASE}${img}`),
            name: lines[0] ?? "",
            description: lines.slice(1).join("\n"),
            likeCount: item.likeCount ?? 0,
            userProfile: {
              avatar: item.user?.profileImageUrl
                ? item.user.profileImageUrl.startsWith("http")
                  ? item.user.profileImageUrl
                  : `${API_BASE}${item.user.profileImageUrl}`
                : defaultProfile,
              username: item.user?.name ?? "",
              handle: item.user?.handle ?? "",
              date: item.createdAt,
            },
          };
        }));
      } catch (e) {
        console.error("[ProductDetailPage] swatch mapping error:", e);
      } finally {
        setSwatchLoading(false);
      }
    };
    load();
  }, [slug]);


  // 수정 모드 진입
  const handleEditClick = () => {
    if (!product) return;
    setIsEditMode(true);
    setEditedTags([...product?.tags]);
    setEditedProductName(product?.nameKo ?? "");
    setEditedProductNameEn(product?.name ?? "");
    setEditedOptionName(product?.optionNameKo ?? "");
    setEditedOptionNameEn(product?.optionName ?? "");
    setEditedProductImages(
      productImages.map((url, i) => ({
        id: `existing-${i}`,
        file: null,
        existingUrl: url,
      }))
    );
    
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTags([]);
    setEditedProductName("");
    setEditedProductNameEn("");
    setEditedOptionName("");
    setEditedOptionNameEn("");
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

  // 텍스트 복사 핸들러
  const handleCopyText = (text: string) => {
    // Fallback 복사 방법 (클립보드 API가 차단된 경우)
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      setCopiedText(text);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  // 이미지 업로드 핸들러
  const handleProductImageUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newEditedImages = [...editedProductImages];
      newEditedImages[index] = { id: `image-${index}`, file, existingUrl: imageUrl };
      setEditedProductImages(newEditedImages);
      setEditedProductImage(imageUrl);
      setEditedProductImageFile(file);
    }
  };

  // 이미지 삭제 핸들러
  const handleDeleteProductImage = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newEditedImages = [...editedProductImages];
    newEditedImages[index] = { id: `image-${index}`, file: null, existingUrl: 'DELETED' };
    setEditedProductImages(newEditedImages);
  };

  // 저장
  const handleSave = async () => {
    setIsSaving(true);
    
    // 서버에 저장하는 로직 (실제로는 API 호출)
    try {
      const formData = new FormData();

      let newFileIndex = 0;
      const slots: string[] = [];

      for (const item of editedProductImages) {
        if (!item) continue;
        if (item.id.startsWith("existing")) {
          slots.push(item.existingUrl.replace(API_BASE, ""));
        } else {
          slots.push(`NEW_${newFileIndex++}`);
          if (item.file) formData.append("newImages", item.file);
        }
      }
      console.log(editedProductNameEn);

      formData.append("data", new Blob([JSON.stringify({
          name: editedProductNameEn,
          nameKo: editedProductName,
          option: editedOptionNameEn,
          optionKo: editedOptionName,
          description: product?.description,
          imageSlots: slots,
          addTags: editedTags.filter(t => !product?.tags.some(pt => pt.id === t.id)),
          removeTags: product?.tags
            .filter(pt => !editedTags.some(t => t.id === pt.id))
            .map(t => t.id)
      })], { type: "application/json" }));


      console.log(formData);

      const res = await fetch(`${API_BASE}/api/product/${slug}`, {
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
    if (isLiking) return;  // 처리 중이면 무시
    setIsLiking(true);

    try {
        const res = await fetch(`${API_BASE}/api/product/like/${slug}`, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        setIsLiked(data.liked);
        setProduct(prev => prev ? { ...prev, likeCount: data.likeCount } : null);//
    } finally {
        setIsLiking(false);
    }
  };

  

if (!product) return <div>로딩중...</div>;
const productImages = product.officialImageUrls;
//const productImages = product.officialImageUrls.filter(Boolean).map(url => `${API_BASE}${url}`) as string[];
  return (
    <>
      <BrandProductModal
          isOpen={isAddOptionModalOpen}
          onClose={() => setIsAddOptionModalOpen(false)}
          selectedBrandSlug={product.brandSlug}
          selectedProductSlug={product.otherOptions.find(p => p.isParent)?.slug}
      />
      <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          productSlug={product.slug}
      />

      {/* 이미지 라이트박스 */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* 스크롤바 커스텀 스타일 */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>

      {/* 헤더 - 제품 메인 정보 */}
      <div>
        <div className="max-w-6xl mx-auto px-4">
          {/* 뒤로가기 버튼 */}
          <div className="py-2 flex items-center">
            <button
              onClick={() => navigate('/')}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors mr-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>

            {/* 카테고리 표시 */}
            {isEditMode ? (
              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-gray-400 bg-white"
              >
                {categories.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-gray-400">
                // {product.category}
              </span>
            )}
          </div>

          {/* 이미지 갤러리 + 다른 옵션 보기 */}
          <div className="flex gap-6 pb-8">
            {/* 제품 메인 이미지 갤러리 */}
            <div className="flex-1 flex gap-3">
              {/* 썸네일 이미지들 (왼쪽 세로 배치) */}
              {!isEditMode && (
                <div className="flex flex-col gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImageIndex === index 
                          ? 'border-gray-900' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={`${API_BASE}${image}`}
                        alt={`제품 이미지 ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* 메인 이미지 */}
              <div className="flex-1 max-w-2xl flex items-center justify-center">
                {isEditMode ? (
                  <div className="ml-[76px]">
                    <ImageUploader
                      initialImages={productImages.map((url, i) => ({ id: `existing-${i}`, url: API_BASE + url }))}
                      onChange={(items) => {
                        setEditedProductImages(items);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="h-[400px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden w-full cursor-zoom-in"
                    onClick={() => setLightboxImage(`${API_BASE}${productImages[selectedImageIndex]}`)}
                  >
                    <img
                      src={`${API_BASE}${productImages[selectedImageIndex]}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 이 제품의 다른 옵션들 */}
            <div className="hidden lg:block w-64 flex-shrink-0 border border-gray-200 rounded-xl overflow-hidden">
              {/* 헤더 */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">// 다른 옵션</p>
                <p className="text-xs text-gray-400 mt-2">총 {product.otherOptions.length}개</p>
              </div>

              {/* 스크롤 가능한 옵션 리스트 */}
              <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                {product.otherOptions.map((option) => (
                  <button
                    key={option.slug}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                      option.isCurrent
                        ? 'bg-gray-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {option.isCurrent && (
                      <div className="absolute left-0 w-0.5 h-8 bg-gray-800 rounded-r" />
                    )}
                    <img
                      src={option?.officialImageUrl ? `${API_BASE}${option.officialImageUrl}` : defaultProfile}
                      alt={option.nameKo}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs truncate ${option.isCurrent ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {option.brandNameKo} {option.nameKo}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {option.optionNameKo}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* 옵션 추가 버튼 */}
              <div className="border-t border-gray-200">
                <button
                  onClick={() => setIsAddOptionModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>옵션 추가</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* 제품 정보 섹션 */}
          <div className="pb-12">
            <div className="max-w-2xl ml-[76px]">
              {/* 제품명 및 수정 버튼 */}
              {isEditMode ? (
                <div className="flex-1 mr-2 mb-3">
                  <div className="space-y-2 mb-6">
                    <label className="text-sm font-medium text-gray-700 block">
                      제품명
                    </label>
                    <div className="flex gap-3">
                      <div className="w-1/2 space-y-1">
                        <label className="text-xs text-gray-400 block"><span className="text-red-400">*</span> (한국어)</label>
                        <textarea
                          value={editedProductName}
                          onChange={(e) => setEditedProductName(e.target.value)}
                          placeholder="제품명 (한글)"
                          rows={1}
                          className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none overflow-hidden"
                          style={{ minHeight: '48px' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </div>
                      <div className="w-1/2 space-y-1">
                        <label className="text-xs text-gray-400 block">(영어)</label>
                        <textarea
                          value={editedProductNameEn}
                          onChange={(e) => setEditedProductNameEn(e.target.value)}
                          placeholder="제품명 (영어)"
                          rows={1}
                          className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none overflow-hidden"
                          style={{ minHeight: '48px' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">이 제품의 같은 라인에 모두 반영됩니다.</p>
                  </div>
                  <div className="flex flex-col space-y-2 mb-8">
                    <label className="text-sm font-medium text-gray-700 block">
                      옵션명
                    </label>
                    <div className="flex gap-3">
                      <div className="w-1/2 space-y-1">
                        <label className="text-xs text-gray-400 block"><span className="text-red-400">*</span> (한국어)</label>
                        <textarea
                          value={editedOptionName}
                          onChange={(e) => setEditedOptionName(e.target.value)}
                          placeholder="옵션명 (한글)"
                          rows={1}
                          className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none overflow-hidden"
                          style={{ minHeight: '48px' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </div>
                      <div className="w-1/2 space-y-1">
                        <label className="text-xs text-gray-400 block">(영어)</label>
                        <textarea
                          value={editedOptionNameEn}
                          onChange={(e) => setEditedOptionNameEn(e.target.value)}
                          placeholder="옵션명 (영어)"
                          rows={1}
                          className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none overflow-hidden"
                          style={{ minHeight: '48px' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{product.brandNameKo}</span>
                    <h1 className="text-3xl">{product.nameKo}</h1>
                    <span className="text-3xl text-gray-400">-</span>
                    <p className="text-3xl">{product.optionNameKo}</p>
                  </div>
                  {product.name?.trim() && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-base text-gray-400">{product.name}</p>
                      <span className="text-base text-gray-300">-</span>
                      <p className="text-base text-gray-400">{product.optionName}</p>
                    </div>
                  )}
                </div>
              )}
              
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
                      disabled={isSaving || !editedProductName.trim() || !editedOptionName.trim()}
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
              <div className="flex items-center gap-4 py-4 mb-4 border-t border-gray-200 justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Image className="w-4 h-4" />
                    <span className="text-xs">{product.swatchCount}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleLikeToggle}
                      className={`transition-colors ${isLiked ? 'text-red-400' : 'text-gray-300 hover:text-gray-500'}`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={isLiked ? "currentColor" : "none"}
                      />
                    </button>
                    <span className="text-xs text-gray-400">{product.likeCount.toLocaleString()}</span>
                  </div>

                  <div
                    className="relative flex items-center"
                    onMouseEnter={() => setShowNotificationTooltip(true)}
                    onMouseLeave={() => setShowNotificationTooltip(false)}
                  >
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-500'}`}
                    >
                      <Bell
                        className="w-4 h-4"
                        fill={isBookmarked ? "currentColor" : "none"}
                      />
                    </button>

                    {/* 툴팁 */}
                    {showNotificationTooltip && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap">
                        제품 할인 알림을 받을 수 있습니다
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                          <div className="border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 복사/수정 버튼 */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleCopyText(`${product.brandNameKo} ${product.nameKo} ${product.optionNameKo}`)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                    title="제품명과 옵션명 복사"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">복사</span>
                  </button>
                  <div className="w-px self-stretch bg-gray-200" />
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">수정</span>
                  </button>
                </div>
              </div>

              {/* 브랜드 정보 */}
              <button
                onClick={() => navigate(`/brand/${product.brandSlug}`)}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all w-fit"
              >
                <img
                  src={`${API_BASE}${product.brandLogoUrl}`}
                  alt="브랜드 로고"
                  className="w-8 h-8 object-cover rounded-lg border border-gray-100"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{product.brandNameKo}</p>
                  <p className="text-xs text-gray-400">{product.brandName}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 스와치 카드 그리드 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">// 발색샷 보기</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ border: "1px solid #AE4DFF", background: "#F5E6FF", color: "#AE4DFF" }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>스와치 추가</span>
            </button>

            {/* 정렬 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setSortMenuOpen(!sortMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortOption}</span>
              </button>

              {sortMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-sm z-10 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setSortMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {swatchList.length === 0 && !swatchLoading ? (
          <p className="text-xs text-gray-400 py-8 text-center">등록된 발색샷이 없습니다.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {swatchList.map((swatch) =>
                swatch.sourceType === "TWITTER" && swatch.tweetUrl ? (
                  <div key={swatch.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* 등록자 정보 */}
                    <div className="px-3 py-2.5 flex items-center gap-2 border-b border-gray-100">
                      <img
                        src={swatch.userProfile.avatar}
                        alt={swatch.userProfile.username}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-gray-800">{swatch.userProfile.username}</span>
                      <span className="text-xs text-gray-400 ml-auto">{swatch.userProfile.date}</span>
                    </div>
                    {/* 등록자 작성 내용 */}
                    {(swatch.name || swatch.description) && (
                      <p className="px-4 pt-2 pb-0 text-sm text-gray-700 whitespace-pre-wrap">
                        {[swatch.name, swatch.description].filter(Boolean).join("\n")}
                      </p>
                    )}
                    {/* 트위터 임베드 */}
                    <div className="px-3 pt-1 pb-2 [&_.react-tweet-theme]:shadow-none [&_.react-tweet-theme]:border-0 [&_.react-tweet-theme]:rounded-none [&_.react-tweet-theme]:bg-transparent [&_.react-tweet-theme]:max-w-none [&_.react-tweet-theme]:p-0">
                      <Tweet id={swatch.tweetUrl.match(/status(?:es)?\/(\d+)/)?.[1] ?? ""} />
                    </div>
                  </div>
                ) : (
                  <SwatchCard
                    key={swatch.id}
                    images={swatch.images}
                    name={swatch.name}
                    description={swatch.description}
                    userProfile={swatch.userProfile}
                  />
                )
              )}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate(`/swatch/${slug}`)}
                className="px-5 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                더 보기
              </button>
            </div>
          </>
        )}
      </div>

      {/* 저장 성공 모달 */}
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

      {/* 복사 완료 토스트 */}
      {showCopyToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] animate-fade-in-up">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">{copiedText} 복사되었습니다</span>
          </div>
        </div>
      )}
    </>
  );
}