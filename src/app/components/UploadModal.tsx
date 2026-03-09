import { X, Image, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Tweet } from "react-tweet";
import { useAuth } from "../../context/AuthContext";
import defaultProfile from "../../assets/default_profile.jpg";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 목 데이터 (실제로는 서버에서 받아올 데이터)
const mockProducts = [
  { id: 1, name: "아나스타샤 아이스드 아웃", brand: "아나스타샤 비버리힐즈", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200" },
  { id: 2, name: "아나스타샤 립 벨벳", brand: "아나스타샤 비버리힐즈", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200" },
  { id: 3, name: "롬앤 주시 래스팅 티트", brand: "롬앤", image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=200" },
  { id: 4, name: "페리페라 잉크 더 벨벳", brand: "페리페라", image: "https://images.unsplash.com/photo-1633479397973-7e69133f1c02?w=200" },
  { id: 5, name: "맥 루비우", brand: "맥", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200" },
  { id: 6, name: "디올 어딕트 립스틱", brand: "디올", image: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=200" },
  { id: 7, name: "샤넬 루즈 알뤼르", brand: "샤넬", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200" },
  { id: 8, name: "에스쁘아 리얼 캐시미어", brand: "에스쁘아", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200" },
];

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [postType, setPostType] = useState("발색샷");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();
  
  // 제품 검색 관련 state
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{ id: number; name: string; brand: string; image: string }[]>([]);
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

  if (!isOpen) return null;

  const handlePost = () => {
    // 게시물 업로드 로직 (tweetUrl이 코드상 변수에 저장되어 있음)
    console.log({ title, description, selectedImages, postType, selectedProducts, tweetUrl, tweetId });
    onClose();
    // 초기화
    setTitle("");
    setDescription("");
    setSelectedImages([]);
    setPostType("발색샷");
    setProductSearchQuery("");
    setSelectedProducts([]);
    setTweetId(null);
    setTweetUrl("");
  };

  const postTypes = ["발색샷", "비교발색샷", "조합"];

  // 제품 검색 필터링
  const filteredProducts = productSearchQuery.trim()
    ? mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(productSearchQuery.toLowerCase())
      )
    : [];

  const handleProductSelect = (product: { id: number; name: string; brand: string; image: string }) => {
    const isComparison = postType === "비교발색샷";
    const maxProducts = isComparison ? 20 : 1;
    
    // 중복 체크
    if (selectedProducts.some(p => p.id === product.id)) {
      return;
    }
    
    // 최대 개수 체크
    if (selectedProducts.length >= maxProducts) {
      return;
    }
    
    if (isComparison) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts([product]);
    }
    
    setProductSearchQuery("");
    setShowProductResults(false);
  };
  
  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700">
            임시저장
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-3">
            {/* 프로필 사진 */}
            <div className="flex-shrink-0">
              <img
                src={user?.profileImageUrl ?? defaultProfile}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>

            {/* 입력 영역 */}
            <div className="flex-1 space-y-4">
              {/* 커스텀 드롭다운 */}
              <div className="relative inline-block">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  <span>{postType}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {dropdownOpen && (
                  <>
                    {/* 드롭다운 배경 클릭시 닫기 */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    
                    {/* 드롭다운 메뉴 */}
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[140px]">
                      {postTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setPostType(type);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            type === postType
                              ? "bg-gray-100 text-gray-900"
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
                className="w-full text-lg placeholder-gray-400 focus:outline-none"
              />

              {/* 제품 검색 */}
              <div className="space-y-2">
                {/* 선택된 제품 목록 (비교발색샷인 경우에만 여러 개 표시) */}
                {selectedProducts.length > 0 && postType === "비교발색샷" && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-gray-100 rounded-full text-sm"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-6 h-6 object-cover rounded-full flex-shrink-0"
                        />
                        <span className="text-gray-900 max-w-[150px] truncate">{product.name}</span>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </div>
                    ))}
                    {selectedProducts.length < 20 && (
                      <span className="text-xs text-gray-400 self-center ml-1">
                        {selectedProducts.length}/20
                      </span>
                    )}
                  </div>
                )}
                
                {/* 제품 검색 인터페이스 */}
                <div className="relative">
                  {selectedProducts.length > 0 && postType !== "비교발색샷" ? (
                    // 단일 선택 제품 표시 (발색샷, 조합)
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedProducts[0].image} 
                          alt={selectedProducts[0].name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedProducts[0].name}</p>
                          <p className="text-xs text-gray-500">{selectedProducts[0].brand}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedProducts([])}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    // 제품 검색 입력
                    <>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder={
                            postType === "비교발색샷"
                              ? `제품 선택 (최대 20개)${selectedProducts.length > 0 ? ` - ${selectedProducts.length}개 선택됨` : ''}`
                              : "제품 선택"
                          }
                          value={productSearchQuery}
                          onChange={(e) => {
                            setProductSearchQuery(e.target.value);
                            setShowProductResults(true);
                          }}
                          onFocus={() => setShowProductResults(true)}
                          className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none"
                          disabled={postType !== "비교발색샷" && selectedProducts.length >= 1}
                        />
                      </div>
                      
                      {/* 검색 결과 드롭다운 */}
                      {showProductResults && filteredProducts.length > 0 && (
                        <>
                          {/* 배경 클릭시 닫기 */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowProductResults(false)}
                          />
                          
                          {/* 검색 결과 리스트 */}
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 max-h-60 overflow-y-auto">
                            {filteredProducts.map((product) => {
                              const isSelected = selectedProducts.some(p => p.id === product.id);
                              const isDisabled = postType === "비교발색샷" 
                                ? selectedProducts.length >= 20 && !isSelected
                                : selectedProducts.length >= 1 && !isSelected;
                              
                              return (
                                <button
                                  key={product.id}
                                  onClick={() => !isDisabled && handleProductSelect(product)}
                                  disabled={isDisabled || isSelected}
                                  className={`w-full text-left px-4 py-3 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 ${
                                    isSelected 
                                      ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                                      : isDisabled
                                      ? 'cursor-not-allowed opacity-50'
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
                                  </div>
                                  {isSelected && (
                                    <span className="text-xs text-gray-500">선택됨</span>
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
                className="w-full h-32 text-base placeholder-gray-400 focus:outline-none resize-none"
              />
              
              {/* 트위터 임베드 프리뷰 */}
              {tweetId && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 -mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs">
                      𝕏
                    </div>
                    <span className="text-sm text-gray-600">트위터 포스트 감지됨</span>
                  </div>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <Tweet id={tweetId} />
                  </div>
                </div>
              )}

              {/* 선택된 이미지 미리보기 */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() =>
                          setSelectedImages(selectedImages.filter((_, i) => i !== index))
                        }
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 액션 바 */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 아이콘 버튼들 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (!tweetId && selectedImages.length < 4) {
                    // 이미지 업로드 로직 (임시로 샘플 이미지 추가)
                    setSelectedImages([
                      ...selectedImages,
                      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=400",
                    ]);
                  }
                }}
                disabled={!!tweetId || selectedImages.length >= 4}
                className={`p-2 rounded-full transition-colors ${
                  tweetId || selectedImages.length >= 4
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                title={
                  tweetId 
                    ? "트위터 임베드 사용 중" 
                    : selectedImages.length >= 4 
                    ? "최대 4장까지 업로드 가능" 
                    : "이미지 추가"
                }
              >
                <Image className="w-5 h-5" />
              </button>
              <span className={`text-sm ${tweetId || selectedImages.length >= 4 ? "text-gray-400" : "text-gray-600"}`}>
                사진 업로드 {selectedImages.length > 0 && `(${selectedImages.length}/4)`}
              </span>
            </div>

            {/* 게시 버튼 */}
            <button
              onClick={handlePost}
              disabled={!title.trim()}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                title.trim()
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={!title.trim() ? "제목을 입력해주세요" : ""}
            >
              게시
            </button>
          </div>
          
          {/* 유효성 검증 메시지 */}
          {!title.trim() && (
            <p className="text-xs text-gray-500 mt-2 text-right">
              * 제목은 필수 입력 항목입니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}