import { useParams } from "react-router";
import { API_BASE } from "../../config";
import { useState, useEffect, useRef } from "react";
import { UploadModal } from "../components/UploadModal";
import { Plus, Edit2, X, Check } from "lucide-react";

interface Product {
  slug: string;
  name: string;
  nameKo: string;
  image: string;
  swatchCount: number;
}

interface BrandDetail {
  slug: string;
  name: string;
  nameKo: string;
  logoUrl: string;
  products: Product[];
}

export function BrandDetailPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState<BrandDetail | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | undefined>();

  // 수정 모드
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNameKo, setEditedNameKo] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedLogoFile, setEditedLogoFile] = useState<File | null>(null);
  const [editedLogoPreview, setEditedLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      const res = await fetch(`${API_BASE}/api/brand/${slug}`, {
        credentials: "include"
      });
      const data = await res.json();
      setBrand(data);
    };

    fetchBrand();
  }, [slug]);

  const handleEditClick = () => {
    if (!brand) return;
    setEditedNameKo(brand.nameKo);
    setEditedName(brand.name);
    setEditedLogoFile(null);
    setEditedLogoPreview(null);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedLogoFile(null);
    setEditedLogoPreview(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditedLogoFile(file);
    setEditedLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!brand) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({
        name: editedName,
        nameKo: editedNameKo,
      })], { type: "application/json" }));
      if (editedLogoFile) {
        formData.append("image", editedLogoFile);
      }

      const res = await fetch(`${API_BASE}/api/brand/${slug}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setBrand(data);
      }
    } catch (e) {
      console.error("브랜드 저장 실패", e);
    } finally {
      setIsSaving(false);
      setIsEditMode(false);
      setEditedLogoFile(null);
      setEditedLogoPreview(null);
    }
  };

  if (!brand) return <div>로딩중...</div>;

  return (
    <div className="min-h-screen bg-white">
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        productSlug={selectedProductSlug}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 브랜드 헤더 */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-200">
          {/* 로고 */}
          <div
            className={`w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 ${isEditMode ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            onClick={() => isEditMode && logoInputRef.current?.click()}
          >
            <img
              src={editedLogoPreview ?? brand.logoUrl}
              alt={brand.nameKo}
              className="w-full h-full object-cover"
            />
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />

          {/* 브랜드 이름 */}
          <div className="flex-1">
            {isEditMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedNameKo}
                  onChange={(e) => setEditedNameKo(e.target.value)}
                  className="text-2xl font-semibold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-gray-600 w-full bg-transparent"
                  placeholder="브랜드 한국어명"
                />
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-sm text-gray-400 border-b border-gray-200 focus:outline-none focus:border-gray-400 w-full bg-transparent"
                  placeholder="브랜드 영문명"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-gray-900">{brand.nameKo}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{brand.name}</p>
                <p className="text-xs text-gray-400 mt-2">총 {brand.products.length}개의 제품</p>
              </>
            )}
          </div>

          {/* 우측 버튼 */}
          <div className="flex items-center gap-2 ml-auto">
            {isEditMode ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>취소</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-lg text-xs text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? "저장 중..." : "저장"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>수정</span>
              </button>
            )}
          </div>
        </div>

        {/* 제품 리스트 */}
        <div>
          <div className="flex items-center mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">// 제품 목록</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {brand.products.map((product) => (
              <div
                key={product.slug}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
              >
                {/* 제품 이미지 */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nameKo}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 제품 정보 */}
                <div className="px-3 py-2.5 border-t border-gray-100">
                  <h3 className="text-xs font-medium text-gray-800 truncate">{product.nameKo}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-gray-400">발색샷 {product.swatchCount}개</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductSlug(product.slug);
                        setUploadModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
                      style={{ border: "1px solid #AE4DFF", background: "#F5E6FF", color: "#AE4DFF" }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>스와치 추가</span>
                    </button>
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
