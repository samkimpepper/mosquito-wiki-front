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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 브랜드 헤더 */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
            <img
              src={brand.logoUrl}
              alt={brand.nameKo}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{brand.nameKo}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{brand.name}</p>
            <p className="text-xs text-gray-400 mt-2">총 {brand.products.length}개의 제품</p>
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
                  <p className="text-xs text-gray-400 mt-1.5">발색샷 {product.swatchCount}개</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}