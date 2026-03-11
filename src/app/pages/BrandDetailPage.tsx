import { useParams } from "react-router";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchBrand = async () => {
      const res = await fetch(`http://localhost:8080/api/brand/${slug}`, {
        credentials: "include"
      });
      const data = await res.json();
      setBrand(data);
    };

    fetchBrand();
  }, [slug]);


  if (!brand) return <div>로딩중...</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 브랜드 헤더 */}
        <div className="flex items-center gap-6 mb-12 pb-8 border-b border-gray-200">
          {/* 브랜드 로고 */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
            <img 
              src={brand.logoUrl} 
              alt={brand.nameKo}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 브랜드 정보 */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {brand.nameKo}
            </h1>
            <p className="text-lg text-gray-500">
              {brand.name}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {brand.products.length}개의 제품
            </p>
          </div>
        </div>

        {/* 제품 리스트 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">제품 목록</h2>
          
          {/* 그리드 레이아웃 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brand.products.map((product) => (
              <div
                key={product.slug}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* 제품 이미지 */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.nameKo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* 제품 정보 */}
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900 mb-0.5 truncate">
                    {product.nameKo}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      발색샷 {product.swatchCount}개
                    </span>
                    <button className="text-xs text-gray-900 font-medium hover:underline">
                      보기 →
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