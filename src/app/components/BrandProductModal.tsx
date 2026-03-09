import { X, ChevronDown, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useRef } from "react";

interface BrandProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandProductModal({ isOpen, onClose }: BrandProductModalProps) {
  const [modalType, setModalType] = useState<"브랜드" | "제품">("브랜드");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const swatchInputRef = useRef<HTMLInputElement>(null);

  // 브랜드 관련 state
  const [brandNameKo, setBrandNameKo] = useState("");
  const [brandNameEn, setBrandNameEn] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  
  // 제품 관련 state
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<{ id: number; name: string; logo: string } | null>(null);
  const [showBrandResults, setShowBrandResults] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; nameKo: string; nameEn: string; brand: string; image: string } | null>(null);
  const [showProductResults, setShowProductResults] = useState(false);
  const [productNameKo, setProductNameKo] = useState("");
  const [productNameEn, setProductNameEn] = useState("");
  const [colorOptionKo, setColorOptionKo] = useState("");
  const [colorOptionEn, setColorOptionEn] = useState("");
  const [officialSwatchImage, setOfficialSwatchImage] = useState<string | null>(null);
  
  // 샘플 브랜드 데이터
  const sampleBrands = [
    { id: 1, name: "헤라", logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" },
    { id: 2, name: "에스쁘아", logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
    { id: 3, name: "롬앤", logo: "https://images.unsplash.com/photo-1631214524220-6b8b04cda6ba?w=400" },
    { id: 4, name: "클리오", logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400" },
    { id: 5, name: "페리페라", logo: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400" },
  ];

  // 샘플 제품 데이터
  const sampleProducts = [
    { id: 1, nameKo: "센슈얼 스파이시 누드 글로스", nameEn: "Sensual Spicy Nude Gloss", brand: "헤라", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400" },
    { id: 2, nameKo: "루즈 홀릭", nameEn: "Rouge Holic", brand: "헤라", image: "https://images.unsplash.com/photo-1631730486784-9b191e821063?w=400" },
    { id: 3, nameKo: "립큐브", nameEn: "Lip Cube", brand: "롬앤", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400" },
    { id: 4, nameKo: "프로 싱글 섀도우", nameEn: "Pro Single Shadow", brand: "클리오", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400" },
    { id: 5, nameKo: "잉크 더 벨벳", nameEn: "Ink The Velvet", brand: "페리페라", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400" },
  ];
  
  const filteredBrands = sampleBrands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  const filteredProducts = sampleProducts.filter(product =>
    product.nameKo.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.nameEn.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoImage(url);
  };

  const handleSwatchUpload = () => {
    // 임시로 샘플 이미지 설정
    setOfficialSwatchImage("https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=400");
  };

  const handleSubmit = () => {
    console.log("등록:", {
      modalType,
      ...(modalType === "브랜드" 
        ? { brandNameKo, brandNameEn, logoImage }
        : { selectedBrand, productNameKo, productNameEn, colorOptionKo, colorOptionEn, officialSwatchImage }
      )
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900"
            >
              {modalType} 등록
              <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[160px]">
                  <button
                    onClick={() => {
                      setModalType("브랜드");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-100 ${
                      modalType === "브랜드" ? "bg-gray-50 font-medium" : "hover:bg-gray-50"
                    }`}
                  >
                    브랜드
                  </button>
                  <button
                    onClick={() => {
                      setModalType("제품");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      modalType === "제품" ? "bg-gray-50 font-medium" : "hover:bg-gray-50"
                    }`}
                  >
                    제품
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* 바디 */}
        <div className="p-6 space-y-5">
          {modalType === "브랜드" ? (
            <>
              {/* 브랜드명 (한글) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  브랜드명 (한글)
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={brandNameKo}
                    onChange={(e) => setBrandNameKo(e.target.value)}
                    placeholder="예: 헤라"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>

              {/* 브랜드명 (영어) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  브랜드명 (영어)
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={brandNameEn}
                    onChange={(e) => setBrandNameEn(e.target.value)}
                    placeholder="예: HERA"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>

              {/* 브랜드 로고 이미지 업로드 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  브랜드 로고 이미지
                </label>
                <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    />
                {logoImage ? (
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border-2 border-gray-200 group">
                    <img 
                      src={logoImage} 
                      alt="브랜드 로고"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setLogoImage(null)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full aspect-[2/1] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">브랜드 로고 이미지 추가</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 브랜드 검색 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  브랜드 검색
                </label>
                <div className="relative">
                  {selectedBrand ? (
                    // 선택된 브랜드 표시
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedBrand.logo} 
                          alt={selectedBrand.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedBrand.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    // 브랜드 검색 입력
                    <>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={brandSearchQuery}
                          onChange={(e) => {
                            setBrandSearchQuery(e.target.value);
                            setShowBrandResults(true);
                          }}
                          onFocus={() => setShowBrandResults(true)}
                          placeholder="브랜드명 입력"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                      </div>
                      
                      {/* 검색 결과 드롭다운 */}
                      {showBrandResults && filteredBrands.length > 0 && (
                        <>
                          {/* 배경 클릭시 닫기 */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowBrandResults(false)}
                          />
                          
                          {/* 검색 결과 리스트 */}
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 max-h-60 overflow-y-auto">
                            {filteredBrands.map((brand) => (
                              <button
                                key={brand.id}
                                onClick={() => {
                                  setSelectedBrand(brand);
                                  setBrandSearchQuery("");
                                  setShowBrandResults(false);
                                }}
                                className="w-full text-left px-4 py-3 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 hover:bg-gray-50"
                              >
                                <img 
                                  src={brand.logo} 
                                  alt={brand.name}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{brand.name}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* 제품명 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  제품명
                </label>
                <div className="relative">
                  {selectedProduct ? (
                    // 선택된 제품 표시
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.nameKo}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedProduct.nameKo}</p>
                          <p className="text-xs text-gray-500">{selectedProduct.nameEn}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          setProductNameKo("");
                          setProductNameEn("");
                        }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    // 제품 검색 입력
                    <>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                          type="text"
                          value={productSearchQuery}
                          onChange={(e) => {
                            setProductSearchQuery(e.target.value);
                            setShowProductResults(true);
                          }}
                          onFocus={() => setShowProductResults(true)}
                          placeholder="제품명 검색 (한글 또는 영어)"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                            {filteredProducts.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setProductNameKo(product.nameKo);
                                  setProductNameEn(product.nameEn);
                                  setProductSearchQuery("");
                                  setShowProductResults(false);
                                }}
                                className="w-full text-left px-4 py-3 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 hover:bg-gray-50"
                              >
                                <img 
                                  src={product.image} 
                                  alt={product.nameKo}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{product.nameKo}</p>
                                  <p className="text-xs text-gray-500 truncate">{product.nameEn}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                
                {/* 한글/영어 제품명 표시 (선택된 경우에만) */}
                {selectedProduct && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                      <span className="text-xs text-gray-500 block mb-1">한글</span>
                      {productNameKo}
                    </div>
                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                      <span className="text-xs text-gray-500 block mb-1">영어</span>
                      {productNameEn}
                    </div>
                  </div>
                )}
              </div>

              {/* 색상 옵션 (선택사항) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  색상 옵션 <span className="text-gray-400 text-xs">(선택사항)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={colorOptionKo}
                    onChange={(e) => setColorOptionKo(e.target.value)}
                    placeholder="한글 (예: 레드)"
                    className="px-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <input
                    type="text"
                    value={colorOptionEn}
                    onChange={(e) => setColorOptionEn(e.target.value)}
                    placeholder="영어 (예: Red)"
                    className="px-4 py-3 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>

              {/* 공식 스와치 이미지 업로드 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  공식 스와치 이미지
                </label>
                <input
                ref={swatchInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSwatchUpload}
                />

                {officialSwatchImage ? (
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border-2 border-gray-200 group">
                    <img 
                      src={officialSwatchImage} 
                      alt="공식 스와치"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => swatchInputRef.current?.click()}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSwatchUpload}
                    className="w-full aspect-[2/1] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">공홈발색 추가</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={
              (modalType === "브랜드" && (!brandNameKo || !brandNameEn || !logoImage)) ||
              (modalType === "제품" && (!selectedBrand || !productNameKo || !productNameEn || !officialSwatchImage))
            }
            className="px-6 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}