import { X, Image, ChevronDown, Search } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Tweet } from "react-tweet";
import { useAuth } from "../../context/AuthContext";
import defaultProfile from "../../assets/default_profile.jpg";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug?: string;
}

interface ProductResult {
  slug: string;
  nameKo: string;
  nameEn: string;
  image: string;
}

export function UploadModal({ isOpen, onClose, productSlug }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<{ url: string; file: File }[]>([]);
  const [postType, setPostType] = useState("발색샷");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // 제품 검색 관련 state
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productResults, setProductResults] = useState<ProductResult[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductResult[]>([]);
  const [showProductResults, setShowProductResults] = useState(false);
  
  // 트위터 링크 감지 및 임베드 관련 state
  const [tweetId, setTweetId] = useState<string | null>(null);
  const [tweetUrl, setTweetUrl] = useState<string>("");

  // 트위터 링크 감지 및 제거
  useEffect(() => {
    const twitterRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\S+)?/g;
    const match = twitterRegex.exec(description);
    
    if (match && match[2]) {
      setTweetId(match[2]);
      setTweetUrl(match[0]); // 전체 URL 저장
      // description에서 트위터 링크 제거
      setDescription(description.replace(twitterRegex, '').trim());
    }
  }, [description]);

  // 제품 실시간 검색
  useEffect(() => {
    if (!productSearchQuery.trim()) {
      setProductResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`http://localhost:8080/api/product/search?keyword=${encodeURIComponent(productSearchQuery)}`, {
        credentials: "include"
      });
      const data = await res.json();
      setProductResults(data.map((item: any) => ({
        ...item,
        image: item.image ? `http://localhost:8080${item.image}` : defaultProfile,
      })));
    }, 150);
    return () => clearTimeout(timer);
  }, [productSearchQuery]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setSelectedImages([]);
    setPostType("발색샷");
    setProductSearchQuery("");
    setSelectedProducts([]);
    setTweetId(null);
    setTweetUrl("");
  }, []);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 4 - selectedImages.length;
    const toAdd = files.slice(0, remaining).map(file => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setSelectedImages(prev => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const handlePost = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const isTwitter = !!tweetId;
      const formData = new FormData();

      formData.append("data", new Blob([JSON.stringify({
        productSlug: selectedProducts[0]?.slug ?? null,
        content: [title, description].filter(Boolean).join("\n"),
        sourceType: isTwitter ? "TWITTER" : "UPLOAD",
        tweetUrl: isTwitter ? tweetUrl : null,
      })], { type: "application/json" }));

      for (const img of selectedImages) {
        formData.append("images", img.file);
      }

      await fetch("http://localhost:8080/api/swatch", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      resetForm();
      onClose();
    } catch (e) {
      console.error("swatch upload error", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postTypes = ["발색샷", "비교발색샷", "조합"];

  const handleProductSelect = (product: ProductResult) => {
    const isComparison = postType === "비교발색샷";
    const maxProducts = isComparison ? 20 : 1;
    if (selectedProducts.some(p => p.slug === product.slug)) return;
    if (selectedProducts.length >= maxProducts) return;
    if (isComparison) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts([product]);
    }
    setProductSearchQuery("");
    setShowProductResults(false);
  };

  const removeProduct = (slug: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.slug !== slug));
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center px-5 py-2 border-b border-gray-200">
          <span className="text-xs text-gray-400">// 발색샷 등록</span>
          <div className="w-px self-stretch bg-gray-200 mx-3 -my-2" />
          <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            임시저장
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex gap-3">
            {/* 프로필 사진 */}
            <div className="flex-shrink-0">
              <img
                src={user?.profileImageUrl ?? defaultProfile}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            </div>

            {/* 입력 영역 */}
            <div className="flex-1 space-y-4">
              {/* 커스텀 드롭다운 */}
              <div className="relative inline-block">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  <span>{postType}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden z-20 min-w-[120px]">
                      {postTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setPostType(type);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            type === postType
                              ? "bg-gray-50 text-gray-900 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 제목 입력 */}
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm font-medium placeholder-gray-300 focus:outline-none border-b border-gray-100 pb-2"
              />

              {/* 제품 검색 */}
              <div className="space-y-2">
                {/* 선택된 제품 목록 (비교발색샷인 경우에만 여러 개 표시) */}
                {selectedProducts.length > 0 && postType === "비교발색샷" && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProducts.map((product) => (
                      <div
                        key={product.slug}
                        className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 border border-gray-200 rounded-lg text-xs"
                      >
                        <img
                          src={product.image}
                          alt={product.nameKo}
                          className="w-5 h-5 object-cover rounded flex-shrink-0"
                        />
                        <span className="text-gray-800 max-w-[120px] truncate">{product.nameKo}</span>
                        <button
                          onClick={() => removeProduct(product.slug)}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    ))}
                    {selectedProducts.length < 20 && (
                      <span className="text-xs text-gray-400 self-center">
                        {selectedProducts.length}/20
                      </span>
                    )}
                  </div>
                )}

                {/* 제품 검색 인터페이스 */}
                <div className="relative">
                  {selectedProducts.length > 0 && postType !== "비교발색샷" ? (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedProducts[0].image}
                          alt={selectedProducts[0].nameKo}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-800">{selectedProducts[0].nameKo}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{selectedProducts[0].nameEn}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedProducts([])}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder={
                            postType === "비교발색샷"
                              ? `제품 선택 (최대 20개)${selectedProducts.length > 0 ? ` — ${selectedProducts.length}개 선택됨` : ''}`
                              : "제품 선택"
                          }
                          value={productSearchQuery}
                          onChange={(e) => {
                            setProductSearchQuery(e.target.value);
                            setShowProductResults(true);
                          }}
                          onFocus={() => setShowProductResults(true)}
                          className="flex-1 bg-transparent text-xs placeholder-gray-400 focus:outline-none"
                          disabled={postType !== "비교발색샷" && selectedProducts.length >= 1}
                        />
                      </div>

                      {showProductResults && productResults.length > 0 && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowProductResults(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden z-20 max-h-60 overflow-y-auto">
                            {productResults.map((product) => {
                              const isSelected = selectedProducts.some(p => p.slug === product.slug);
                              const isDisabled = postType === "비교발색샷"
                                ? selectedProducts.length >= 20 && !isSelected
                                : selectedProducts.length >= 1 && !isSelected;

                              return (
                                <button
                                  key={product.slug}
                                  onClick={() => !isDisabled && handleProductSelect(product)}
                                  disabled={isDisabled || isSelected}
                                  className={`w-full text-left px-4 py-2.5 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 ${
                                    isSelected
                                      ? 'bg-gray-50 cursor-not-allowed opacity-50'
                                      : isDisabled
                                      ? 'cursor-not-allowed opacity-50'
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <img
                                    src={product.image}
                                    alt={product.nameKo}
                                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-800 truncate">{product.nameKo}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{product.nameEn}</p>
                                  </div>
                                  {isSelected && (
                                    <span className="text-xs text-gray-400">선택됨</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* 설명 입력 */}
              <textarea
                placeholder="제품에 대한 설명 혹은 트위터 링크를 붙여넣기해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-28 text-xs text-gray-700 placeholder-gray-300 focus:outline-none resize-none"
              />

              {/* 트위터 임베드 프리뷰 */}
              {tweetId && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center text-white" style={{ fontSize: '9px' }}>
                      𝕏
                    </div>
                    <span className="text-xs text-gray-500">트위터 포스트 감지됨</span>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <Tweet id={tweetId} />
                  </div>
                </div>
              )}

              {/* 선택된 이미지 미리보기 */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={img.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />
                      <button
                        onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 액션 바 */}
        <div className="border-t border-gray-200 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={!!tweetId || selectedImages.length >= 4}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs transition-colors ${
                  tweetId || selectedImages.length >= 4
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                title={
                  tweetId
                    ? "트위터 임베드 사용 중"
                    : selectedImages.length >= 4
                    ? "최대 4장까지 업로드 가능"
                    : "이미지 추가"
                }
              >
                <Image className="w-3.5 h-3.5" />
                <span>사진 {selectedImages.length > 0 ? `${selectedImages.length}/4` : "추가"}</span>
              </button>
            </div>

            <button
              onClick={handlePost}
              disabled={!title.trim() || isSubmitting}
              className={`px-5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                title.trim() && !isSubmitting
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "border border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "게시 중..." : "게시"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}