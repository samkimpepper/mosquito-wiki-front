import { X, ChevronDown, Plus, Search } from "lucide-react";
import { API_BASE } from "../../config";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import defaultProfile from "../../assets/default_profile.jpg";
import { ImageUploader } from "./ImageUploader";

interface BrandProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBrandSlug?: string;
  selectedProductSlug?: string;
}

export function BrandProductModal({ isOpen, onClose, selectedBrandSlug, selectedProductSlug }: BrandProductModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const [modalType, setModalType] = useState<"브랜드" | "제품">("브랜드");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredBrandId, setRegisteredBrandId] = useState<string | null>(null);
  const [registeredProductSlug, setRegisteredProductSlug] = useState<string | null>(null);

  const brandNameInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const swatchInputRef = useRef<HTMLInputElement>(null);

  // 브랜드 관련 state
  const [brandNameKo, setBrandNameKo] = useState("");
  const [brandNameEn, setBrandNameEn] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [brandNameError, setBrandNameError] = useState("");
  
  // 제품 관련 state
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<{ slug: string; name: string; nameKo: string; logo: string } | null>(null);
  const [showBrandResults, setShowBrandResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ slug: string; name: string } | null>(null);
  const [categories, setCategories] = useState<{ slug: string; name: string; }[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<{ slug: string; nameKo: string; nameEn: string; image: string } | null>(null);
  const [showProductResults, setShowProductResults] = useState(false);
  const [productNameKo, setProductNameKo] = useState("");
  const [productNameEn, setProductNameEn] = useState("");
  const [colorOptionKo, setColorOptionKo] = useState("");
  const [colorOptionEn, setColorOptionEn] = useState("");
  const [officialSwatchImage, setOfficialSwatchImage] = useState<string | null>(null);
  const [officialSwatchImages, setOfficialSwatchImages] = useState<Array<{ id: string; file: File | null; existingUrl: string | null }>>([]);
  const [description, setDescription] = useState("");


  const [brandResults, setBrandResults] = useState<{ slug: string; name: string; nameKo: string; logo: string }[]>([]);


  useEffect(() => {
    if (selectedBrandSlug) {
      fetch(`${API_BASE}/api/brand/info/${encodeURIComponent(selectedBrandSlug)}`, {
        credentials: "include"
      })
      .then(res => res.json())
      .then(data => setSelectedBrand({
        ...data,
        logo: `${API_BASE}${data.logoUrl}`
      }));
    }

    const fetchCategories = fetch(`${API_BASE}/api/category`, { credentials: "include" })
      .then(res => res.json());

    const fetchProduct = selectedProductSlug
      ? fetch(`${API_BASE}/api/product/info/${encodeURIComponent(selectedProductSlug)}`, { credentials: "include" })
          .then(res => res.json())
      : Promise.resolve(null);

    Promise.all([fetchCategories, fetchProduct]).then(([categories, product]) => {
      setCategories(categories);

      if (product) {
        setModalType("제품");
        setSelectedProduct({ ...product, image: product.image });
        setProductNameEn(product.name);
        setProductNameKo(product.nameKo);
        const matched = categories.find((c: { slug: string; name: string }) => c.slug === product.categorySlug);
        if (matched) setSelectedCategory(matched);
      }
    });
  }, []);

  useEffect(() => {
  if (!brandSearchQuery.trim()) {
    setBrandResults([]);
    return;
  }


  const timer = setTimeout(async () => {
    const res = await fetch(`${API_BASE}/api/brand/search?keyword=${encodeURIComponent(brandSearchQuery)}`, {
      credentials: "include"
    });
    const data = await res.json();
    setBrandResults(data.map((item: any) => ({
        ...item,
        logo: item.logoUrl ? `${API_BASE}${item.logoUrl}` : defaultProfile
    })));
  }, 150); // 타이핑 멈추고 300ms 후 요청

  return () => clearTimeout(timer); // 타이핑 중엔 이전 타이머 취소
}, [brandSearchQuery]);

const [productResults, setProductResults] = useState<{ slug: string; nameKo: string; nameEn: string; image: string }[]>([]);

useEffect(() => {
  if (!productSearchQuery.trim()) {
    setProductResults([]);
    return;
  }

  const timer = setTimeout(async () => {
    const res = await fetch(`${API_BASE}/api/product/search?keyword=${encodeURIComponent(productSearchQuery)}`, {
      credentials: "include"
    });
    const data = await res.json();
    setProductResults(data.map((item: any) => ({
        ...item,
        image: item.image ? `${API_BASE}${item.image}` : defaultProfile,
    })));
  }, 150);

  return () => clearTimeout(timer);
}, [productSearchQuery]);
  
  /*const filteredBrands = sampleBrands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );*/

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoImage(url);
  };

  const handleSwatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOfficialSwatchImage(url);
  };

  const handleSubmit = async () => {
    console.log("등록:", {
      modalType,
      ...(modalType === "브랜드" 
        ? { brandNameKo, brandNameEn, logoImage }
        : { selectedBrand, productNameKo, productNameEn, colorOptionKo, colorOptionEn, officialSwatchImage }
      )
    });

    if (modalType == "브랜드") {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify({
          name: brandNameEn,
          nameKo: brandNameKo,
        })], { type: "application/json" }));

        const file = logoInputRef.current?.files?.[0];
        if (file) formData.append("image", file);

        const res = await fetch(`${API_BASE}/api/brand`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          //
          setErrorMessage(data.message);
          setShowFailureModal(true);
          return;
        }

        setRegisteredBrandId(data.slug);
    } else if (modalType == "제품") {
        const formData = new FormData();
        console.log(selectedBrand);
        formData.append("data", new Blob([JSON.stringify({
          name: productNameEn,
          nameKo: productNameKo,
          brandSlug: selectedBrand?.slug,
          parentProductSlug: selectedProduct?.slug,
          option: colorOptionEn,
          optionKo: colorOptionKo,
          categorySlug: selectedCategory?.slug,
          description: description
        })], { type: "application/json" }));

        for (const item of officialSwatchImages) {
          if (item.file) formData.append("images", item.file);
        }

        //const file = swatchInputRef.current?.files?.[0];
        //if (file) formData.append("image", file);

        const res = await fetch(`${API_BASE}/api/product`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          //
          setErrorMessage(data.message);
          setShowFailureModal(true);
          return;
        }

        setRegisteredProductSlug(data.slug);
    }

    setShowSuccessModal(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    onClose();
    // 모든 입력 초기화
    setBrandNameKo("");
    setBrandNameEn("");
    setLogoImage(null);
    setSelectedBrand(null);
    setSelectedProduct(null);
    setProductNameKo("");
    setProductNameEn("");
    setColorOptionKo("");
    setColorOptionEn("");
    setOfficialSwatchImage(null);
    setRegisteredBrandId(null);
    setDescription("");
  };

  const handleGoToBrand = () => {
    if (registeredBrandId) {
      navigate(`/brand/${registeredBrandId}`);
      handleSuccessConfirm();
    } else if (registeredProductSlug) {
      navigate(`/product/${registeredProductSlug}`);
      handleSuccessConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-2 flex items-center justify-between rounded-t-xl z-10">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span className="text-gray-400">// {modalType} 등록</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden z-20 min-w-[120px]">
                  <button
                    onClick={() => { setModalType("브랜드"); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors border-b border-gray-100 ${modalType === "브랜드" ? "bg-gray-50 font-medium" : "hover:bg-gray-50"}`}
                  >
                    // 브랜드 등록
                  </button>
                  <button
                    onClick={() => { setModalType("제품"); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${modalType === "제품" ? "bg-gray-50 font-medium" : "hover:bg-gray-50"}`}
                  >
                    // 제품 등록
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="w-px self-stretch bg-gray-200 mx-2 -my-2" />

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-5 space-y-4">
          {modalType === "브랜드" ? (
            <>
              {/* 브랜드명 (한글) */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">브랜드명 (한글)</label>
                <input
                  type="text"
                  value={brandNameKo}
                  onChange={(e) => setBrandNameKo(e.target.value)}
                  placeholder="예: 헤라"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-300 focus:outline-none hover:border-gray-300 transition-colors"
                />
              </div>

              {/* 브랜드명 (영어) */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">브랜드명 (영어)</label>
                <input
                  type="text"
                  value={brandNameEn}
                  onChange={(e) => setBrandNameEn(e.target.value)}
                  placeholder="예: HERA"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-300 focus:outline-none hover:border-gray-300 transition-colors"
                />
              </div>

              {/* 브랜드 로고 이미지 업로드 */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">브랜드 로고 이미지</label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                {logoImage ? (
                  <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-gray-200 group">
                    <img
                      src={logoImage}
                      alt="브랜드 로고"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setLogoImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full aspect-[2/1] border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-gray-300" />
                    <span className="block text-xs text-gray-600">브랜드 로고 이미지 추가</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 브랜드 검색 */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">브랜드</label>
                <div className="relative">
                  {selectedBrand ? (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedBrand.logo}
                          alt={selectedBrand.name}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-800">{selectedBrand.nameKo}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{selectedBrand.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={brandSearchQuery}
                          onChange={(e) => { setBrandSearchQuery(e.target.value); setShowBrandResults(true); }}
                          onFocus={() => setShowBrandResults(true)}
                          placeholder="브랜드명 입력"
                          className="flex-1 bg-transparent text-xs placeholder-gray-300 focus:outline-none"
                        />
                      </div>

                      {showBrandResults && brandResults.length > 0 && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowBrandResults(false)} />
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden z-20 max-h-60 overflow-y-auto">
                            {brandResults.map((brand) => (
                              <button
                                key={brand.slug}
                                onClick={() => { setSelectedBrand(brand); setBrandSearchQuery(""); setShowBrandResults(false); }}
                                className="w-full text-left px-4 py-2.5 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 hover:bg-gray-50"
                              >
                                <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-800 truncate">{brand.nameKo}</p>
                                  <p className="text-xs text-gray-400 mt-0.5 truncate">{brand.name}</p>
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
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">제품명</label>
                <div className="relative">
                  {selectedProduct ? (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={`${API_BASE}${selectedProduct.image}`}
                          alt={selectedProduct.nameKo}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-800">{selectedProduct.nameKo}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{selectedProduct.nameEn}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedProduct(null); setProductNameKo(""); setProductNameEn(""); }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0 z-10" />
                        <input
                          type="text"
                          value={productSearchQuery}
                          onChange={(e) => { setProductSearchQuery(e.target.value); setProductNameEn(e.target.value); setProductNameKo(e.target.value); setShowProductResults(true); }}
                          onFocus={() => setShowProductResults(true)}
                          placeholder="제품명 검색 (한글 또는 영어)"
                          className="flex-1 bg-transparent text-xs placeholder-gray-300 focus:outline-none"
                        />
                      </div>

                      {showProductResults && productResults.length > 0 && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowProductResults(false)} />
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden z-20 max-h-60 overflow-y-auto">
                            {productResults.map((product) => (
                              <button
                                key={product.slug}
                                onClick={() => { setSelectedProduct(product); setProductNameKo(product.nameKo); setProductNameEn(product.nameEn); setProductSearchQuery(""); setShowProductResults(false); }}
                                className="w-full text-left px-4 py-2.5 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 hover:bg-gray-50"
                              >
                                <img src={`${API_BASE}${product.image}`} alt={product.nameKo} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-800 truncate">{product.nameKo}</p>
                                  <p className="text-xs text-gray-400 mt-0.5 truncate">{product.nameEn}</p>
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

              {/* 카테고리 선택 */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">카테고리</label>
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-left focus:outline-none hover:border-gray-300 flex items-center justify-between transition-colors"
                  >
                    <span className={selectedCategory ? "text-gray-800" : "text-gray-300"}>
                      {selectedCategory?.name || "카테고리 선택"}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCategoryDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden z-20 max-h-60 overflow-y-auto">
                        {categories.map((category) => (
                          <button
                            key={category.slug}
                            onClick={() => { setSelectedCategory({ slug: category.slug, name: category.name }); setShowCategoryDropdown(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors border-b border-gray-100 last:border-b-0 ${selectedCategory?.slug === category.slug ? 'bg-gray-50 font-medium text-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 색상 옵션 */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">색상 옵션 <span className="text-gray-300">(선택사항)</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={colorOptionKo}
                    onChange={(e) => setColorOptionKo(e.target.value)}
                    placeholder="한글 (예: 레드)"
                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-300 focus:outline-none hover:border-gray-300 transition-colors"
                  />
                  <input
                    type="text"
                    value={colorOptionEn}
                    onChange={(e) => setColorOptionEn(e.target.value)}
                    placeholder="영어 (예: Red)"
                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-300 focus:outline-none hover:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              {/* 공식 스와치 이미지 업로드 */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">공식 스와치 이미지</label>
                <ImageUploader
                  initialImages={[]}
                  onChange={(items) => { setOfficialSwatchImages(items); }}
                />
              </div>

              {/* 제품 설명 */}
              <div className="space-y-3">
                <label className="block text-xs text-gray-600">제품 설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="제품에 대한 설명을 입력하세요."
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-300 focus:outline-none hover:border-gray-300 transition-colors resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-3 flex justify-end rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={
              (modalType === "브랜드" && (!brandNameKo || !brandNameEn || !logoImage)) ||
              (modalType === "제품" && (!selectedBrand || !productNameKo))
            }
            className="px-5 py-2 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            등록
          </button>
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-sm bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="mb-5">
              <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">등록 완료</h3>
              <p className="block text-xs text-gray-600">
                {modalType === "브랜드" ? "브랜드가" : "제품이"} 성공적으로 등록되었습니다.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSuccessConfirm}
                className="flex-1 px-4 py-2 border border-gray-200 text-xs text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                확인
              </button>
              <button
                onClick={handleGoToBrand}
                className="flex-1 px-4 py-2 bg-gray-900 text-xs text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                보러가기
              </button>
            </div>
          </div>
        </div>
      )}

      {showFailureModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-sm bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="mb-5">
              <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">등록 실패</h3>
              <p className="block text-xs text-gray-600">{errorMessage}</p>
            </div>
            <button
              onClick={() => setShowFailureModal(false)}
              className="w-full px-4 py-2 border border-gray-200 text-xs text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
